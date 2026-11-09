// 姓名：杨庆鸿 | 学号：24002120509
// 时间：2026-11-09 | 大模型：DeepSeek V4.1 Flash Free

(function yan_initialize_page() {
  'use strict';

  const yan_canvas = document.getElementById('yan_canvas');
  const yan_motion_preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const yan_pointer = { x: -1000, y: -1000, active: false };
  let yan_context = null;
  let yan_width = 0;
  let yan_height = 0;
  let yan_particles = [];
  let yan_animation_id = 0;

  function yan_create_particles() {
    const yan_count = Math.min(94, Math.max(34, Math.round((yan_width * yan_height) / 22000)));

    yan_particles = Array.from({ length: yan_count }, () => ({
      x: Math.random() * yan_width,
      y: Math.random() * yan_height,
      vx: (Math.random() - 0.5) * 0.24,
      vy: (Math.random() - 0.5) * 0.24,
      radius: Math.random() * 1.55 + 0.55,
      tone: Math.random() > 0.55 ? 'gold' : 'mint'
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

        if (yan_distance < 126) {
          const yan_opacity = (1 - yan_distance / 126) * 0.13;
          yan_context.beginPath();
          yan_context.moveTo(yan_particle.x, yan_particle.y);
          yan_context.lineTo(yan_next_particle.x, yan_next_particle.y);
          yan_context.strokeStyle = `rgba(124, 224, 195, ${yan_opacity})`;
          yan_context.lineWidth = 0.65;
          yan_context.stroke();
        }
      }

      if (yan_pointer.active) {
        const yan_pointer_distance = Math.hypot(yan_particle.x - yan_pointer.x, yan_particle.y - yan_pointer.y);

        if (yan_pointer_distance < 190) {
          const yan_pointer_opacity = (1 - yan_pointer_distance / 190) * 0.24;
          yan_context.beginPath();
          yan_context.moveTo(yan_particle.x, yan_particle.y);
          yan_context.lineTo(yan_pointer.x, yan_pointer.y);
          yan_context.strokeStyle = `rgba(231, 201, 141, ${yan_pointer_opacity})`;
          yan_context.lineWidth = 0.8;
          yan_context.stroke();
        }
      }

      const yan_tone = yan_particle.tone === 'gold' ? '231, 201, 141' : '124, 224, 195';
      yan_context.beginPath();
      yan_context.arc(yan_particle.x, yan_particle.y, yan_particle.radius, 0, Math.PI * 2);
      yan_context.fillStyle = `rgba(${yan_tone}, 0.64)`;
      yan_context.fill();
    }

    if (yan_pointer.active) {
      yan_context.beginPath();
      yan_context.arc(yan_pointer.x, yan_pointer.y, 2.4, 0, Math.PI * 2);
      yan_context.fillStyle = 'rgba(231, 201, 141, 0.72)';
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
      console.error('[云栖校园] 当前浏览器无法创建 Canvas 2D 上下文。');
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
      console.log('[云栖校园] 服务状态响应：', yan_payload);

      if (yan_payload.code !== 0) {
        throw new Error(yan_payload.msg || '接口返回异常');
      }

      yan_service_widget.classList.add('yan_service-state--online');
      yan_service_widget.classList.remove('yan_service-state--offline');
      yan_service_text.textContent = '服务在线';
    } catch (yan_error) {
      console.error('[云栖校园] 服务状态获取失败：', yan_error);
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

  yan_initialize_canvas();
  yan_load_service_status();
  yan_set_current_year();
})();
