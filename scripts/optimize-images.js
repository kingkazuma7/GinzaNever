const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

// 設定
const config = {
  inputDir: 'src/assets/images/original', // オリジナル画像のディレクトリ
  outputDir: 'src/assets/images', // 最適化した画像の出力先
  sizes: {
    large: 1920,
    medium: 1280,
    small: 768
  },
  quality: 80, // JPEG品質（0-100）
  webpQuality: 75 // WebP品質（0-100）
};

// 出力ディレクトリの作成
async function createOutputDirs() {
  for (const size in config.sizes) {
    const dir = path.join(config.outputDir, size);
    await fs.mkdir(dir, { recursive: true });
  }
  // WebP用ディレクトリ
  await fs.mkdir(path.join(config.outputDir, 'webp'), { recursive: true });
}

// 画像の最適化処理
async function optimizeImage(inputFile) {
  const filename = path.basename(inputFile);
  const nameWithoutExt = path.parse(filename).name;

  // 各サイズの画像を生成
  for (const [size, width] of Object.entries(config.sizes)) {
    const outputPath = path.join(config.outputDir, size, filename);
    await sharp(inputFile)
      .resize(width, null, { 
        withoutEnlargement: true,
        fit: 'inside'
      })
      .jpeg({ quality: config.quality })
      .toFile(outputPath);
    
    console.log(`Created ${size} image: ${outputPath}`);
  }

  // WebP形式で保存
  const webpPath = path.join(config.outputDir, 'webp', `${nameWithoutExt}.webp`);
  await sharp(inputFile)
    .resize(config.sizes.large, null, { 
      withoutEnlargement: true,
      fit: 'inside'
    })
    .webp({ quality: config.webpQuality })
    .toFile(webpPath);
  
  console.log(`Created WebP image: ${webpPath}`);
}

// メイン処理
async function main() {
  try {
    // 出力ディレクトリの作成
    await createOutputDirs();

    // 入力ディレクトリ内の画像ファイルを取得
    const files = await fs.readdir(config.inputDir);
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png)$/i.test(file)
    );

    // 各画像を処理
    for (const file of imageFiles) {
      const inputPath = path.join(config.inputDir, file);
      await optimizeImage(inputPath);
    }

    console.log('Image optimization completed successfully!');
  } catch (error) {
    console.error('Error during image optimization:', error);
  }
}

// スクリプトの実行
main(); 