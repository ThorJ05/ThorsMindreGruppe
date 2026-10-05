FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY API/API.csproj API/
COPY Service/Service.csproj Service/
COPY Infrastructure/Infrastructure.csproj Infrastructure/
RUN dotnet restore API/API.csproj

COPY . .
RUN dotnet publish API/API.csproj -c Release -o /app

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app .

RUN mkdir -p /app/data

ENV ASPNETCORE_URLS=http://+:8080
ENV ConnectionStrings__Default="Data Source=/app/data/app.db"

EXPOSE 8080
ENTRYPOINT ["dotnet", "API.dll"]