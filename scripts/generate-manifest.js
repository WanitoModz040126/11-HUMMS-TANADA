/**
 * Scans the public asset folders and writes public/manifest.json.
 * Runs automatically before "next dev" and "next build" (see package.json).
 *
 * Folders scanned:
 *  - public/assets   -> gallery photos and videos (mixed, any order, any
 *                       number of gaps). Supports 1.png ... 400+.mp4 and
 *                       beyond -- whatever is physically present is listed.
 *  - public/girl     -> 1.png ... N (in numeric order, matches data/members.json "girls")
 *  - public/boy      -> 1.png ... N (in numeric order, matches data/members.json "boys")
 *  - public/officer  -> 1.png ... N (in numeric order, matches "officers")
 *  - public/adviser  -> 1.png (single file)
 *  - public/queen    -> 1.png (single file)
 *  - public/palaban  -> 1.png (single file)
 *
 * Only files that are physically present are included. Nothing is padded
 * with fake placeholder entries, so dropping a new numbered file into a
 * folder and redeploying is the only step needed to make it show up.
 */

const fs = require("fs");
const path = require("path");

const PUBLIC_DIR = path.join(__dirname, "..", "public");

const IMAGE_EXT = [".png", ".jpg", ".jpeg", ".webp", ".gif"];
const VIDEO_EXT = [".mp4", ".webm", ".mov"];

const PEOPLE_FOLDERS = ["girl", "boy", "officer", "adviser", "queen", "palaban"];

function leadingNumber(filename) {
  const match = filename.match(/^(\d+)/);
  return match ? parseInt(match[1], 10) : Number.MAX_SAFE_INTEGER;
}

function listFolder(folderName) {
  const dir = path.join(PUBLIC_DIR, folderName);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((name) => {
      if (name.startsWith(".")) return false;
      const ext = path.extname(name).toLowerCase();
      return IMAGE_EXT.includes(ext) || VIDEO_EXT.includes(ext);
    })
    .sort((a, b) => leadingNumber(a) - leadingNumber(b));
}

function buildGalleryEntries() {
  const files = listFolder("assets");
  return files.map((file) => {
    const ext = path.extname(file).toLowerCase();
    const type = VIDEO_EXT.includes(ext) ? "video" : "image";
    return { file, src: `/assets/${file}`, type };
  });
}

function buildPeopleEntries(folderName) {
  const files = listFolder(folderName);
  return files.map((file) => ({ file, src: `/${folderName}/${file}` }));
}

const manifest = {
  generatedAt: new Date().toISOString(),
  gallery: buildGalleryEntries(),
};

for (const folder of PEOPLE_FOLDERS) {
  manifest[folder] = buildPeopleEntries(folder);
}

fs.writeFileSync(
  path.join(PUBLIC_DIR, "manifest.json"),
  JSON.stringify(manifest, null, 2)
);

const summary = ["gallery", ...PEOPLE_FOLDERS]
  .map((key) => `${key}:${manifest[key].length}`)
  .join(" ");

console.log(`manifest.json written -> ${summary}`);
