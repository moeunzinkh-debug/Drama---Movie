import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Keep the defaults: static assets + server functions on Cloudflare Workers.
// We intentionally do NOT enable incremental cache / R2 bindings, because the
// catalogue is read-only sample data and every route is dynamic or static.
export default defineCloudflareConfig();
