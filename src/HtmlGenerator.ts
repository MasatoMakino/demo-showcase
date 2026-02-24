import fs from "node:fs";
import fsPromises from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { InitializedOption } from "./Option.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

interface PackageJsonRepository {
  name?: string;
  repository?: string | { type?: string; url?: string };
}

export interface HtmlGeneratorResult {
  demoHtmlPaths: string[];
}

/**
 * Generate demo HTML files from template by replacing placeholder markers.
 */
export async function generateDemoHtml(
  scriptPath: string,
  distDir: string,
  option: InitializedOption,
): Promise<string> {
  const templatePath = path.resolve(__dirname, "../template/demo.html");
  const template = await fsPromises.readFile(templatePath, "utf8");

  const htmlFileName = replaceExtension(path.basename(scriptPath), ".html");
  const htmlDir = path.join(distDir, path.dirname(scriptPath));
  const htmlPath = path.join(htmlDir, htmlFileName);

  const html = template
    .replace("{{TITLE}}", scriptPath)
    .replace("{{STYLE}}", option.style)
    .replace("{{SCRIPT}}", path.basename(scriptPath))
    .replace("{{BODY}}", option.body);

  await fsPromises.mkdir(htmlDir, { recursive: true });
  await fsPromises.writeFile(htmlPath, html, "utf8");

  return path.relative(distDir, htmlPath);
}

/**
 * Generate the navigation index.html page.
 */
export async function generateIndexHtml(
  demoPaths: string[],
  distDir: string,
): Promise<void> {
  const templatePath = path.resolve(__dirname, "../template/index.html");
  const template = await fsPromises.readFile(templatePath, "utf8");

  const packageJson = readPackageJson();
  const packageName = packageJson.name ?? "";
  const repository = getHomePageURL(packageJson);

  const menuItems = demoPaths
    .map(
      (p) =>
        `<li class="pure-menu-item"><a class="pure-menu-link" href="${p}" target="demo-frame">${p}</a></li>`,
    )
    .join("\n                ");

  const html = template
    .replaceAll("{{PACKAGE_NAME}}", packageName)
    .replaceAll("{{REPOSITORY}}", repository)
    .replace("{{DEMO_PATHS}}", escapeHtmlAttr(JSON.stringify(demoPaths)))
    .replace("{{DEMO_MENU_ITEMS}}", menuItems);

  await fsPromises.mkdir(distDir, { recursive: true });
  await fsPromises.writeFile(path.join(distDir, "index.html"), html, "utf8");

  await copyIndexScript(distDir);
}

async function copyIndexScript(distDir: string) {
  const scriptSrcPath = path.resolve(__dirname, "../template/indexScript.js");
  const scriptDestPath = path.resolve(distDir, "indexScript.js");
  await fsPromises.copyFile(scriptSrcPath, scriptDestPath);
}

function escapeHtmlAttr(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

function replaceExtension(filePath: string, newExt: string): string {
  const ext = path.extname(filePath);
  return filePath.slice(0, -ext.length) + newExt;
}

function readPackageJson(): PackageJsonRepository {
  const jsonPath = path.resolve(process.cwd(), "package.json");
  if (!fs.existsSync(jsonPath)) return {};
  const jsonString = fs.readFileSync(jsonPath, "utf8");
  return JSON.parse(jsonString);
}

function getHomePageURL(packageJson: PackageJsonRepository): string {
  const repositoryPath =
    typeof packageJson.repository === "object"
      ? packageJson.repository.url
      : packageJson.repository;

  if (repositoryPath == null) return "";

  const gitRegExp = /^git\+(.*)\.git$/;
  if (gitRegExp.test(repositoryPath)) {
    const match = repositoryPath.match(/^git\+(.*)/) as RegExpMatchArray;
    return match[1];
  }
  return repositoryPath;
}
