// 姓名：杨庆鸿 | 学号：24002120509
// 时间：2026-11-09 | 大模型：DeepSeek V4.1 Flash Free

(function yan_initialize_common() {
  'use strict';

  const yan_canvas = document.getElementById('yan_canvas');
  const yan_motion_preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const yan_pointer = { x: -1000, y: -1000, active: false };
  const yan_status_labels = {
    active: '运行中',
    paused: '已暂停',
    draft: '草稿',
    published: '已发布',
    review: '待审核',
    success: '成功',
    failed: '失败',
    running: '运行中',
    connected: '已连接',
    syncing: '同步中',
    error: '异常',
    ready: '就绪',
    warning: '需关注',
    disabled: '已停用'
  };
  const yan_number_formatter = new Intl.NumberFormat('zh-CN');
  let yan_context = null;
  let yan_width = 0;
  let yan_height = 0;
  let yan_particles = [];
  let yan_animation_id = 0;

  function yan_escape_html(yan_value) {
    return String(yan_value ?? '').replace(/[&<>"']/g, (yan_character) => {
      const yan_replacements = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      };
      return yan_replacements[yan_character];
    });
  }

  function yan_format_number(yan_value) {
    return yan_number_formatter.format(Number(yan_value) || 0);
  }

  function yan_format_datetime(yan_value) {
    if (!yan_value) {
      return '—';
    }

    return String(yan_value).replace('T', ' ').slice(0, 16);
  }

  function yan_format_short_datetime(yan_value) {
    if (!yan_value) {
      return '—';
    }

    return String(yan_value).replace('T', ' ').slice(5, 16);
  }

  function yan_status_text(yan_status) {
    return yan_status_labels[yan_status] || yan_status || '未知';
  }

  function yan_status_class(yan_status) {
    return `yan_status yan_status--${yan_escape_html(yan_status || 'draft')}`;
  }

  function yan_show_toast(yan_message, yan_type = 'success') {
    const yan_toast = document.createElement('div');
    yan_toast.className = `yan_toast${yan_type === 'error' ? ' yan_toast--error' : ''}`;
    yan_toast.textContent = yan_message;
    document.body.appendChild(yan_toast);

    window.requestAnimationFrame(() => {
      yan_toast.classList.add('yan_toast--show');
    });

    window.setTimeout(() => {
      yan_toast.classList.remove('yan_toast--show');
      window.setTimeout(() => yan_toast.remove(), 260);
    }, 2800);
  }

  async function yan_fetch_json(yan_url, yan_options = {}) {
    const yan_headers = {
      Accept: 'application/json',
      ...(yan_options.headers || {})
    };

    const yan_response = await fetch(yan_url, {
      ...yan_options,
      headers: yan_headers
    });

    let yan_payload = null;

    try {
      yan_payload = await yan_response.json();
    } catch (yan_error) {
      console.error('[云栖数据工坊] 接口响应解析失败：', yan_url, yan_error);
      throw new Error('接口返回了无法解析的数据');
    }

    console.log('[云栖数据工坊] 接口响应：', yan_url, yan_payload);

    if (!yan_response.ok || !yan_payload || yan_payload.code !== 0) {
      const yan_request_error = new Error((yan_payload && yan_payload.msg) || `请求失败（HTTP ${yan_response.status}）`);
      yan_request_error.status = yan_response.status;
      yan_request_error.payload = yan_payload;
      throw yan_request_error;
    }

    return yan_payload.data;
  }

  function yan_create_particles() {
    const yan_count = Math.min(78, Math.max(28, Math.round((yan_width * yan_height) / 26000)));

    yan_particles = Array.from({ length: yan_count }, () => ({
      x: Math.random() * yan_width,
      y: Math.random() * yan_height,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      radius: Math.random() * 1.35 + 0.45,
      tone: Math.random() > 0.58 ? 'gold' : 'mint'
    }));
  }

  function yan_resize_canvas() {
    if (!yan_canvas || !yan_context) {
      return;
    }

    const yan_dpr = Math.min(window.devicePixelRatio || 1, 2);
    yan_width = window.innerWidth;
    yan_height = window.innerHeight;

    yan_canvas.width = Math.floor(yan_width * yan_dpr);
    yan_canvas.height = Math.floor(yan_height * yan_dpr);
    yan_canvas.style.width = `${yan_width}px`;
    yan_canvas.style.height = `${yan_height}px`;
    yan_context.setTransform(yan_dpr, 0, 0, yan_dpr, 0, 0);

    yan_create_particles();
    yan_render_frame();
  }

  function yan_render_frame() {
    if (!yan_context) {
      return;
    }

    yan_context.clearRect(0, 0, yan_width, yan_height);
    yan_context.globalCompositeOperation = 'lighter';

    for (let yan_index = 0; yan_index < yan_particles.length; yan_index += 1) {
      const yan_particle = yan_particles[yan_index];

      if (!yan_motion_preference.matches) {
        yan_particle.x += yan_particle.vx;
        yan_particle.y += yan_particle.vy;
      }

      if (yan_particle.x < -20 || yan_particle.x > yan_width + 20) {
        yan_particle.vx *= -1;
      }

      if (yan_particle.y < -20 || yan_particle.y > yan_height + 20) {
        yan_particle.vy *= -1;
      }

      yan_particle.x = Math.max(-20, Math.min(yan_width + 20, yan_particle.x));
      yan_particle.y = Math.max(-20, Math.min(yan_height + 20, yan_particle.y));

      for (let yan_next_index = yan_index + 1; yan_next_index < yan_particles.length; yan_next_index += 1) {
        const yan_next_particle = yan_particles[yan_next_index];
        const yan_delta_x = yan_particle.x - yan_next_particle.x;
        const yan_delta_y = yan_particle.y - yan_next_particle.y;
        const yan_distance = Math.hypot(yan_delta_x, yan_delta_y);

        if (yan_distance < 118) {
          const yan_opacity = (1 - yan_distance / 118) * 0.1;
          yan_context.beginPath();
          yan_context.moveTo(yan_particle.x, yan_particle.y);
          yan_context.lineTo(yan_next_particle.x, yan_next_particle.y);
          yan_context.strokeStyle = `rgba(114, 224, 194, ${yan_opacity})`;
          yan_context.lineWidth = 0.55;
          yan_context.stroke();
        }
      }

      if (yan_pointer.active) {
        const yan_pointer_distance = Math.hypot(yan_particle.x - yan_pointer.x, yan_particle.y - yan_pointer.y);

        if (yan_pointer_distance < 165) {
          const yan_pointer_opacity = (1 - yan_pointer_distance / 165) * 0.2;
          yan_context.beginPath();
          yan_context.moveTo(yan_particle.x, yan_particle.y);
          yan_context.lineTo(yan_pointer.x, yan_pointer.y);
          yan_context.strokeStyle = `rgba(232, 196, 133, ${yan_pointer_opacity})`;
          yan_context.lineWidth = 0.7;
          yan_context.stroke();
        }
      }

      const yan_tone = yan_particle.tone === 'gold' ? '232, 196, 133' : '114, 224, 194';
      yan_context.beginPath();
      yan_context.arc(yan_particle.x, yan_particle.y, yan_particle.radius, 0, Math.PI * 2);
      yan_context.fillStyle = `rgba(${yan_tone}, 0.55)`;
      yan_context.fill();
    }

    yan_context.globalCompositeOperation = 'source-over';
  }

  function yan_animate() {
    yan_render_frame();
    yan_animation_id = window.requestAnimationFrame(yan_animate);
  }

  function yan_start_animation() {
    window.cancelAnimationFrame(yan_animation_id);

    if (yan_motion_preference.matches) {
      yan_render_frame();
      return;
    }

    yan_animate();
  }

  function yan_handle_pointer_move(yan_event) {
    yan_pointer.x = yan_event.clientX;
    yan_pointer.y = yan_event.clientY;
    yan_pointer.active = true;
  }

  function yan_handle_pointer_leave() {
    yan_pointer.active = false;
    yan_pointer.x = -1000;
    yan_pointer.y = -1000;
  }

  function yan_handle_motion_change() {
    yan_start_animation();
  }

  function yan_handle_visibility_change() {
    if (document.hidden) {
      window.cancelAnimationFrame(yan_animation_id);
      return;
    }

    yan_start_animation();
  }

  function yan_initialize_canvas() {
    if (!yan_canvas) {
      return;
    }

    yan_context = yan_canvas.getContext('2d');

    if (!yan_context) {
      console.error('[云栖数据工坊] 当前浏览器无法创建 Canvas 2D 上下文。');
      return;
    }

    yan_resize_canvas();
    yan_start_animation();

    window.addEventListener('resize', yan_resize_canvas);
    window.addEventListener('pointermove', yan_handle_pointer_move, { passive: true });
    window.addEventListener('pointerleave', yan_handle_pointer_leave);
    document.addEventListener('visibilitychange', yan_handle_visibility_change);
    yan_motion_preference.addEventListener('change', yan_handle_motion_change);
  }

  async function yan_load_service_status() {
    const yan_service_widget = document.querySelector('[data-yan-service]');
    const yan_service_text = document.querySelector('[data-yan-service-text]');

    if (!yan_service_widget || !yan_service_text) {
      return;
    }

    try {
      const yan_response = await fetch('/api/health', {
        headers: { Accept: 'application/json' }
      });

      if (!yan_response.ok) {
        throw new Error(`HTTP ${yan_response.status}`);
      }

      const yan_payload = await yan_response.json();
      console.log('[云栖数据工坊] 服务状态：', yan_payload);

      if (yan_payload.code !== 0) {
        throw new Error(yan_payload.msg || '接口返回异常');
      }

      yan_service_widget.classList.add('yan_service-state--online');
      yan_service_widget.classList.remove('yan_service-state--offline');
      yan_service_text.textContent = '服务在线';
    } catch (yan_error) {
      console.error('[云栖数据工坊] 服务状态获取失败：', yan_error);
      yan_service_widget.classList.add('yan_service-state--offline');
      yan_service_widget.classList.remove('yan_service-state--online');
      yan_service_text.textContent = '服务离线';
    }
  }

  function yan_set_current_year() {
    const yan_year = document.getElementById('yan_year');

    if (yan_year) {
      yan_year.textContent = String(new Date().getFullYear());
    }
  }

  window.yan_fetch_json = yan_fetch_json;
  window.yan_escape_html = yan_escape_html;
  window.yan_format_number = yan_format_number;
  window.yan_format_datetime = yan_format_datetime;
  window.yan_format_short_datetime = yan_format_short_datetime;
  window.yan_status_text = yan_status_text;
  window.yan_status_class = yan_status_class;
  window.yan_show_toast = yan_show_toast;

  yan_initialize_canvas();
  yan_load_service_status();
  yan_set_current_year();
})();
