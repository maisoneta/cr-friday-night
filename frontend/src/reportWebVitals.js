// File: frontend/src/reportWebVitals.js

/*
  Sets up performance monitoring for the React app using web-vitals.
  When a callback (onPerfEntry) is provided, collects:
  - Cumulative Layout Shift (CLS)
  - First Input Delay (FID)
  - First Contentful Paint (FCP)
  - Largest Contentful Paint (LCP)
  - Time to First Byte (TTFB)
*/

const reportWebVitals = onPerfEntry => {
  // Dynamically import web-vitals and pass metrics to the callback
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;
