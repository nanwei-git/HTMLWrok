// 姓名：杨庆鸿 | 学号：24002120509
// 时间：2026-11-12 | 大模型：DeepSeek V4.1 Flash Free

const yan_multer = require('multer');
const {
  yan_runtime_upload_dir,
  yan_max_upload_size,
  yan_upload_types,
  yan_get_extension,
  yan_generate_stored_name
} = require('../config/yan_uploadConfig');

const yan_supported_extensions = Object.keys(yan_upload_types)
  .map((yan_extension) => yan_extension.toUpperCase())
  .join('、');

const yan_storage = yan_multer.diskStorage({
  destination(yan_req, yan_file, yan_callback) {
    yan_callback(null, yan_runtime_upload_dir);
  },
  filename(yan_req, yan_file, yan_callback) {
    const yan_extension = yan_get_extension(yan_file.originalname);
    yan_callback(null, yan_generate_stored_name(yan_extension));
  }
});

const yan_upload_engine = yan_multer({
  storage: yan_storage,
  limits: {
    fileSize: yan_max_upload_size,
    files: 1
  },
  fileFilter(yan_req, yan_file, yan_callback) {
    const yan_extension = yan_get_extension(yan_file.originalname);

    if (!yan_upload_types[yan_extension]) {
      const yan_error = new Error(`不支持 ${yan_extension || '未知'} 文件类型`);
      yan_error.code = 'YAN_UNSUPPORTED_FILE_TYPE';
      yan_callback(yan_error);
      return;
    }

    yan_callback(null, true);
  }
});

function yan_upload_single(yan_req, yan_res, yan_next) {
  yan_upload_engine.single('file')(yan_req, yan_res, (yan_error) => {
    if (!yan_error) {
      yan_next();
      return;
    }

    if (yan_error.code === 'LIMIT_FILE_SIZE') {
      yan_res.status(413).json({
        code: 413,
        msg: '文件大小不能超过 10 MB',
        data: { reason: yan_error.code }
      });
      return;
    }

    if (yan_error.code === 'YAN_UNSUPPORTED_FILE_TYPE') {
      yan_res.status(400).json({
        code: 400,
        msg: `不支持该文件类型，仅支持 ${yan_supported_extensions}`,
        data: { reason: yan_error.code }
      });
      return;
    }

    if (yan_error.code === 'LIMIT_UNEXPECTED_FILE') {
      yan_res.status(400).json({
        code: 400,
        msg: '请使用 file 字段上传单个文件',
        data: { reason: yan_error.code }
      });
      return;
    }

    console.error('[文件上传] 解析上传请求失败：', yan_error);
    yan_res.status(400).json({
      code: 400,
      msg: '文件上传失败，请检查文件后重试',
      data: { reason: yan_error.code || 'UPLOAD_PARSE_ERROR' }
    });
  });
}

module.exports = {
  yan_upload_single
};
