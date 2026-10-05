/* eslint-disable */
/* tslint:disable */
// @ts-nocheck

export interface CategoryDto {
    id?: number;
    name?: string;
    parentCategoryId?: number | null;
    isActive?: boolean;
    sortOrder?: number;
    isRestricted?: boolean;
    minSoldOrders?: number | null;
}

export interface ListingDto {
    id?: number;
    title?: string;
    description?: string | null;
    price?: number;
    stock?: number;
    lowStockThreshold?: number | null;
    isActive?: boolean;
    isOutOfStock?: boolean;
    categoryId?: number;
    imageUrl?: string | null;
}

export interface BulkUpdateRequest {
    ids?: number[];
    price?: number | null;
    stock?: number | null;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
    secure?: boolean;
    path: string;
    type?: ContentType;
    query?: QueryParamsType;
    format?: ResponseFormat;
    body?: unknown;
    baseUrl?: string;
    cancelToken?: CancelToken;
}

export type RequestParams = Omit<
    FullRequestParams,
    "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown> {
    baseUrl?: string;
    baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
    securityWorker?: (
        securityData: SecurityDataType | null,
    ) => Promise<RequestParams | void> | RequestParams | void;
    customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
    extends Response {
    data: D;
    error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
    Json = "application/json",
    JsonApi = "application/vnd.api+json",
    FormData = "multipart/form-data",
    UrlEncoded = "application/x-www-form-urlencoded",
    Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
    public baseUrl: string = "";
    private securityData: SecurityDataType | null = null;
    private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
    private abortControllers = new Map<CancelToken, AbortController>();
    private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
        fetch(...fetchParams);

    private baseApiParams: RequestParams = {
        credentials: "same-origin",
        headers: {},
        redirect: "follow",
        referrerPolicy: "no-referrer",
    };

    constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
        Object.assign(this, apiConfig);
    }

    public setSecurityData = (data: SecurityDataType | null) => {
        this.securityData = data;
    };

    protected encodeQueryParam(key: string, value: any) {
        const encodedKey = encodeURIComponent(key);
        return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
    }

    protected addQueryParam(query: QueryParamsType, key: string) {
        return this.encodeQueryParam(key, query[key]);
    }

    protected addArrayQueryParam(query: QueryParamsType, key: string) {
        const value = query[key];
        return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
    }

    protected toQueryString(rawQuery?: QueryParamsType): string {
        const query = rawQuery || {};
        const keys = Object.keys(query).filter(
            (key) => "undefined" !== typeof query[key],
        );
        return keys
            .map((key) =>
                Array.isArray(query[key])
                    ? this.addArrayQueryParam(query, key)
                    : this.addQueryParam(query, key),
            )
            .join("&");
    }

    protected addQueryParams(rawQuery?: QueryParamsType): string {
        const queryString = this.toQueryString(rawQuery);
        return queryString ? `?${queryString}` : "";
    }

    private contentFormatters: Record<ContentType, (input: any) => any> = {
        [ContentType.Json]: (input: any) =>
            input !== null && (typeof input === "object" || typeof input === "string")
                ? JSON.stringify(input)
                : input,
        [ContentType.JsonApi]: (input: any) =>
            input !== null && (typeof input === "object" || typeof input === "string")
                ? JSON.stringify(input)
                : input,
        [ContentType.Text]: (input: any) =>
            input !== null && typeof input !== "string"
                ? JSON.stringify(input)
                : input,
        [ContentType.FormData]: (input: any) => {
            if (input instanceof FormData) {
                return input;
            }
            return Object.keys(input || {}).reduce((formData, key) => {
                const property = input[key];
                formData.append(
                    key,
                    property instanceof Blob
                        ? property
                        : typeof property === "object" && property !== null
                            ? JSON.stringify(property)
                            : `${property}`,
                );
                return formData;
            }, new FormData());
        },
        [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
    };

    protected mergeRequestParams(
        params1: RequestParams,
        params2?: RequestParams,
    ): RequestParams {
        return {
            ...this.baseApiParams,
            ...params1,
            ...(params2 || {}),
            headers: {
                ...(this.baseApiParams.headers || {}),
                ...(params1.headers || {}),
                ...((params2 && params2.headers) || {}),
            },
        };
    }

    protected createAbortSignal = (
        cancelToken: CancelToken,
    ): AbortSignal | undefined => {
        if (this.abortControllers.has(cancelToken)) {
            const abortController = this.abortControllers.get(cancelToken);
            if (abortController) {
                return abortController.signal;
            }
            return void 0;
        }
        const abortController = new AbortController();
        this.abortControllers.set(cancelToken, abortController);
        return abortController.signal;
    };

    public abortRequest = (cancelToken: CancelToken) => {
        const abortController = this.abortControllers.get(cancelToken);
        if (abortController) {
            abortController.abort();
            this.abortControllers.delete(cancelToken);
        }
    };

    public request = async <T = any, E = any>({
                                                  body,
                                                  secure,
                                                  path,
                                                  type,
                                                  query,
                                                  format,
                                                  baseUrl,
                                                  cancelToken,
                                                  ...params
                                              }: FullRequestParams): Promise<HttpResponse<T, E>> => {
        const secureParams =
            ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
                this.securityWorker &&
                (await this.securityWorker(this.securityData))) ||
            {};
        const requestParams = this.mergeRequestParams(params, secureParams);
        const queryString = query && this.toQueryString(query);
        const payloadFormatter = this.contentFormatters[type || ContentType.Json];
        const responseFormat = format || requestParams.format;

        return this.customFetch(
            `${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`,
            {
                ...requestParams,
                headers: {
                    ...(requestParams.headers || {}),
                    ...(type && type !== ContentType.FormData
                        ? { "Content-Type": type }
                        : {}),
                },
                signal:
                    (cancelToken
                        ? this.createAbortSignal(cancelToken)
                        : requestParams.signal) || null,
                body:
                    typeof body === "undefined" || body === null
                        ? null
                        : payloadFormatter(body),
            },
        ).then(async (response) => {
            const r = response as HttpResponse<T, E>;
            r.data = null as unknown as T;
            r.error = null as unknown as E;

            const responseToParse = responseFormat ? response.clone() : response;
            const data = !responseFormat
                ? r
                : await responseToParse[responseFormat]()
                    .then((data) => {
                        if (r.ok) {
                            r.data = data;
                        } else {
                            r.error = data;
                        }
                        return r;
                    })
                    .catch((e) => {
                        r.error = e;
                        return r;
                    });

            if (cancelToken) {
                this.abortControllers.delete(cancelToken);
            }
            if (!response.ok) throw data;
            return data;
        });
    };
}

export class Api<
    SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
    api = {
        categoryGetAll: (params: RequestParams = {}) =>
            this.request<CategoryDto[], any>({
                path: `/api/category`,
                method: "GET",
                format: "json",
                ...params,
            }),

        categoryCreate: (data: CategoryDto, params: RequestParams = {}) =>
            this.request<CategoryDto, any>({
                path: `/api/category`,
                method: "POST",
                body: data,
                type: ContentType.Json,
                format: "json",
                ...params,
            }),

        categoryGetById: (id: number, params: RequestParams = {}) =>
            this.request<CategoryDto, any>({
                path: `/api/category/${id}`,
                method: "GET",
                format: "json",
                ...params,
            }),

        categoryUpdate: (id: number, data: CategoryDto, params: RequestParams = {}) =>
            this.request<CategoryDto, any>({
                path: `/api/category/${id}`,
                method: "PUT",
                body: data,
                type: ContentType.Json,
                format: "json",
                ...params,
            }),

        categoryDelete: (
            id: number,
            query?: { moveListingsToCategoryId?: number },
            params: RequestParams = {},
        ) =>
            this.request<void, any>({
                path: `/api/category/${id}`,
                method: "DELETE",
                query: query,
                ...params,
            }),

        categorySetActive: (id: number, data: boolean, params: RequestParams = {}) =>
            this.request<void, any>({
                path: `/api/category/${id}/active`,
                method: "PATCH",
                body: data,
                type: ContentType.Json,
                ...params,
            }),

        categorySetRestricted: (id: number, data: boolean, params: RequestParams = {}) =>
            this.request<void, any>({
                path: `/api/category/${id}/restricted`,
                method: "PATCH",
                body: data,
                type: ContentType.Json,
                ...params,
            }),

        listingGetAll: (params: RequestParams = {}) =>
            this.request<ListingDto[], any>({
                path: `/api/listing`,
                method: "GET",
                format: "json",
                ...params,
            }),

        listingCreate: (data: ListingDto, params: RequestParams = {}) =>
            this.request<ListingDto, any>({
                path: `/api/listing`,
                method: "POST",
                body: data,
                type: ContentType.Json,
                format: "json",
                ...params,
            }),

        listingGetById: (id: number, params: RequestParams = {}) =>
            this.request<ListingDto, any>({
                path: `/api/listing/${id}`,
                method: "GET",
                format: "json",
                ...params,
            }),

        listingUpdate: (id: number, data: ListingDto, params: RequestParams = {}) =>
            this.request<ListingDto, any>({
                path: `/api/listing/${id}`,
                method: "PUT",
                body: data,
                type: ContentType.Json,
                format: "json",
                ...params,
            }),

        listingSetActive: (id: number, data: boolean, params: RequestParams = {}) =>
            this.request<void, any>({
                path: `/api/listing/${id}/active`,
                method: "PATCH",
                body: data,
                type: ContentType.Json,
                ...params,
            }),

        listingBulkUpdate: (data: BulkUpdateRequest, params: RequestParams = {}) =>
            this.request<void, any>({
                path: `/api/listing/bulk`,
                method: "PATCH",
                body: data,
                type: ContentType.Json,
                ...params,
            }),
    };
}

export const api = new Api();