// 姓名：杨庆鸿 | 学号：24002120509
// 时间：2026-11-09 | 大模型：DeepSeek V4.1 Flash Free

(function yan_initialize_workflow_detail() {
  'use strict';

  const yan_params = new URLSearchParams(window.location.search);
  const yan_workflow_id = Number.parseInt(yan_params.get('id'), 10);
  const yan_content = document.querySelector('[data-yan-detail-content]');
  const yan_error_box = document.querySelector('[data-yan-error]');
  const yan_error_text = document.querySelector('[data-yan-error-text]');
  const yan_run_button = document.querySelector('[data-yan-run-button]');
  const yan_run_hint = document.querySelector('[data-yan-run-hint]');
  const yan_trigger_labels = {
    schedule: '调度触发',
    manual: '手动触发'
  };

  function yan_show_error(yan_error) {
    console.error('[云栖数据工坊] 工作流详情加载失败：', yan_error);

    if (yan_error_box) {
      yan_error_box.hidden = false;
    }

    if (yan_error_text) {
      yan_error_text.textContent = `${yan_error.message}。请返回工作流中心选择有效的工作流，或检查后端服务。`;
    }

    if (yan_content) {
      yan_content.hidden = true;
    }
  }

  function yan_render_header(yan_data) {
    const yan_workflow = yan_data.workflow;
    const yan_status_node = document.querySelector('[data-yan-workflow-status]');
    const yan_code_node = document.querySelector('[data-yan-workflow-code]');
    const yan_name_node = document.querySelector('[data-yan-workflow-name]');
    const yan_description_node = document.querySelector('[data-yan-workflow-description]');
    const yan_success_node = document.querySelector('[data-yan-workflow-success]');
    const yan_steps_node = document.querySelector('[data-yan-workflow-steps]');
    const yan_last_run_node = document.querySelector('[data-yan-workflow-last-run]');
    const yan_runs_node = document.querySelector('[data-yan-workflow-runs]');
    const yan_info_schedule = document.querySelector('[data-yan-info="schedule"]');
    const yan_info_owner = document.querySelector('[data-yan-info="owner"]');
    const yan_info_created = document.querySelector('[data-yan-info="created"]');
    const yan_info_updated = document.querySelector('[data-yan-info="updated"]');
    const yan_info_id = document.querySelector('[data-yan-info="id"]');

    if (yan_status_node) {
      yan_status_node.className = yan_status_class(yan_workflow.status);
      yan_status_node.textContent = yan_status_text(yan_workflow.status);
    }

    if (yan_code_node) {
      yan_code_node.textContent = `FLOW / ${String(Number(yan_workflow.id)).padStart(3, '0')}`;
    }

    if (yan_name_node) {
      yan_name_node.textContent = yan_workflow.name;
    }

    if (yan_description_node) {
      yan_description_node.textContent = yan_workflow.description;
    }

    if (yan_success_node) {
      yan_success_node.textContent = `${Number(yan_workflow.successRate || 0).toFixed(1)}%`;
    }

    if (yan_steps_node) {
      yan_steps_node.textContent = `${Number(yan_workflow.stepCount)} 步`;
    }

    if (yan_last_run_node) {
      yan_last_run_node.textContent = yan_format_short_datetime(yan_workflow.lastRunAt);
    }

    if (yan_runs_node) {
      yan_runs_node.textContent = `${Array.isArray(yan_data.runs) ? yan_data.runs.length : 0} 次`;
    }

    if (yan_info_schedule) {
      yan_info_schedule.textContent = yan_workflow.schedule;
    }

    if (yan_info_owner) {
      yan_info_owner.textContent = yan_workflow.owner;
    }

    if (yan_info_created) {
      yan_info_created.textContent = yan_format_datetime(yan_workflow.createdAt);
    }

    if (yan_info_updated) {
      yan_info_updated.textContent = yan_format_datetime(yan_workflow.updatedAt);
    }

    if (yan_info_id) {
      yan_info_id.textContent = `FLOW-${String(Number(yan_workflow.id)).padStart(3, '0')}`;
    }

    if (yan_run_button) {
      const yan_is_active = yan_workflow.status === 'active';
      yan_run_button.disabled = !yan_is_active;
      yan_run_button.textContent = yan_is_active ? '手动运行工作流' : '当前状态不可运行';
    }

    if (yan_run_hint) {
      yan_run_hint.textContent = yan_workflow.status === 'active'
        ? `调度计划：${yan_workflow.schedule}`
        : '仅运行中的工作流允许手动执行';
    }
  }

  function yan_render_steps(yan_steps) {
    const yan_steps_container = document.querySelector('[data-yan-steps]');

    if (!yan_steps_container) {
      return;
    }

    if (!yan_steps.length) {
      yan_steps_container.innerHTML = `
        <div class="yan_state-box" style="margin: 18px; min-height: 160px;">
          <h2 class="yan_state-title">该工作流尚未配置步骤</h2>
          <p class="yan_state-text">可在工作流编排模块中补充抽取、清洗、分析与交付步骤。</p>
        </div>
      `;
      return;
    }

    yan_steps_container.innerHTML = yan_steps.map((yan_step) => `
      <div class="yan_step">
        <span class="yan_step-index">${String(Number(yan_step.order)).padStart(2, '0')}</span>
        <div class="yan_step-body">
          <div class="yan_step-top">
            <h3 class="yan_step-name">${yan_escape_html(yan_step.name)}</h3>
            <span class="yan_step-type">${yan_escape_html(yan_step.type)}</span>
            <span class="${yan_status_class(yan_step.status)}">${yan_escape_html(yan_status_text(yan_step.status))}</span>
          </div>
          <p class="yan_step-config">${yan_escape_html(yan_step.configSummary)}</p>
        </div>
      </div>
    `).join('');
  }

  function yan_render_runs(yan_runs) {
    const yan_runs_container = document.querySelector('[data-yan-runs]');

    if (!yan_runs_container) {
      return;
    }

    if (!yan_runs.length) {
      yan_runs_container.innerHTML = `
        <div class="yan_state-box" style="margin: 18px; min-height: 160px;">
          <h2 class="yan_state-title">还没有运行记录</h2>
          <p class="yan_state-text">工作流首次执行后，耗时、处理行数与触发方式会显示在这里。</p>
        </div>
      `;
      return;
    }

    yan_runs_container.innerHTML = yan_runs.map((yan_run) => {
      const yan_trigger = yan_trigger_labels[yan_run.triggerType] || yan_run.triggerType;

      return `
        <div class="yan_run-history-item">
          <div>
            <div class="yan_run-history-title">
              <span class="${yan_status_class(yan_run.status)}">${yan_escape_html(yan_status_text(yan_run.status))}</span>
              <span>${yan_escape_html(yan_trigger)}</span>
            </div>
            <div class="yan_run-history-meta">
              开始 ${yan_escape_html(yan_format_short_datetime(yan_run.startedAt))} · 耗时 ${yan_format_number(yan_run.durationSeconds)} 秒
            </div>
          </div>
          <div class="yan_run-history-side">
            ${yan_format_number(yan_run.rowsProcessed)} 行<br>
            ${yan_escape_html(yan_format_short_datetime(yan_run.finishedAt))}
          </div>
        </div>
      `;
    }).join('');
  }

  async function yan_load_detail() {
    if (!Number.isInteger(yan_workflow_id) || yan_workflow_id <= 0) {
      yan_show_error(new Error('工作流编号格式不正确'));
      return;
    }

    try {
      const yan_data = await yan_fetch_json(`/api/workflows/${yan_workflow_id}`);
      console.log('[云栖数据工坊] 工作流详情：', yan_data);

      yan_render_header(yan_data);
      yan_render_steps(Array.isArray(yan_data.steps) ? yan_data.steps : []);
      yan_render_runs(Array.isArray(yan_data.runs) ? yan_data.runs : []);

      if (yan_error_box) {
        yan_error_box.hidden = true;
      }

      if (yan_content) {
        yan_content.hidden = false;
      }
    } catch (yan_error) {
      yan_show_error(yan_error);
    }
  }

  async function yan_run_workflow() {
    if (!yan_run_button || yan_run_button.disabled) {
      return;
    }

    yan_run_button.disabled = true;
    yan_run_button.textContent = '正在执行…';

    try {
      const yan_data = await yan_fetch_json(`/api/workflows/${yan_workflow_id}/runs`, {
        method: 'POST'
      });
      console.log('[云栖数据工坊] 工作流执行结果：', yan_data);
      yan_show_toast('工作流执行成功，运行记录已写入');
      await yan_load_detail();
    } catch (yan_error) {
      console.error('[云栖数据工坊] 工作流执行失败：', yan_error);
      yan_show_toast(yan_error.message, 'error');
      yan_run_button.disabled = false;
      yan_run_button.textContent = '手动运行工作流';
    }
  }

  if (yan_run_button) {
    yan_run_button.addEventListener('click', yan_run_workflow);
  }

  yan_load_detail();
})();
