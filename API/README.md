Satin Road – Sustainability & Lighthouse Analysis

Date: 8 October 2026
Tool: Google Lighthouse v13.0.2
Page tested: Listings (landing page)
Mode: Navigation

Results

Category scores:
Performance: 98
Accessibility: 88
Best Practices: 100
SEO: 83

Performance (98)


Metrics:
First Contentful Paint: 0.7 s
Largest Contentful Paint: 1.1 s
Total Blocking Time: 0 ms
Cumulative Layout Shift: 0
Speed Index: 0.8 s



All Core Web Vitals are in the "good" (green) range.

Why this matters for sustainability
Static build served by nginx – no runtime rendering on the server.
Lightweight stack – a single small .NET container with SQLite, no separate database server.
Client-side cart (localStorage) – no extra API calls or server state until checkout.
No layout shift and zero blocking time – minimal wasted CPU work.
Filtering, searching and sorting happen in the browser on already-loaded data – no extra network requests.


Improvement opportunities

Findings and estimated savings:
Use efficient cache lifetimes: 497 KiB
Reduce unused JavaScript: 1,088 KiB
Minify JavaScript: 209 KiB
Improve image delivery: 194 KiB
Eliminate render-blocking requests: 40 ms

Possible fixes:

Add long Cache-Control lifetimes for hashed static assets in nginx.conf.
Serve resized, modern-format images (WebP/AVIF) and add loading="lazy".
Code-split routes with React.lazy so admin pages are not loaded on the public listings page.
Enable gzip in nginx for text assets.


Accessibility (88)

Issues found:
Some form elements do not have associated label elements.
The document has no main landmark.
Identical links should have the same purpose.

Possible fixes: connect labels to inputs with htmlFor/id, and wrap the page content in a main element.



Best Practices (100)

All checks passed, including the security and trust checks.



SEO (83)

Issues found:
The document has no meta description.
robots.txt is not valid (12 errors). Because nginx falls back to index.html for unknown paths, a request for /robots.txt returns the HTML page instead.
Possible fixes: add a meta description to src/index.html and add a valid robots.txt to the build output.

Conclusion
The application scores very well on performance (98) and best practices (100), which keeps data transfer and energy use low. The remaining work is mainly reducing unused JavaScript, adding caching and image optimization, and small accessibility and SEO fixes.