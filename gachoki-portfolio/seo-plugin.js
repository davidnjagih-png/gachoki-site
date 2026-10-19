import fs from "node:fs";
import path from "node:path";
import { loadEnv } from "vite";
import site from "./site.config.js";
import { DEFAULT_SETTINGS } from "./src/data/defaults.js";

/*
  After the build, writes one HTML file per public page with its own title,
  description, canonical link, share tags and structured data, plus
  sitemap.xml and robots.txt. The admin area is excluded and marked noindex.
  Search engines read this version, which comes from site.config.js and the
  opening sentence in src/data/defaults.js. If the position or opening
  sentence changes in the dashboard, update those two files too and redeploy.
*/
export default function seoPlugin() {
  let outDir = "dist";
  let env = {};

  return {
    name: "campaign-seo",
    apply: "build",
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
      env = loadEnv(config.mode, config.root, "VITE_");
    },
    closeBundle() {
      const siteUrl = (env.VITE_SITE_URL || site.siteUrl || "https://example.com").replace(/\/$/, "");
      const name = [site.title, site.name].filter(Boolean).join(" ");
      const area = site.area;
      const role = site.role;
      const intro = DEFAULT_SETTINGS.intro;
      const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

      const pages = [
        { route: "/", title: `${name} | ${role}, ${area}`, desc: intro },
        { route: "/work", title: `Selected work | ${name}`, desc: `Projects, bills and community work delivered by ${name} in ${area}.` },
        { route: "/career", title: `Career | ${name}`, desc: `The career of ${name}: public service, professional work and education.` },
        { route: "/vision", title: `Vision | ${name}`, desc: `${name}'s priorities for ${area}.` },
        { route: "/press", title: `Press | ${name}`, desc: `Articles, interviews, videos and statements featuring ${name}.` },
        { route: "/gallery", title: `Gallery | ${name}`, desc: `Photos from events, projects and community visits by ${name}.` },
        { route: "/contact", title: `Contact | ${name}`, desc: `Send a question, idea or invitation to ${name} and his office.` },
      ];

      const template = fs.readFileSync(path.join(outDir, "index.html"), "utf8");
      const jsonLd = JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          { "@type": "Person", name, jobTitle: `${role}, ${area}`, url: siteUrl },
          { "@type": "WebSite", name, url: siteUrl },
        ],
      });

      for (const p of pages) {
        const url = siteUrl + (p.route === "/" ? "/" : p.route);
        const head = [
          `<title>${esc(p.title)}</title>`,
          `<meta name="description" content="${esc(p.desc)}" />`,
          `<meta name="robots" content="index, follow" />`,
          `<link rel="canonical" href="${url}" />`,
          `<meta property="og:type" content="website" />`,
          `<meta property="og:title" content="${esc(p.title)}" />`,
          `<meta property="og:description" content="${esc(p.desc)}" />`,
          `<meta property="og:url" content="${url}" />`,
          `<meta name="twitter:card" content="summary" />`,
          `<script type="application/ld+json">${jsonLd}</script>`,
        ].join("\n    ");
        const html = template.replace(/<title>.*?<\/title>/, head);
        const dir = p.route === "/" ? outDir : path.join(outDir, p.route);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, "index.html"), html);
      }

      // Admin and unknown paths fall back to the app shell, marked noindex.
      const shell = template.replace(/<title>.*?<\/title>/, `<title>Admin</title>\n    <meta name="robots" content="noindex, nofollow" />`);
      fs.writeFileSync(path.join(outDir, "404.html"), shell);
      fs.mkdirSync(path.join(outDir, "admin"), { recursive: true });
      fs.writeFileSync(path.join(outDir, "admin", "index.html"), shell);

      const today = new Date().toISOString().slice(0, 10);
      fs.writeFileSync(
        path.join(outDir, "sitemap.xml"),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages
          .map((p) => `  <url><loc>${siteUrl}${p.route === "/" ? "/" : p.route}</loc><lastmod>${today}</lastmod></url>`)
          .join("\n")}\n</urlset>\n`
      );
      fs.writeFileSync(path.join(outDir, "robots.txt"), `User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${siteUrl}/sitemap.xml\n`);
    },
  };
}
