const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const distDir = path.join(__dirname, '..', 'dist');
const indexHtmlPath = path.join(distDir, 'index.html');

console.log('--- Adding hash to assets for cache busting ---');

function generateHash(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const hash = crypto.createHash('md5').update(fileBuffer).digest('hex').substring(0, 8); // 短縮ハッシュ
  return hash;
}

function rewriteFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');
  replacements.forEach(rep => {
    content = content.replace(rep.original, rep.hashed);
  });
  fs.writeFileSync(filePath, content);
}

function processAssets() {
  let htmlContent = fs.readFileSync(indexHtmlPath, 'utf8');
  const replacements = [];

  console.log('Processing CSS files...');
  // CSSファイル
  htmlContent = htmlContent.replace(/href="((?:\.\/)?src\/assets\/css\/style\.css)"/g, (match, p1) => {
    const normalizedP1 = p1.startsWith('./') ? p1.substring(2) : p1; // ./ を取り除く
    const originalPath = path.join(distDir, normalizedP1);
    console.log(`  CSS: Matched path: ${p1}, Normalized path: ${normalizedP1}, Full path: ${originalPath}, Exists: ${fs.existsSync(originalPath)}`);
    if (fs.existsSync(originalPath)) {
      const hash = generateHash(originalPath);
      const hashedPath = `${p1}?v=${hash}`;
      console.log(`  CSS: Hashed: ${p1} -> ${hashedPath}`);
      replacements.push({ original: p1, hashed: hashedPath });
      return `href="${hashedPath}"`; // href属性を正しく使用
    }
    return match;
  });

  console.log('Processing JS files...');
  // JSファイル
  htmlContent = htmlContent.replace(/src="((?:\.\/)?src\/assets\/js\/script\.js)"/g, (match, p1) => {
    const normalizedP1 = p1.startsWith('./') ? p1.substring(2) : p1; // ./ を取り除く
    const originalPath = path.join(distDir, normalizedP1);
    console.log(`  JS: Matched path: ${p1}, Normalized path: ${normalizedP1}, Full path: ${originalPath}, Exists: ${fs.existsSync(originalPath)}`);
    if (fs.existsSync(originalPath)) {
      const hash = generateHash(originalPath);
      const hashedPath = `${p1}?v=${hash}`;
      console.log(`  JS: Hashed: ${p1} -> ${hashedPath}`);
      replacements.push({ original: p1, hashed: hashedPath });
      return `src="${hashedPath}"`;
    }
    return match;
  });

  console.log('Processing Image files...');
  // 画像ファイル（src/assets/images/以下の全画像を対象）
  htmlContent = htmlContent.replace(/(src|data-src)="((?:\.\/)?src\/assets\/images\/[^"]+\.(?:png|jpg|jpeg|gif|svg))"/g, (match, attr, p1) => {
    const normalizedP1 = p1.startsWith('./') ? p1.substring(2) : p1; // ./ を取り除く
    const originalPath = path.join(distDir, normalizedP1);
    console.log(`  Image: Matched path: ${p1}, Normalized path: ${normalizedP1}, Full path: ${originalPath}, Exists: ${fs.existsSync(originalPath)}`);
    if (fs.existsSync(originalPath)) {
      const hash = generateHash(originalPath);
      const hashedPath = `${p1}?v=${hash}`;
      console.log(`  Image: Hashed: ${p1} -> ${hashedPath}`);
      replacements.push({ original: p1, hashed: hashedPath });
      return `${attr}="${hashedPath}"`;
    }
    return match;
  });

  fs.writeFileSync(indexHtmlPath, htmlContent);
  console.log('--- Hashing complete ---');
}

processAssets();