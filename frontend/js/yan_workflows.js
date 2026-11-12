// 姓名：杨庆鸿 | 学号：24002120509
// 时间：2026-11-09 | 大模型：DeepSeek V4.1 Flash Free

(function yan_initialize_workflows() {
  'use strict';

  const yan_grid = document.querySelector('[data-yan-workflow-grid]');
  const yan_error_box = document.querySelector('[data-yan-error]');
  const yan_error_text = document.querySelector('[data-yan-error-text]');
  const yan_filter_buttons = document.querySelectorAll('[data-yan-workflow-filter]');
  const yan_state = {
    yan_workflows: [],
    yan_filter: 'all'
  };

  function yan_render_summary() {
    const yan_total_node = document.querySelector('[data-yan-workflow-count]');
    const yan_active_node = document.querySelector('[data-yan-workflow-active]');
    const yan_paused_node = document.querySelector('[data-yan-workflow-paused]');
    const yan_draft_node = document.querySelector('[data-yan-workflow-draft]');

    if (yan_total_node) {
      yan_total_node.textContent = String(yan_state.yan_workflows.length);
    }

    if (yan_active_node) {
      yan_active_node.textContent = String(yan_state.yan_workflows.filter((yan_item) => yan_item.status === 'active').length);
    }

    if (yan_paused_node) {
      yan_paused_node.textContent = String(yan_state.yan_workflows.filter((yan_item) => yan_item.status === 'paused').length);
    }

    if (yan_draft_node) {
      yan_draft_node.textContent = String(yan_state.yan_workflows.filter((yan_item) => yan_item.status === 'draft').length);
    }
  }

  function yan_workflow_card(yan_workflow) {
    const yan_success_rate = Math.min(Number(yan_workflow.successRate || 0), 100);

    return `
      <a class="yan_workflow-card" href="workflow-detail.html?id=${Number(yan_workflow.id)}">
        <div class="yan_workflow-top">
          <span class="yan_workflow-id">FLOW / ${String(Number(yan_workflow.id)).padStart(3, '0')}</span>
          <span class="${yan_status_class(yan_workflow.status)}">${yan_escape_html(yan_status_text(yan_workflow.status))}</span>
        </div>
        <h3>${yan_escape_html(yan_workflow.name)}</h3>
        <p class="yan_workflow-desc">${yan_escape_html(yan_workflow.description)}</p>

        <div class="yan_workflow-meta">
          <span class="yan_meta-item">
            <span class="yan_meta-label">调度计划</span>
            <span class="yan_meta-value">${yan_escape_html(yan_workflow.schedule)}</span>
          </span>
          <span class="yan_meta-item">
            <span class="yan_meta-label">负责人</span>
            <span class="yan_meta-value">${yan_escape_html(yan_workflow.owner)}</span>
          </span>
          <span class="yan_meta-item">
            <span class="yan_meta-label">步骤</span>
            <span class="yan_meta-value">${Number(yan_workflow.stepCount)} 步</span>
          </span>
        </div>

        <div class="yan_workflow-progress">
          <div class="yan_progress-meta">
            <span>执行成功率</span>
            <strong>${yan_success_rate.toFixed(1)}%</strong>
          </div>
          <div class="yan_progress-track">
            <span class="yan_progress-fill" style="width: ${yan_success_rate}%"></span>
          </div>
        </div>

        <div class="yan_workflow-footer">
          <span>最近运行 · ${yan_escape_html(yan_format_short_datetime(yan_workflow.lastRunAt))}</span>
          <span class="yan_workflow-arrow" aria-hidden="true">→</span>
        </div>
      </a>
    `;
  }

  function yan_render_workflows() {
    if (!yan_grid) {
      return;
    }

    const yan_visible = yan_state.yan_filter === 'all'
      ? yan_state.yan_workflows
      : yan_state.yan_workflows.filter((yan_item) => yan_item.status === yan_state.yan_filter);

    if (!yan_visible.length) {
      yan_grid.innerHTML = `
        <div class="yan_state-box" style="grid-column: 1 / -1;">
          <span class="yan_state-icon" aria-hidden="true">◇</span>
          <h2 class="yan_state-title">当前筛选条件下没有工作流</h2>
          <p class="yan_state-text">切换状态筛选，或回到全部工作流查看完整列表。</p>
        </div>
      `;
      return;
    }

    yan_grid.innerHTML = yan_visible.map(yan_workflow_card).join('');
  }

  function yan_show_error(yan_error) {
    console.error('[云栖数据工坊] 工作流列表加载失败：', yan_error);

    if (yan_error_box) {
      yan_error_box.hidden = false;
    }

    if (yan_error_text) {
      yan_error_text.textContent = `${yan_error.message}。请确认后端服务已启动，并检查浏览器控制台。`;
    }

    if (yan_grid) {
      yan_grid.innerHTML = '';
    }
  }

  function yan_bind_filters() {
    yan_filter_buttons.forEach((yan_button) => {
      yan_button.addEventListener('click', () => {
        yan_state.yan_filter = yan_button.dataset.yanWorkflowFilter;

        yan_filter_buttons.forEach((yan_item) => {
          yan_item.classList.toggle('yan_filter--active', yan_item === yan_button);
        });

        yan_render_workflows();
      });
    });
  }

  async function yan_load_workflows() {
    try {
      const yan_data = await yan_fetch_json('/api/workflows');
      console.log('[云栖数据工坊] 工作流列表：', yan_data);

      yan_state.yan_workflows = Array.isArray(yan_data.workflows) ? yan_data.workflows : [];
      yan_render_summary();
      yan_render_workflows();

      if (yan_error_box) {
        yan_error_box.hidden = true;
      }
    } catch (yan_error) {
      yan_show_error(yan_error);
    }
  }

  yan_bind_filters();
  yan_load_workflows();
})();
