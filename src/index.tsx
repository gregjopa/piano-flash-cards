import React from "react";
import ReactDOM from "react-dom/client";
import { onCLS, onFID, onLCP, Metric } from "web-vitals";

import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// https://github.com/GoogleChrome/web-vitals#using-gtagjs-universal-analytics
function sendToGoogleAnalytics({ name, delta, id }: Metric) {
  gtag("event", name, {
    event_category: "Web Vitals",
    // The `id` value will be unique to the current page load. When sending
    // multiple values from the same page (e.g. for CLS), Google Analytics can
    // compute a total by grouping on this ID (note: requires `eventLabel` to
    // be a dimension in your report).
    event_label: id,
    // Google Analytics metrics must be integers, so the value is rounded.
    // For CLS the value is first multiplied by 1000 for greater precision
    // (note: increase the multiplier for greater precision if needed).
    value: Math.round(name === "CLS" ? delta * 1000 : delta),
    // Use a non-interaction event to avoid affecting bounce rate.
    non_interaction: true,

    // OPTIONAL: any additional attribution params here.
    // See: https://web.dev/debug-performance-in-the-field/
    // dimension1: '...',
    // dimension2: '...',
    // ...
  });
}

onCLS(sendToGoogleAnalytics);
onFID(sendToGoogleAnalytics);
onLCP(sendToGoogleAnalytics);
