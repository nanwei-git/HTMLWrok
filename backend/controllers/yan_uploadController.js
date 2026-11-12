// 姓名：杨庆鸿 | 学号：24002120509
// 时间：2026-11-12 | 大模型：DeepSeek V4.1 Flash Free

const yan_fs = require('fs/promises');
const yan_path = require('path');
const {
  yan_upload_root,
  yan_upload_categories,
  yan_get_file_type,
  yan_is_upload_category,
  yan_normalize_original_name
} = require('../config/yan_uploadConfig');
const {
  yan_list_uploads,
  yan_create_upload,
  yan_get_upload_for_delete,
  yan_delete_upload
} = require('../models/yan_uploadModel');

function yan_resolve_upload_path(yan_stored_name) {
  const yan_root_path = yan_path.resolve(yan_upload_root);
  const yan_file_path = yan_path.resolve(yan_upload_root, yan_stored_name);

  if (!yan_file_path.startsWith(`${yan_root_path}${yan_path.sep}`)) {
    throw new Error('非法的文件存储路径');
  }

  return yan_file_path;
}

async function yan_remove_stored_file(yan_stored_name) {
  const yan_file_path = yan_resolve_upload_path(yan_stored_name);

  try {
    await yan_fs.unlink(yan_file_path);
  } catch (yan_error) {
    if (yan_error.code !== 'ENOENT') {
      throw yan_error;
    }
  }
}

async function yan_cleanup_uploaded_file(yan_file) {
  if (!yan_file || !yan_file.filename) {
    return;
  }

  try {
    await yan_fs.unlink(yan_file.path);
  } catch (yan_error) {
    if (yan_error.code !== 'ENOENT') {
      console.error('[文件上传] 清理临时文件失败：', yan_error);
    }
  }
}

async function yan_get_uploads(yan_req, yan_res, yan_next) {
  const yan_category = typeof yan_req.query.category === 'string'
    ? yan_req.query.category.trim()
    : '';

  if (yan_category && !yan_is_upload_category(yan_category)) {
    yan_res.status(400).json({
      code: 400,
      msg: `文件分类必须是：${yan_upload_categories.join('、')}`,
      data: {}
    });
    return;
  }

  try {
    const yan_data = await yan_list_uploads(yan_category);

    yan_res.json({
      code: 0,
      msg: '文件列表获取成功',
      data: yan_data
    });
  } catch (yan_error) {
    yan_next(yan_error);
  }
}

async function yan_upload_file(yan_req, yan_res, yan_next) {
  if (!yan_req.file) {
    yan_res.status(400).json({
      code: 400,
      msg: '请选择需要上传的文件',
      data: {}
    });
    return;
  }

  const yan_original_name = yan_normalize_original_name(yan_req.file.originalname);
  const yan_extension = yan_req.file.filename
    .split('.')
    .pop()
    .toLowerCase();
  const yan_file_type = yan_get_file_type(yan_extension);

  if (!yan_file_type) {
    await yan_cleanup_uploaded_file(yan_req.file);
    yan_res.status(400).json({
      code: 400,
      msg: '不支持该文件类型',
      data: {}
    });
    return;
  }

  if (yan_original_name.length > 240) {
    await yan_cleanup_uploaded_file(yan_req.file);
    yan_res.status(400).json({
      code: 400,
      msg: '文件名过长，请将文件名控制在 240 个字符以内',
      data: {}
    });
    return;
  }

  const yan_requested_category = typeof yan_req.body.category === 'string'
    ? yan_req.body.category.trim()
    : '';
  const yan_description = typeof yan_req.body.description === 'string'
    ? yan_req.body.description.trim()
    : '';

  if (yan_requested_category && !yan_is_upload_category(yan_requested_category)) {
    await yan_cleanup_uploaded_file(yan_req.file);
    yan_res.status(400).json({
      code: 400,
      msg: `文件分类必须是：${yan_upload_categories.join('、')}`,
      data: {}
    });
    return;
  }

  if (yan_description.length > 200) {
    await yan_cleanup_uploaded_file(yan_req.file);
    yan_res.status(400).json({
      code: 400,
      msg: '文件说明不能超过 200 个字符',
      data: {}
    });
    return;
  }

  if (!yan_req.file.size) {
    await yan_cleanup_uploaded_file(yan_req.file);
    yan_res.status(400).json({
      code: 400,
      msg: '不能上传空文件',
      data: {}
    });
    return;
  }

  try {
    const yan_upload = await yan_create_upload({
      originalName: yan_original_name,
      storedName: `runtime/${yan_req.file.filename}`,
      extension: yan_extension,
      mimeType: yan_file_type.mimeType,
      sizeBytes: yan_req.file.size,
      category: yan_requested_category || yan_file_type.category,
      description: yan_description,
      uploader: '杨庆鸿'
    });

    console.log(`[文件上传] ${yan_original_name} 上传成功，大小 ${yan_req.file.size} 字节`);

    yan_res.status(201).json({
      code: 0,
      msg: '文件上传成功',
      data: {
        upload: yan_upload
      }
    });
  } catch (yan_error) {
    await yan_cleanup_uploaded_file(yan_req.file);
    yan_next(yan_error);
  }
}

async function yan_delete_upload_file(yan_req, yan_res, yan_next) {
  const yan_id = Number(yan_req.params.id);

  if (!Number.isInteger(yan_id) || yan_id <= 0) {
    yan_res.status(400).json({
      code: 400,
      msg: '文件编号格式不正确',
      data: {}
    });
    return;
  }

  try {
    const yan_upload = await yan_get_upload_for_delete(yan_id);

    if (!yan_upload) {
      yan_res.status(404).json({
        code: 404,
        msg: '文件不存在或已被删除',
        data: {}
      });
      return;
    }

    if (Number(yan_upload.yan_is_seed) === 1) {
      yan_res.status(409).json({
        code: 409,
        msg: '内置示例文件不可删除',
        data: { id: yan_id }
      });
      return;
    }

    await yan_remove_stored_file(yan_upload.yan_stored_name);
    const yan_deleted_rows = await yan_delete_upload(yan_id);

    if (!yan_deleted_rows) {
      yan_res.status(404).json({
        code: 404,
        msg: '文件不存在或已被删除',
        data: {}
      });
      return;
    }

    yan_res.json({
      code: 0,
      msg: '文件已删除',
      data: {
        id: yan_id,
        originalName: yan_upload.yan_original_name
      }
    });
  } catch (yan_error) {
    yan_next(yan_error);
  }
}

module.exports = {
  yan_get_uploads,
  yan_upload_file,
  yan_delete_upload_file
};
