// 姓名：杨庆鸿 | 学号：24002120509
// 时间：2026-11-09 | 大模型：DeepSeek V4.1 Flash Free

(function yan_initialize_database_page() {
  'use strict';

  const yan_form = document.querySelector('[data-yan-db-form]');
  const yan_username_input = document.getElementById('yan_db_username');
  const yan_password_input = document.getElementById('yan_db_password');
  const yan_submit_button = document.querySelector('[data-yan-db-submit]');
  const yan_reset_button = document.querySelector('[data-yan-db-reset]');
  const yan_toggle_button = document.querySelector('[data-yan-db-toggle-password]');
  const yan_alert = document.querySelector('[data-yan-db-alert]');
  const yan_alert_icon = document.querySelector('[data-yan-db-alert-icon]');
  const yan_alert_text = document.querySelector('[data-yan-db-alert-text]');
  const yan_result_panel = document.querySelector('[data-yan-db-result-panel]');
  const yan_result_note = document.querySelector('[data-yan-db-result-note]');
  const yan_json_output = document.querySelector('[data-yan-db-json]');
  const yan_api_link = document.querySelector('[data-yan-db-api]');

  if (yan_api_link) {
    yan_api_link.href = `${window.location.origin}/api/database/test`;
    yan_api_link.textContent = `${window.location.origin}/api/database/test`;
  }

  function yan_show_alert(yan_type, yan_message) {
    if (!yan_alert || !yan_alert_icon || !yan_alert_text) {
      return;
    }

    const yan_icon_text = {
      success: '✓',
      error: '!',
      info: 'i'
    };

    yan_alert.className = `yan_inline-alert yan_inline-alert--${yan_type}`;
    yan_alert_icon.textContent = yan_icon_text[yan_type] || 'i';
    yan_alert_text.textContent = yan_message;
    yan_alert.hidden = false;
  }

  function yan_fill_result(yan_values) {
    document.querySelectorAll('[data-yan-db-field]').forEach((yan_node) => {
      const yan_key = yan_node.dataset.yanDbField;
      const yan_value = yan_values[yan_key];
      yan_node.textContent = yan_value === undefined || yan_value === null || yan_value === ''
        ? '--'
        : String(yan_value);
    });
  }

  function yan_render_success(yan_data) {
    yan_show_alert('success', `数据库连接成功：${yan_data.database} @ ${yan_data.host}`);

    if (yan_result_panel) {
      yan_result_panel.hidden = false;
    }

    if (yan_result_note) {
      yan_result_note.textContent = '连接成功，以下为后端接口返回的数据内容。';
    }

    yan_fill_result({
      host: yan_data.host,
      database: yan_data.database,
      username: yan_data.username,
      serverVersion: yan_data.serverVersion,
      currentTime: yan_data.currentTime,
      status: '连接成功'
    });

    if (yan_json_output) {
      yan_json_output.textContent = JSON.stringify({
        code: 0,
        msg: '数据库连接成功',
        data: yan_data
      }, null, 2);
    }
  }

  function yan_render_error(yan_error) {
    const yan_payload = yan_error.payload || {
      code: yan_error.status || 500,
      msg: yan_error.message,
      data: {}
    };

    yan_show_alert('error', yan_payload.msg || yan_error.message);

    if (yan_result_panel) {
      yan_result_panel.hidden = false;
    }

    if (yan_result_note) {
      yan_result_note.textContent = '连接失败，以下为后端接口返回的错误信息。';
    }

    yan_fill_result({
      host: '--',
      database: '--',
      username: yan_username_input ? yan_username_input.value.trim() : '--',
      serverVersion: '--',
      currentTime: '--',
      status: '连接失败'
    });

    if (yan_json_output) {
      yan_json_output.textContent = JSON.stringify(yan_payload, null, 2);
    }
  }

  async function yan_test_connection(yan_event) {
    yan_event.preventDefault();

    const yan_username = yan_username_input ? yan_username_input.value.trim() : '';
    const yan_password = yan_password_input ? yan_password_input.value : '';

    if (!yan_username) {
      yan_show_alert('error', '请输入 MySQL 用户名');
      yan_username_input.focus();
      return;
    }

    if (!yan_password) {
      yan_show_alert('error', '请输入 MySQL 密码');
      yan_password_input.focus();
      return;
    }

    if (yan_submit_button) {
      yan_submit_button.disabled = true;
      yan_submit_button.textContent = '正在连接…';
    }

    try {
      const yan_data = await yan_fetch_json('/api/database/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: yan_username,
          password: yan_password
        })
      });

      console.log('[云栖数据工坊] 数据库连接成功：', yan_data);
      yan_render_success(yan_data);
    } catch (yan_error) {
      console.error('[云栖数据工坊] 数据库连接失败：', yan_error);
      yan_render_error(yan_error);
    } finally {
      if (yan_submit_button) {
        yan_submit_button.disabled = false;
        yan_submit_button.textContent = '测试数据库连接';
      }
    }
  }

  function yan_reset_form() {
    if (yan_username_input) {
      yan_username_input.value = 'root';
    }

    if (yan_password_input) {
      yan_password_input.value = '123456';
      yan_password_input.type = 'password';
    }

    if (yan_toggle_button) {
      yan_toggle_button.textContent = '显示密码';
    }

    if (yan_alert) {
      yan_alert.hidden = true;
    }

    if (yan_result_panel) {
      yan_result_panel.hidden = true;
    }

    if (yan_username_input) {
      yan_username_input.focus();
    }
  }

  function yan_toggle_password() {
    if (!yan_password_input || !yan_toggle_button) {
      return;
    }

    const yan_is_password = yan_password_input.type === 'password';
    yan_password_input.type = yan_is_password ? 'text' : 'password';
    yan_toggle_button.textContent = yan_is_password ? '隐藏密码' : '显示密码';
  }

  if (yan_form) {
    yan_form.addEventListener('submit', yan_test_connection);
  }

  if (yan_reset_button) {
    yan_reset_button.addEventListener('click', yan_reset_form);
  }

  if (yan_toggle_button) {
    yan_toggle_button.addEventListener('click', yan_toggle_password);
  }
})();
