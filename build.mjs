import { cp, mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const output = resolve(root, "dist");
const pages = [
  "index.html",
  "features.html",
  "how-it-works.html",
  "security.html",
  "pricing.html",
  "faq.html",
  "demo.html",
  "about.html",
  "privacy.html",
  "terms.html",
  "cookies.html",
  "contact.html",
  "robots.txt",
  "sitemap.xml"
];

await mkdir(output, { recursive: true });
await Promise.all([
  ...pages.map((page) => cp(resolve(root, page), resolve(output, page))),
  cp(resolve(root, "assets"), resolve(output, "assets"), { recursive: true, force: true })
]);
console.log(`Static site copied to ${output}`);
