const fs = require("fs/promises");
const path = require("path");

const INDEX_PATH = path.join(process.cwd(), "index.html");

function removeBarDoChico(html) {
  return html
    .replace(/\n\s*<a href="#bar">Bar do Chico<\/a>/g, "")
    .replace(/\n\s*<section class="section" id="bar">[\s\S]*?\n\s*<\/section>\n\s*<\/main>/, "\n  </main>")
    .replace(/\n\s*\/\/ Bar do Chico[\s\S]*?\n\s*\/\/ PWA: disponível após a publicação em HTTPS\./, "\n\n      // PWA: disponível após a publicação em HTTPS.")
    .replace(/\n\s*saveChat\(\);\n\s*renderChat\(\);(?=\n\s*\}\)\(\);)/, "");
}

module.exports = async function handler(request, response) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.setHeader("Allow", "GET, HEAD");
    return response.status(405).send("Método não permitido.");
  }

  try {
    const originalHtml = await fs.readFile(INDEX_PATH, "utf8");
    const html = removeBarDoChico(originalHtml);

    response.setHeader("Content-Type", "text/html; charset=utf-8");
    response.setHeader("Cache-Control", "public, max-age=0, must-revalidate");

    if (request.method === "HEAD") return response.status(200).end();
    return response.status(200).send(html);
  } catch (error) {
    console.error("Erro ao renderizar o portal Velho Chico:", error);
    return response.status(500).send("Não foi possível abrir o portal Velho Chico agora.");
  }
};
