// 姓名：杨庆鸿 | 学号：24002120509
// 时间：2026-11-12 | 大模型：DeepSeek V4.1 Flash Free

(function yan_initialize_chat_page() {
  'use strict';

  const yan_escape = window.yan_escape_html;
  const yan_form = document.querySelector('[data-yan-chat-form]');
  const yan_input = document.querySelector('[data-yan-chat-input]');
  const yan_count = document.querySelector('[data-yan-chat-count]');
  const yan_send = document.querySelector('[data-yan-chat-send]');
  const yan_stop = document.querySelector('[data-yan-chat-stop]');
  const yan_clear = document.querySelector('[data-yan-chat-clear]');
  const yan_window = document.querySelector('[data-yan-chat-window]');
  const yan_messages = document.querySelector('[data-yan-chat-messages]');
  const yan_welcome = document.querySelector('[data-yan-chat-welcome]');
  const yan_suggestions = document.querySelector('[data-yan-chat-suggestions]');
  const yan_status = document.querySelector('[data-yan-chat-status]');
  const yan_status_text = document.querySelector('[data-yan-chat-status-text]');
  const yan_key_status = document.querySelector('[data-yan-chat-key-status]');
  const yan_model_code = document.querySelector('[data-yan-chat-model-code]');
  const yan_persona_note = document.querySelector('[data-yan-chat-persona-note]');
  const yan_json_output = document.querySelector('[data-yan-chat-json]');
  const yan_state = {
    messages: [],
    info: null,
    infoError: null,
    lastResponse: null,
    lastError: null,
    pending: false,
    request: null,
    composing: false
  };

  document.querySelectorAll('[data-yan-chat-api], [data-yan-chat-info-api]').forEach((yan_link) => {
    yan_link.href = `${window.location.origin}/api/chat`;
    yan_link.textContent = `${window.location.origin}/api/chat`;
  });

  function yan_now_label() {
    return new Date().toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function yan_set_status(yan_text, yan_tone) {
    if (!yan_status || !yan_status_text) {
      return;
    }

    yan_status.className = 'yan_chat-status';
    yan_status_text.textContent = yan_text;

    if (yan_tone === 'ok') {
      yan_status.classList.add('yan_chat-status--ok');
    }

    if (yan_tone === 'error') {
      yan_status.classList.add('yan_chat-status--error');
    }

    if (yan_tone === 'checking') {
      yan_status.classList.add('yan_chat-status--checking');
    }
  }

  function yan_render_inspector() {
    if (!yan_json_output) {
      return;
    }

    yan_json_output.textContent = JSON.stringify({
      info: yan_state.info,
      infoError: yan_state.infoError,
      lastResponse: yan_state.lastResponse,
      lastError: yan_state.lastError
    }, null, 2);
  }

  function yan_scroll_to_bottom() {
    window.requestAnimationFrame(() => {
      if (yan_window) {
        yan_window.scrollTop = yan_window.scrollHeight;
      }
    });
  }

  function yan_hide_welcome() {
    if (yan_welcome) {
      yan_welcome.hidden = true;
    }
  }

  function yan_format_message(yan_content, yan_role) {
    const yan_escaped = yan_escape(yan_content);

    if (yan_role !== 'assistant') {
      return yan_escaped;
    }

    const yan_parts = yan_escaped.split('```');

    return yan_parts.map((yan_part, yan_index) => {
      if (yan_index % 2 === 1) {
        const yan_code = yan_part.replace(/^[a-zA-Z0-9_+#.-]*\n/, '');
        return `<pre><code>${yan_code}</code></pre>`;
      }

      return yan_part
        .replace(/`([^`\n]+)`/g, '<code>$1</code>')
        .replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>');
    }).join('');
  }

  function yan_append_message(yan_role, yan_content, yan_options = {}) {
    if (!yan_messages) {
      return;
    }

    yan_hide_welcome();

    const yan_message = document.createElement('article');
    const yan_is_user = yan_role === 'user';
    const yan_is_system = yan_role === 'system';
    const yan_is_assistant = !yan_is_user && !yan_is_system;
    const yan_avatar = yan_is_user ? '我' : yan_is_system ? '!' : 'AI';
    const yan_meta = yan_options.meta || `${yan_is_user ? '你' : yan_is_system ? '系统提示' : '云栖 AI'} · ${yan_now_label()}`;
    const yan_bubble = yan_is_system
      ? yan_escape(yan_content)
      : yan_format_message(yan_content, yan_role);
    const yan_foot = yan_options.foot
      ? `<div class="yan_chat-message-foot">${yan_escape(yan_options.foot)}</div>`
      : '';

    yan_message.className = [
      'yan_chat-message',
      yan_is_user ? 'yan_chat-message--user' : '',
      yan_is_system ? 'yan_chat-message--system' : '',
      yan_is_assistant ? 'yan_chat-message--assistant' : ''
    ].filter(Boolean).join(' ');

    yan_message.innerHTML = `
      <span class="yan_chat-avatar ${yan_is_user ? 'yan_chat-avatar--user' : yan_is_system ? 'yan_chat-avatar--system' : 'yan_chat-avatar--ai'}" aria-hidden="true">${yan_avatar}</span>
      <div class="yan_chat-content">
        <div class="yan_chat-meta">${yan_escape(yan_meta)}</div>
        <div class="yan_chat-bubble">${yan_bubble}</div>
        ${yan_foot}
      </div>
    `;

    yan_messages.appendChild(yan_message);
    yan_scroll_to_bottom();
  }

  function yan_show_typing() {
    if (!yan_messages) {
      return;
    }

    yan_hide_welcome();
    yan_remove_typing();

    const yan_typing = document.createElement('article');
    yan_typing.className = 'yan_chat-message yan_chat-message--assistant';
    yan_typing.dataset.yanChatTyping = 'true';
    yan_typing.innerHTML = `
      <span class="yan_chat-avatar yan_chat-avatar--ai" aria-hidden="true">AI</span>
      <div class="yan_chat-content">
        <div class="yan_chat-meta">云栖 AI · 正在思考</div>
        <div class="yan_chat-bubble yan_chat-typing" aria-label="AI 正在思考">
          <span></span><span></span><span></span>
        </div>
      </div>
    `;

    yan_messages.appendChild(yan_typing);
    yan_scroll_to_bottom();
  }

  function yan_remove_typing() {
    if (!yan_messages) {
      return;
    }

    yan_messages.querySelectorAll('[data-yan-chat-typing]').forEach((yan_node) => {
      yan_node.remove();
    });
  }

  function yan_resize_input() {
    if (!yan_input) {
      return;
    }

    yan_input.style.height = 'auto';
    yan_input.style.height = `${Math.min(yan_input.scrollHeight, 160)}px`;
  }

  function yan_update_composer() {
    const yan_value = yan_input ? yan_input.value : '';
    const yan_length = yan_value.length;

    if (yan_count) {
      yan_count.textContent = String(yan_length);
    }

    if (yan_send) {
      yan_send.disabled = yan_state.pending || !yan_value.trim();
    }

    yan_resize_input();
  }

  function yan_set_pending(yan_pending) {
    yan_state.pending = yan_pending;

    if (yan_send) {
      yan_send.textContent = yan_pending ? '等待回复' : '发送';
    }

    if (yan_stop) {
      yan_stop.hidden = !yan_pending;
    }

    if (yan_clear) {
      yan_clear.disabled = yan_pending;
    }

    if (yan_suggestions) {
      yan_suggestions.querySelectorAll('button').forEach((yan_button) => {
        yan_button.disabled = yan_pending;
      });
    }

    yan_update_composer();
  }

  function yan_friendly_error(yan_error) {
    const yan_payload = yan_error && yan_error.payload;

    if (yan_payload && yan_payload.msg) {
      return yan_payload.msg;
    }

    return yan_error && yan_error.message ? yan_error.message : 'AI 请求失败，请稍后重试';
  }

  async function yan_submit_message(yan_text) {
    const yan_content = String(yan_text || '').trim();

    if (!yan_content || yan_state.pending) {
      return;
    }

    if (yan_content.length > 4000) {
      window.yan_show_toast('单条消息不能超过 4000 个字符', 'error');
      return;
    }

    const yan_previous_messages = yan_state.messages.slice();
    const yan_user_message = {
      role: 'user',
      content: yan_content
    };
    const yan_request_messages = yan_previous_messages
      .concat(yan_user_message)
      .slice(-20);

    yan_state.messages = yan_request_messages;
    yan_append_message('user', yan_content);

    if (yan_input) {
      yan_input.value = '';
    }

    yan_update_composer();
    yan_show_typing();
    yan_set_pending(true);

    const yan_controller = new AbortController();
    yan_state.request = yan_controller;

    try {
      const yan_data = await window.yan_fetch_json('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: yan_request_messages
        }),
        signal: yan_controller.signal
      });

      yan_remove_typing();
      yan_state.lastResponse = {
        code: 0,
        msg: 'AI 回复成功',
        data: yan_data
      };
      yan_state.lastError = null;
      yan_state.messages = yan_request_messages
        .concat({
          role: 'assistant',
          content: yan_data.reply
        })
        .slice(-20);
      yan_render_inspector();

      const yan_usage = yan_data.usage && yan_data.usage.totalTokens
        ? ` · ${yan_data.usage.totalTokens} tokens`
        : '';

      yan_append_message('assistant', yan_data.reply, {
        foot: `${yan_data.model}${yan_usage}`
      });
      yan_set_status('已就绪', 'ok');
    } catch (yan_error) {
      yan_remove_typing();
      yan_state.messages = yan_previous_messages;

      if (yan_error.name === 'AbortError') {
        yan_state.lastError = {
          aborted: true,
          message: '用户停止等待 AI 回复'
        };
        yan_render_inspector();
        yan_append_message('system', '已停止等待本次回复。你可以继续输入新的问题。');
        console.log('[云栖数据工坊] AI 对话已停止等待');
      } else {
        yan_state.lastError = yan_error.payload || {
          status: yan_error.status || null,
          message: yan_error.message
        };
        yan_render_inspector();
        console.error('[云栖数据工坊] AI 对话失败：', yan_error);
        yan_append_message('system', `请求失败：${yan_friendly_error(yan_error)}`);
        window.yan_show_toast(yan_friendly_error(yan_error), 'error');

        const yan_upstream_status = Number(yan_error.payload && yan_error.payload.data && yan_error.payload.data.upstreamStatus);

        if (yan_upstream_status === 401 || yan_upstream_status === 403) {
          if (yan_key_status) {
            yan_key_status.textContent = '鉴权失败，请更换 Key';
            yan_key_status.dataset.yanChatKeyStatus = 'error';
          }
        }

        if (Number(yan_error.status) >= 500) {
          yan_set_status('服务异常', 'error');
        }
      }
    } finally {
      yan_state.request = null;
      yan_set_pending(false);

      if (yan_input) {
        yan_input.focus();
      }
    }
  }

  function yan_handle_submit(yan_event) {
    yan_event.preventDefault();

    if (yan_state.pending) {
      return;
    }

    yan_submit_message(yan_input ? yan_input.value : '');
  }

  function yan_handle_input_keydown(yan_event) {
    if (
      yan_event.key === 'Enter' &&
      !yan_event.shiftKey &&
      !yan_event.isComposing &&
      !yan_state.composing
    ) {
      yan_event.preventDefault();

      if (yan_form && typeof yan_form.requestSubmit === 'function') {
        yan_form.requestSubmit();
      } else {
        yan_submit_message(yan_input ? yan_input.value : '');
      }
    }
  }

  function yan_handle_suggestion(yan_event) {
    const yan_button = yan_event.target.closest('[data-yan-chat-suggestion]');

    if (!yan_button || yan_state.pending) {
      return;
    }

    yan_submit_message(yan_button.textContent.trim());
  }

  function yan_handle_clear() {
    if (yan_state.pending) {
      window.yan_show_toast('请先停止当前请求，再清空对话', 'error');
      return;
    }

    if (!yan_state.messages.length) {
      return;
    }

    if (!window.confirm('确定清空当前对话吗？清空后上下文将无法恢复。')) {
      return;
    }

    yan_state.messages = [];
    yan_state.lastResponse = null;
    yan_state.lastError = null;

    if (yan_messages) {
      yan_messages.innerHTML = '';
    }

    if (yan_welcome) {
      yan_welcome.hidden = false;
    }

    yan_render_inspector();
    yan_update_composer();
    window.yan_show_toast('对话已清空');

    if (yan_input) {
      yan_input.focus();
    }
  }

  function yan_handle_stop() {
    if (yan_state.request) {
      yan_state.request.abort();
    }
  }

  async function yan_load_info() {
    yan_set_status('连接中', 'checking');

    try {
      const yan_data = await window.yan_fetch_json('/api/chat');
      console.log('[云栖数据工坊] AI 对话接口配置：', yan_data);

      yan_state.info = yan_data;
      yan_state.infoError = null;

      if (yan_model_code) {
        yan_model_code.textContent = yan_data.model;
      }

      if (yan_persona_note) {
        yan_persona_note.textContent = `${yan_data.provider || 'AI 服务'} · ${yan_data.model} · 后端代理`;
      }

      if (yan_key_status) {
        yan_key_status.textContent = yan_data.keyConfigured ? '已配置（仅后端）' : '未配置';
        yan_key_status.dataset.yanChatKeyStatus = yan_data.keyConfigured ? 'ok' : 'error';
      }

      yan_set_status('已就绪', 'ok');
    } catch (yan_error) {
      yan_state.infoError = yan_error.payload || {
        status: yan_error.status || null,
        message: yan_error.message
      };
      console.error('[云栖数据工坊] AI 对话配置加载失败：', yan_error);

      if (yan_key_status) {
        yan_key_status.textContent = '读取失败';
        yan_key_status.dataset.yanChatKeyStatus = 'error';
      }

      yan_set_status('服务未连接', 'error');
    }

    yan_render_inspector();
  }

  if (yan_form) {
    yan_form.addEventListener('submit', yan_handle_submit);
  }

  if (yan_input) {
    yan_input.addEventListener('input', yan_update_composer);
    yan_input.addEventListener('keydown', yan_handle_input_keydown);
    yan_input.addEventListener('compositionstart', () => {
      yan_state.composing = true;
    });
    yan_input.addEventListener('compositionend', () => {
      yan_state.composing = false;
    });
  }

  if (yan_suggestions) {
    yan_suggestions.addEventListener('click', yan_handle_suggestion);
  }

  if (yan_clear) {
    yan_clear.addEventListener('click', yan_handle_clear);
  }

  if (yan_stop) {
    yan_stop.addEventListener('click', yan_handle_stop);
  }

  yan_update_composer();
  yan_load_info();
})();
