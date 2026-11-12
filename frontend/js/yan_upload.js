// 姓名：杨庆鸿 | 学号：24002120509
// 时间：2026-11-12 | 大模型：DeepSeek V4.1 Flash Free

(function yan_initialize_upload_page() {
  'use strict';

  const yan_form = document.querySelector('[data-yan-upload-form]');
  const yan_dropzone = document.querySelector('[data-yan-dropzone]');
  const yan_file_input = document.querySelector('[data-yan-upload-input]');
  const yan_selected_box = document.querySelector('[data-yan-selected-file]');
  const yan_selected_extension = document.querySelector('[data-yan-selected-extension]');
  const yan_selected_name = document.querySelector('[data-yan-selected-name]');
  const yan_selected_meta = document.querySelector('[data-yan-selected-meta]');
  const yan_remove_button = document.querySelector('[data-yan-remove-file]');
  const yan_category_select = document.querySelector('[data-yan-upload-category]');
  const yan_description = document.querySelector('[data-yan-upload-description]');
  const yan_description_count = document.querySelector('[data-yan-upload-count]');
  const yan_submit_button = document.querySelector('[data-yan-upload-submit]');
  const yan_reset_button = document.querySelector('[data-yan-upload-reset]');
  const yan_cancel_button = document.querySelector('[data-yan-upload-cancel]');
  const yan_alert = document.querySelector('[data-yan-upload-alert]');
  const yan_alert_icon = document.querySelector('[data-yan-upload-alert-icon]');
  const yan_alert_text = document.querySelector('[data-yan-upload-alert-text]');
  const yan_progress = document.querySelector('[data-yan-upload-progress]');
  const yan_progress_label = document.querySelector('[data-yan-upload-progress-label]');
  const yan_progress_percent = document.querySelector('[data-yan-upload-progress-percent]');
  const yan_progress_track = document.querySelector('[data-yan-upload-progress-track]');
  const yan_progress_bar = document.querySelector('[data-yan-upload-progress-bar]');
  const yan_list = document.querySelector('[data-yan-upload-list]');
  const yan_filters = document.querySelector('[data-yan-upload-filters]');
  const yan_error_box = document.querySelector('[data-yan-error]');
  const yan_error_text = document.querySelector('[data-yan-error-text]');
  const yan_json_output = document.querySelector('[data-yan-upload-json]');
  const yan_max_size = 10 * 1024 * 1024;
  const yan_allowed_types = {
    csv: '数据集',
    json: '数据集',
    xls: '数据集',
    xlsx: '数据集',
    pdf: '文档',
    md: '文档',
    txt: '文档',
    log: '日志',
    png: '图片',
    jpg: '图片',
    jpeg: '图片'
  };
  const yan_badge_classes = {
    数据集: '',
    报表: 'yan_file-badge--report',
    日志: 'yan_file-badge--log',
    文档: 'yan_file-badge--doc',
    图片: 'yan_file-badge--image',
    其他: ''
  };
  const yan_state = {
    files: [],
    summary: null,
    category: 'all',
    selectedFile: null,
    uploading: false,
    request: null
  };

  document.querySelectorAll('[data-yan-upload-api], [data-yan-upload-list-api]').forEach((yan_link) => {
    yan_link.href = `${window.location.origin}/api/uploads`;
    yan_link.textContent = `${window.location.origin}/api/uploads`;
  });

  function yan_format_bytes(yan_bytes) {
    const yan_value = Number(yan_bytes) || 0;

    if (yan_value < 1024) {
      return `${yan_value} B`;
    }

    if (yan_value < 1024 * 1024) {
      return `${(yan_value / 1024).toFixed(1)} KB`;
    }

    return `${(yan_value / (1024 * 1024)).toFixed(2)} MB`;
  }

  function yan_get_extension(yan_name) {
    const yan_parts = String(yan_name || '').split('.');
    return yan_parts.length > 1 ? yan_parts.pop().toLowerCase() : '';
  }

  function yan_show_alert(yan_type, yan_message) {
    const yan_icons = {
      success: '✓',
      error: '!',
      info: 'i'
    };

    if (!yan_alert) {
      return;
    }

    yan_alert.className = `yan_inline-alert yan_inline-alert--${yan_type}`;
    yan_alert_icon.textContent = yan_icons[yan_type] || 'i';
    yan_alert_text.textContent = yan_message;
    yan_alert.hidden = false;
  }

  function yan_hide_alert() {
    if (yan_alert) {
      yan_alert.hidden = true;
    }
  }

  function yan_set_progress(yan_percent, yan_label) {
    const yan_value = Math.max(0, Math.min(100, Math.round(Number(yan_percent) || 0)));

    if (yan_progress) {
      yan_progress.hidden = false;
    }

    if (yan_progress_label) {
      yan_progress_label.textContent = yan_label;
    }

    if (yan_progress_percent) {
      yan_progress_percent.textContent = `${yan_value}%`;
    }

    if (yan_progress_bar) {
      yan_progress_bar.style.width = `${yan_value}%`;
    }

    if (yan_progress_track) {
      yan_progress_track.setAttribute('aria-valuenow', String(yan_value));
    }
  }

  function yan_hide_progress() {
    if (yan_progress) {
      yan_progress.hidden = true;
    }

    if (yan_progress_bar) {
      yan_progress_bar.style.width = '0%';
    }

    if (yan_progress_track) {
      yan_progress_track.setAttribute('aria-valuenow', '0');
    }
  }

  function yan_update_selected_file() {
    const yan_file = yan_state.selectedFile;

    if (!yan_file) {
      if (yan_selected_box) {
        yan_selected_box.hidden = true;
      }

      if (yan_submit_button) {
        yan_submit_button.disabled = true;
      }

      return;
    }

    const yan_extension = yan_get_extension(yan_file.name);

    if (yan_selected_box) {
      yan_selected_box.hidden = false;
    }

    if (yan_selected_extension) {
      yan_selected_extension.textContent = yan_extension ? yan_extension.toUpperCase() : 'FILE';
    }

    if (yan_selected_name) {
      yan_selected_name.textContent = yan_file.name;
      yan_selected_name.title = yan_file.name;
    }

    if (yan_selected_meta) {
      yan_selected_meta.textContent = `${yan_extension.toUpperCase()} · ${yan_format_bytes(yan_file.size)} · ${yan_file.type || '未知 MIME'}`;
    }

    if (yan_submit_button) {
      yan_submit_button.disabled = yan_state.uploading;
    }
  }

  function yan_clear_selected_file() {
    yan_state.selectedFile = null;

    if (yan_file_input) {
      yan_file_input.value = '';
    }

    yan_update_selected_file();
  }

  function yan_accept_file(yan_file) {
    if (!yan_file || yan_state.uploading) {
      return;
    }

    const yan_extension = yan_get_extension(yan_file.name);
    const yan_category = yan_allowed_types[yan_extension];

    if (!yan_category) {
      yan_clear_selected_file();
      yan_show_alert('error', '不支持该文件类型，请选择 CSV、JSON、TXT、LOG、MD、XLS、XLSX、PDF 或图片文件');
      return;
    }

    if (!yan_file.size) {
      yan_clear_selected_file();
      yan_show_alert('error', '不能上传空文件');
      return;
    }

    if (yan_file.size > yan_max_size) {
      yan_clear_selected_file();
      yan_show_alert('error', `文件大小为 ${yan_format_bytes(yan_file.size)}，不能超过 10 MB`);
      return;
    }

    yan_state.selectedFile = yan_file;
    yan_update_selected_file();

    if (yan_category_select) {
      yan_category_select.value = yan_category;
    }

    yan_hide_alert();
  }

  function yan_handle_file_change(yan_event) {
    const yan_file = yan_event.target.files && yan_event.target.files[0];
    yan_accept_file(yan_file);
  }

  function yan_handle_drag_over(yan_event) {
    yan_event.preventDefault();

    if (!yan_state.uploading && yan_dropzone) {
      yan_dropzone.classList.add('yan_dropzone--active');
    }
  }

  function yan_handle_drag_leave(yan_event) {
    yan_event.preventDefault();

    if (yan_dropzone && !yan_dropzone.contains(yan_event.relatedTarget)) {
      yan_dropzone.classList.remove('yan_dropzone--active');
    }
  }

  function yan_handle_drop(yan_event) {
    yan_event.preventDefault();

    if (yan_dropzone) {
      yan_dropzone.classList.remove('yan_dropzone--active');
    }

    const yan_file = yan_event.dataTransfer && yan_event.dataTransfer.files
      ? yan_event.dataTransfer.files[0]
      : null;

    yan_accept_file(yan_file);
  }

  function yan_set_uploading(yan_uploading) {
    yan_state.uploading = yan_uploading;

    if (yan_dropzone) {
      yan_dropzone.classList.toggle('yan_dropzone--disabled', yan_uploading);
    }

    [yan_file_input, yan_category_select, yan_description].forEach((yan_control) => {
      if (yan_control) {
        yan_control.disabled = yan_uploading;
      }
    });

    if (yan_submit_button) {
      yan_submit_button.disabled = yan_uploading || !yan_state.selectedFile;
    }

    if (yan_submit_button) {
      yan_submit_button.textContent = yan_uploading ? '正在上传…' : '开始上传';
    }

    if (yan_reset_button) {
      yan_reset_button.disabled = yan_uploading;
    }

    if (yan_cancel_button) {
      yan_cancel_button.hidden = !yan_uploading;
    }
  }

  function yan_reset_form() {
    if (yan_state.uploading) {
      return;
    }

    yan_clear_selected_file();
    yan_hide_alert();
    yan_hide_progress();

    if (yan_category_select) {
      yan_category_select.value = '数据集';
    }

    if (yan_description) {
      yan_description.value = '';
    }

    if (yan_description_count) {
      yan_description_count.textContent = '0';
    }
  }

  function yan_handle_cancel() {
    if (yan_state.request) {
      yan_state.request.abort();
    }
  }

  function yan_handle_upload_progress(yan_event) {
    if (!yan_event.lengthComputable) {
      return;
    }

    const yan_percent = (yan_event.loaded / yan_event.total) * 100;
    yan_set_progress(
      yan_percent,
      `正在上传 ${yan_format_bytes(yan_event.loaded)} / ${yan_format_bytes(yan_event.total)}`
    );
  }

  function yan_parse_response(yan_request) {
    try {
      return JSON.parse(yan_request.responseText);
    } catch (yan_error) {
      console.error('[云栖数据工坊] 文件上传响应解析失败：', yan_error);
      return null;
    }
  }

  function yan_handle_upload_success(yan_payload) {
    console.log('[云栖数据工坊] 文件上传成功：', yan_payload);
    yan_set_progress(100, '上传完成');
    yan_set_uploading(false);

    const yan_uploaded_name = yan_payload.data && yan_payload.data.upload
      ? yan_payload.data.upload.originalName
      : '文件';

    yan_reset_form();
    yan_show_alert('success', `文件“${yan_uploaded_name}”上传成功，已写入文件库`);
    yan_show_toast('文件上传成功');
    yan_state.category = 'all';
    yan_load_files();
  }

  function yan_handle_upload_failure(yan_payload, yan_status) {
    const yan_message = yan_payload && yan_payload.msg
      ? yan_payload.msg
      : `上传失败（HTTP ${yan_status || 0}）`;

    console.error('[云栖数据工坊] 文件上传失败：', yan_payload || yan_message);
    yan_set_uploading(false);

    if (yan_progress_label) {
      yan_progress_label.textContent = '上传失败';
    }

    if (yan_progress_percent) {
      yan_progress_percent.textContent = '—';
    }

    yan_show_alert('error', yan_message);
  }

  function yan_handle_submit(yan_event) {
    yan_event.preventDefault();

    if (yan_state.uploading) {
      return;
    }

    if (!yan_state.selectedFile) {
      yan_show_alert('error', '请先选择需要上传的文件');
      return;
    }

    if (yan_state.selectedFile.size > yan_max_size) {
      yan_show_alert('error', '文件大小不能超过 10 MB');
      return;
    }

    const yan_form_data = new FormData();
    yan_form_data.append('file', yan_state.selectedFile);
    yan_form_data.append('category', yan_category_select ? yan_category_select.value : '数据集');
    yan_form_data.append('description', yan_description ? yan_description.value.trim() : '');

    const yan_request = new XMLHttpRequest();
    yan_state.request = yan_request;
    yan_set_uploading(true);
    yan_hide_alert();
    yan_set_progress(0, '准备上传');

    yan_request.open('POST', '/api/uploads');
    yan_request.upload.addEventListener('progress', yan_handle_upload_progress);

    yan_request.addEventListener('load', () => {
      const yan_payload = yan_parse_response(yan_request);
      yan_state.request = null;

      if (yan_request.status >= 200 && yan_request.status < 300 && yan_payload && yan_payload.code === 0) {
        yan_handle_upload_success(yan_payload);
        return;
      }

      yan_handle_upload_failure(yan_payload, yan_request.status);
    });

    yan_request.addEventListener('error', () => {
      yan_state.request = null;
      console.error('[云栖数据工坊] 文件上传网络错误');
      yan_handle_upload_failure(null, 0);
    });

    yan_request.addEventListener('abort', () => {
      yan_state.request = null;
      yan_set_uploading(false);
      yan_hide_progress();
      yan_show_alert('info', '已取消本次上传，已选文件仍保留');
      console.log('[云栖数据工坊] 文件上传已取消');
    });

    yan_request.send(yan_form_data);
  }

  function yan_render_summary(yan_summary) {
    const yan_total = document.querySelector('[data-yan-upload-total]');
    const yan_size = document.querySelector('[data-yan-upload-size]');
    const yan_seed = document.querySelector('[data-yan-upload-seed]');
    const yan_categories = document.querySelector('[data-yan-upload-categories]');

    if (yan_total) {
      yan_total.textContent = String(yan_summary.total);
    }

    if (yan_size) {
      yan_size.textContent = yan_format_bytes(yan_summary.totalSizeBytes);
    }

    if (yan_seed) {
      yan_seed.textContent = String(yan_summary.seedCount);
    }

    if (yan_categories) {
      yan_categories.textContent = String(yan_summary.categoryCount);
    }
  }

  function yan_render_filters() {
    if (!yan_filters || !yan_state.summary) {
      return;
    }

    const yan_buttons = [
      `<button class="yan_filter${yan_state.category === 'all' ? ' yan_filter--active' : ''}" type="button" data-yan-upload-filter="all">全部分类 ${yan_state.summary.total}</button>`,
      ...yan_state.summary.categories.map((yan_category) => {
        const yan_active = yan_state.category === yan_category.category ? ' yan_filter--active' : '';
        return `<button class="yan_filter${yan_active}" type="button" data-yan-upload-filter="${yan_escape_html(yan_category.category)}">${yan_escape_html(yan_category.category)} ${yan_category.count}</button>`;
      })
    ];

    yan_filters.innerHTML = yan_buttons.join('');
  }

  function yan_upload_card(yan_upload) {
    const yan_badge_class = yan_badge_classes[yan_upload.category] || '';
    const yan_seed_tag = yan_upload.isSeed
      ? '<span class="yan_upload-tag yan_upload-tag--seed">内置示例</span>'
      : '<span class="yan_upload-tag">用户上传</span>';
    const yan_delete_button = yan_upload.isSeed
      ? ''
      : `<button class="yan_upload-action yan_upload-action--danger" type="button" data-yan-delete-upload="${yan_upload.id}" data-yan-delete-name="${yan_escape_html(yan_upload.originalName)}">删除</button>`;

    return `
      <article class="yan_upload-item">
        <span class="yan_file-badge ${yan_badge_class}">${yan_escape_html((yan_upload.extension || 'FILE').toUpperCase())}</span>
        <div class="yan_upload-info">
          <div class="yan_upload-title-row">
            <h3 class="yan_upload-name" title="${yan_escape_html(yan_upload.originalName)}">${yan_escape_html(yan_upload.originalName)}</h3>
            <span class="yan_upload-tag">${yan_escape_html(yan_upload.category)}</span>
            ${yan_seed_tag}
          </div>
          <p class="yan_upload-description">${yan_escape_html(yan_upload.description || '未填写文件说明')}</p>
          <div class="yan_upload-meta">
            <span>${yan_format_bytes(yan_upload.sizeBytes)}</span>
            <span>${yan_escape_html(yan_upload.mimeType)}</span>
            <span>${yan_escape_html(yan_upload.uploader)}</span>
            <span>${yan_escape_html(yan_format_datetime(yan_upload.uploadedAt))}</span>
          </div>
        </div>
        <div class="yan_upload-actions">
          <a class="yan_upload-action" href="${yan_escape_html(yan_upload.downloadUrl)}" download="${yan_escape_html(yan_upload.originalName)}">下载</a>
          ${yan_delete_button}
        </div>
      </article>
    `;
  }

  function yan_render_files() {
    if (!yan_list) {
      return;
    }

    const yan_visible = yan_state.category === 'all'
      ? yan_state.files
      : yan_state.files.filter((yan_file) => yan_file.category === yan_state.category);

    if (!yan_visible.length) {
      yan_list.innerHTML = `
        <div class="yan_state-box yan_upload-empty" style="border: 0;">
          <span class="yan_state-icon" aria-hidden="true">◇</span>
          <h2 class="yan_state-title">当前分类下还没有文件</h2>
          <p class="yan_state-text">上传第一个文件，或切换分类查看其他文件。</p>
        </div>
      `;
      return;
    }

    yan_list.innerHTML = yan_visible.map(yan_upload_card).join('');
  }

  async function yan_delete_file(yan_button) {
    const yan_id = yan_button.dataset.yanDeleteUpload;
    const yan_name = yan_button.dataset.yanDeleteName || '该文件';

    if (!window.confirm(`确定删除“${yan_name}”吗？删除后不可恢复。`)) {
      return;
    }

    yan_button.disabled = true;

    try {
      const yan_data = await yan_fetch_json(`/api/uploads/${yan_id}`, { method: 'DELETE' });
      console.log('[云栖数据工坊] 文件删除成功：', yan_data);
      yan_show_toast('文件已删除');
      await yan_load_files();
    } catch (yan_error) {
      console.error('[云栖数据工坊] 文件删除失败：', yan_error);
      yan_show_toast(yan_error.message || '文件删除失败', 'error');
      yan_button.disabled = false;
    }
  }

  function yan_show_error(yan_error) {
    console.error('[云栖数据工坊] 文件列表加载失败：', yan_error);

    if (yan_error_box) {
      yan_error_box.hidden = false;
    }

    if (yan_error_text) {
      yan_error_text.textContent = `${yan_error.message}。请确认后端服务已启动，并检查浏览器控制台。`;
    }

    if (yan_list) {
      yan_list.innerHTML = '';
    }
  }

  async function yan_load_files() {
    try {
      const yan_data = await yan_fetch_json('/api/uploads');
      console.log('[云栖数据工坊] 文件列表数据：', yan_data);

      yan_state.files = Array.isArray(yan_data.uploads) ? yan_data.uploads : [];
      yan_state.summary = yan_data.summary;

      const yan_available_categories = new Set([
        'all',
        ...yan_data.summary.categories.map((yan_category) => yan_category.category)
      ]);

      if (!yan_available_categories.has(yan_state.category)) {
        yan_state.category = 'all';
      }

      yan_render_summary(yan_data.summary);
      yan_render_filters();
      yan_render_files();

      if (yan_json_output) {
        yan_json_output.textContent = JSON.stringify({
          code: 0,
          msg: '文件列表获取成功',
          data: yan_data
        }, null, 2);
      }

      if (yan_error_box) {
        yan_error_box.hidden = true;
      }
    } catch (yan_error) {
      yan_show_error(yan_error);
    }
  }

  if (yan_file_input) {
    yan_file_input.addEventListener('change', yan_handle_file_change);
  }

  if (yan_dropzone) {
    yan_dropzone.addEventListener('dragenter', yan_handle_drag_over);
    yan_dropzone.addEventListener('dragover', yan_handle_drag_over);
    yan_dropzone.addEventListener('dragleave', yan_handle_drag_leave);
    yan_dropzone.addEventListener('drop', yan_handle_drop);
  }

  if (yan_remove_button) {
    yan_remove_button.addEventListener('click', () => {
      yan_clear_selected_file();
      yan_hide_alert();
    });
  }

  if (yan_description && yan_description_count) {
    yan_description.addEventListener('input', () => {
      yan_description_count.textContent = String(yan_description.value.length);
    });
  }

  if (yan_form) {
    yan_form.addEventListener('submit', yan_handle_submit);
  }

  if (yan_reset_button) {
    yan_reset_button.addEventListener('click', yan_reset_form);
  }

  if (yan_cancel_button) {
    yan_cancel_button.addEventListener('click', yan_handle_cancel);
  }

  if (yan_filters) {
    yan_filters.addEventListener('click', (yan_event) => {
      const yan_button = yan_event.target.closest('[data-yan-upload-filter]');

      if (!yan_button) {
        return;
      }

      yan_state.category = yan_button.dataset.yanUploadFilter;
      yan_render_filters();
      yan_render_files();
    });
  }

  if (yan_list) {
    yan_list.addEventListener('click', (yan_event) => {
      const yan_button = yan_event.target.closest('[data-yan-delete-upload]');

      if (yan_button) {
        yan_delete_file(yan_button);
      }
    });
  }

  yan_update_selected_file();
  yan_load_files();
})();
