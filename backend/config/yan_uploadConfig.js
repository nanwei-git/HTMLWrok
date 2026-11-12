// 姓名：杨庆鸿 | 学号：24002120509
// 时间：2026-11-12 | 大模型：DeepSeek V4.1 Flash Free

const yan_fs = require('fs');
const yan_path = require('path');
const yan_crypto = require('crypto');

const yan_upload_root = yan_path.join(__dirname, '..', 'uploads');
const yan_seed_upload_dir = yan_path.join(yan_upload_root, 'seed');
const yan_runtime_upload_dir = yan_path.join(yan_upload_root, 'runtime');
const yan_max_upload_size = 10 * 1024 * 1024;

const yan_upload_categories = Object.freeze([
  '数据集',
  '报表',
  '日志',
  '文档',
  '图片',
  '其他'
]);

const yan_upload_types = Object.freeze({
  csv: { category: '数据集', mimeType: 'text/csv' },
  json: { category: '数据集', mimeType: 'application/json' },
  xls: { category: '数据集', mimeType: 'application/vnd.ms-excel' },
  xlsx: { category: '数据集', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
  pdf: { category: '文档', mimeType: 'application/pdf' },
  md: { category: '文档', mimeType: 'text/markdown' },
  txt: { category: '文档', mimeType: 'text/plain' },
  log: { category: '日志', mimeType: 'text/plain' },
  png: { category: '图片', mimeType: 'image/png' },
  jpg: { category: '图片', mimeType: 'image/jpeg' },
  jpeg: { category: '图片', mimeType: 'image/jpeg' }
});

yan_fs.mkdirSync(yan_seed_upload_dir, { recursive: true });
yan_fs.mkdirSync(yan_runtime_upload_dir, { recursive: true });

function yan_get_extension(yan_name) {
  return yan_path.extname(String(yan_name || '')).replace('.', '').toLowerCase();
}

function yan_get_file_type(yan_extension) {
  return yan_upload_types[String(yan_extension || '').toLowerCase()] || null;
}

function yan_is_upload_category(yan_category) {
  return yan_upload_categories.includes(yan_category);
}

function yan_normalize_original_name(yan_name) {
  const yan_source = String(yan_name || '').trim();

  if (!yan_source) {
    return '未命名文件';
  }

  const yan_decoded = Buffer.from(yan_source, 'latin1').toString('utf8');

  if (!yan_decoded.includes('\uFFFD')) {
    return yan_decoded;
  }

  return yan_source;
}

function yan_generate_stored_name(yan_extension) {
  const yan_stamp = new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 14);
  const yan_random = yan_crypto.randomBytes(8).toString('hex');

  return `yan_${yan_stamp}_${yan_random}${yan_extension ? `.${yan_extension}` : ''}`;
}

function yan_build_download_url(yan_stored_name) {
  return `/uploads/${String(yan_stored_name || '')
    .split('/')
    .map((yan_segment) => encodeURIComponent(yan_segment))
    .join('/')}`;
}

module.exports = {
  yan_upload_root,
  yan_seed_upload_dir,
  yan_runtime_upload_dir,
  yan_max_upload_size,
  yan_upload_categories,
  yan_upload_types,
  yan_get_extension,
  yan_get_file_type,
  yan_is_upload_category,
  yan_normalize_original_name,
  yan_generate_stored_name,
  yan_build_download_url
};
