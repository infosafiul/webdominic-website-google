import JSZip from 'jszip';
import { ZipItem, ArchiveInfo, PreviewData, FileCategory } from './types';

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function detectCategory(filename: string, isDir: boolean): ZipItem['category'] {
  if (isDir) return 'other';
  const ext = filename.split('.').pop()?.toLowerCase() || '';

  const codeExts = ['js', 'jsx', 'ts', 'tsx', 'html', 'css', 'scss', 'py', 'java', 'c', 'cpp', 'cs', 'php', 'rb', 'go', 'rs', 'sh', 'sql', 'vue', 'swift', 'kt'];
  const imageExts = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'ico', 'bmp', 'avif'];
  const docExts = ['txt', 'md', 'pdf', 'doc', 'docx', 'rtf', 'log'];
  const audioExts = ['mp3', 'wav', 'ogg', 'm4a', 'flac', 'aac'];
  const dataExts = ['json', 'xml', 'yaml', 'yml', 'csv', 'tsv', 'env', 'config'];
  const archiveExts = ['zip', 'rar', 'tar', 'gz', '7z', 'bz2'];

  if (codeExts.includes(ext)) return 'code';
  if (imageExts.includes(ext)) return 'image';
  if (docExts.includes(ext)) return 'document';
  if (audioExts.includes(ext)) return 'audio';
  if (dataExts.includes(ext)) return 'data';
  if (archiveExts.includes(ext)) return 'archive';
  return 'other';
}

export function getMimeType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  const mimeMap: Record<string, string> = {
    txt: 'text/plain',
    md: 'text/markdown',
    html: 'text/html',
    css: 'text/css',
    js: 'text/javascript',
    ts: 'text/typescript',
    json: 'application/json',
    xml: 'application/xml',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    svg: 'image/svg+xml',
    webp: 'image/webp',
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    ogg: 'audio/ogg',
    pdf: 'application/pdf',
  };
  return mimeMap[ext] || 'application/octet-stream';
}

export async function parseZipFile(file: File): Promise<ArchiveInfo> {
  const zip = new JSZip();
  const loadedZip = await zip.loadAsync(file);

  const items: ZipItem[] = [];
  let totalUncompressedSize = 0;
  let fileCount = 0;
  let folderCount = 0;

  loadedZip.forEach((relativePath, zipEntry) => {
    const isDir = zipEntry.dir || relativePath.endsWith('/');
    const pathParts = relativePath.replace(/\/$/, '').split('/');
    const name = pathParts[pathParts.length - 1] || relativePath;
    const depth = pathParts.length - 1;
    const ext = isDir ? '' : name.split('.').pop()?.toLowerCase() || '';

    // JSZip stores uncompressed size in _data.uncompressedSize if available
    const uncompressedSize = (zipEntry as any)._data ? (zipEntry as any)._data.uncompressedSize || 0 : 0;
    const compressedSize = (zipEntry as any)._data ? (zipEntry as any)._data.compressedSize || 0 : 0;

    if (isDir) {
      folderCount++;
    } else {
      fileCount++;
      totalUncompressedSize += uncompressedSize;
    }

    items.push({
      id: relativePath,
      name,
      path: relativePath,
      isDir,
      size: uncompressedSize,
      compressedSize,
      date: zipEntry.date || new Date(),
      extension: ext,
      category: detectCategory(name, isDir),
      depth,
    });
  });

  // Sort items: directories first, then alphabetically
  items.sort((a, b) => {
    if (a.isDir && !b.isDir) return -1;
    if (!a.isDir && b.isDir) return 1;
    return a.path.localeCompare(b.path);
  });

  return {
    id: `${file.name}-${Date.now()}`,
    fileName: file.name,
    fileSize: file.size,
    totalUncompressedSize,
    totalCompressedSize: file.size,
    fileCount,
    folderCount,
    uploadedAt: new Date(),
    items,
    rawZipInstance: loadedZip,
  };
}

export async function getFilePreview(zipInstance: JSZip, item: ZipItem): Promise<PreviewData> {
  const zipFile = zipInstance.file(item.path);
  if (!zipFile) {
    throw new Error('ফাইলটি জিপে পাওয়া যায়নি (File not found in zip)');
  }

  const mimeType = getMimeType(item.name);
  const isImage = item.category === 'image';
  const isAudio = item.category === 'audio';
  const isText = ['code', 'document', 'data'].includes(item.category) || mimeType.startsWith('text/') || mimeType === 'application/json';

  if (isImage || isAudio) {
    const blob = await zipFile.async('blob');
    const blobUrl = URL.createObjectURL(blob);
    return {
      item,
      blobUrl,
      isBinary: true,
      mimeType,
    };
  }

  if (isText) {
    try {
      const text = await zipFile.async('string');
      const linesCount = text.split('\n').length;
      return {
        item,
        content: text,
        isBinary: false,
        mimeType,
        linesCount,
      };
    } catch {
      // Fallback to binary
    }
  }

  // Fallback for binary / other files
  const blob = await zipFile.async('blob');
  const blobUrl = URL.createObjectURL(blob);
  return {
    item,
    blobUrl,
    isBinary: true,
    mimeType,
  };
}

export async function downloadSingleFile(zipInstance: JSZip, item: ZipItem): Promise<void> {
  const zipFile = zipInstance.file(item.path);
  if (!zipFile) return;

  const blob = await zipFile.async('blob');
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = item.name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function downloadArchive(zipInstance: JSZip, archiveName: string): Promise<void> {
  const blob = await zipInstance.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = archiveName.endsWith('.zip') ? archiveName : `${archiveName}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function extractSelectedFiles(zipInstance: JSZip, selectedPaths: string[], exportZipName: string): Promise<void> {
  const newZip = new JSZip();
  for (const path of selectedPaths) {
    const file = zipInstance.file(path);
    if (file) {
      const content = await file.async('uint8array');
      newZip.file(path, content);
    }
  }
  const blob = await newZip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = exportZipName.endsWith('.zip') ? exportZipName : `${exportZipName}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function createZipFromFiles(files: File[], zipName: string): Promise<void> {
  const zip = new JSZip();
  for (const file of files) {
    zip.file(file.name, file);
  }
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = zipName.endsWith('.zip') ? zipName : `${zipName}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Generate an exciting demo zip file so users can try the upload & preview immediately
export async function createDemoZipFile(): Promise<File> {
  const zip = new JSZip();

  // 1. Text Readme
  zip.file(
    'স্বাগতম_README.txt',
    `স্বাগতম ZipNest এ!
-----------------------------
এটি একটি আধুনিক জিপ ফাইল ম্যানেজার ও প্রিভিউয়ার।
এখানে আপনি:
1. জিপ ফাইলের ভেতরের সব ফাইল ও ফোল্ডার দেখতে পারবেন।
2. কোড, টেক্সট, ছবি ও ডেটা প্রিভিউ করতে পারবেন।
3. প্রয়োজনীয় ফাইলগুলো আলাদা বা সব একসাথে এক্সট্র্যাক্ট করতে পারবেন।
4. নতুন ফাইল যুক্ত করে নতুন জিপ সংরক্ষণ করতে পারবেন।

তারিখ: ${new Date().toLocaleDateString('bn-BD')}
স্ট্যাটাস: সক্রিয় এবং কার্যকরী!`
  );

  // 2. Project config JSON
  zip.file(
    'config/settings.json',
    JSON.stringify(
      {
        appName: 'ZipNest Studio',
        version: '1.2.0',
        environment: 'production',
        author: {
          name: 'Developer Community',
          region: 'Bangladesh',
        },
        features: {
          zipUpload: true,
          livePreview: true,
          multiFileExtract: true,
          clientSideSecurity: true,
        },
        compressionLevels: [0, 1, 6, 9],
      },
      null,
      2
    )
  );

  // 3. Web Code Sample
  zip.file(
    'src/calculator.js',
    `// সাধারণ ক্যালকুলেটর ফাংশন
function add(a, b) {
  return a + b;
}

function multiply(a, b) {
  return a * b;
}

console.log("যোগফল:", add(25, 75));
console.log("গুণফল:", multiply(12, 10));
`
  );

  // 4. Markdown guide
  zip.file(
    'docs/PROJECT_GUIDE.md',
    `# 🚀 প্রজেক্ট গাইড (Project Guide)

এই ডেমো জিপ ফাইলে বিভিন্ন ধরনের ফাইলের নমুনা রয়েছে:
- **src/calculator.js**: জাভাস্ক্রিপ্ট কোড
- **config/settings.json**: কনফিগারেশন ফাইল
- **assets/logo.svg**: ভেক্টর গ্রাফিক্স আইকন
- **docs/notes.md**: নোট ও ডকুমেন্টস

### বৈশিষ্ট্যসমূহ
* ব্রাউজারে সম্পূর্ণ ক্লায়েন্ট-সাইড এক্সট্র্যাকশন
* ফাইল সাইজ ও কম্প্রেশন রেশিও পর্যবেক্ষণ
* তাৎক্ষণিক ফাইল সার্চ ও ফিল্টারিং
`
  );

  // 5. SVG Image
  const sampleSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <rect width="200" height="200" rx="40" fill="#2563eb" />
  <circle cx="100" cy="80" r="40" fill="#38bdf8" />
  <path d="M 60 140 Q 100 110 140 140" stroke="#ffffff" stroke-width="12" stroke-linecap="round" fill="none" />
  <text x="100" y="175" font-family="sans-serif" font-size="16" fill="#ffffff" font-weight="bold" text-anchor="middle">ZipNest Preview</text>
</svg>`;
  zip.file('assets/logo.svg', sampleSvg);

  const blob = await zip.generateAsync({ type: 'blob' });
  return new File([blob], 'demo_sample_archive.zip', { type: 'application/zip' });
}
