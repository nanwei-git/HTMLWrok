// 姓名：杨庆鸿 | 学号：24002120509
// 时间：2026-11-09 | 大模型：DeepSeek V4.1 Flash Free

(function yan_initialize_dashboard() {
  'use strict';

  const yan_error_box = document.querySelector('[data-yan-error]');
  const yan_error_text = document.querySelector('[data-yan-error-text]');
  const yan_weekly_chart = document.querySelector('[data-yan-weekly-chart]');
  const yan_category_chart = document.querySelector('[data-yan-category-chart]');
  const yan_recent_runs = document.querySelector('[data-yan-recent-runs]');
  const yan_latest_reports = document.querySelector('[data-yan-latest-reports]');
  const yan_progress_ring = document.querySelector('[data-yan-progress-ring]');
  const yan_last_update = document.querySelector('[data-yan-last-update]');

  function yan_clock_text() {
    const yan_now = new Date();
    const yan_hours = String(yan_now.getHours()).padStart(2, '0');
    const yan_minutes = String(yan_now.getMinutes()).padStart(2, '0');
    return `${yan_hours}:${yan_minutes}`;
  }

  function yan_render_stats(yan_stats) {
    document.querySelectorAll('[data-yan-stat]').forEach((yan_node) => {
      const yan_key = yan_node.dataset.yanStat;
      const yan_value = Number(yan_stats[yan_key] || 0);
      yan_node.textContent = yan_format_number(yan_value);
    });

    const yan_success_rate = Number(yan_stats.successRate || 0);
    const yan_success_node = document.querySelector('[data-yan-success-rate]');
    const yan_datasets_node = document.querySelector('[data-yan-pulse-datasets]');
    const yan_workflows_node = document.querySelector('[data-yan-pulse-workflows]');
    const yan_today_node = document.querySelector('[data-yan-pulse-today]');

    if (yan_success_node) {
      yan_success_node.textContent = `${yan_success_rate.toFixed(1)}%`;
    }

    if (yan_datasets_node) {
      yan_datasets_node.textContent = yan_format_number(yan_stats.dataSources);
    }

    if (yan_workflows_node) {
      yan_workflows_node.textContent = yan_format_number(yan_stats.activeWorkflows);
    }

    if (yan_today_node) {
      yan_today_node.textContent = yan_format_number(yan_stats.todayRuns);
    }

    if (yan_progress_ring) {
      yan_progress_ring.style.setProperty('--yan_progress', `${Math.min(yan_success_rate, 100)}%`);
    }
  }

  function yan_render_weekly(yan_weekly_output) {
    if (!yan_weekly_chart) {
      return;
    }

    const yan_max_value = Math.max(...yan_weekly_output.map((yan_item) => Number(yan_item.value) || 0), 1);

    yan_weekly_chart.innerHTML = yan_weekly_output.map((yan_item) => {
      const yan_value = Number(yan_item.value) || 0;
      const yan_height = Math.max((yan_value / yan_max_value) * 100, yan_value > 0 ? 8 : 3);

      return `
        <div class="yan_bar-item">
          <span class="yan_bar-value">${yan_value}</span>
          <div class="yan_bar-track">
            <span class="yan_bar-fill" style="height: ${yan_height}%"></span>
          </div>
          <span class="yan_bar-label">${yan_escape_html(yan_item.label)}</span>
        </div>
      `;
    }).join('');
  }

  function yan_render_categories(yan_categories) {
    if (!yan_category_chart) {
      return;
    }

    const yan_total = yan_categories.reduce((yan_sum, yan_item) => yan_sum + Number(yan_item.count || 0), 0);

    if (!yan_categories.length) {
      yan_category_chart.innerHTML = '<p class="yan_state-text">暂无分类数据</p>';
      return;
    }

    yan_category_chart.innerHTML = yan_categories.map((yan_item) => {
      const yan_count = Number(yan_item.count) || 0;
      const yan_percent = yan_total ? Math.round((yan_count / yan_total) * 100) : 0;

      return `
        <div class="yan_category-row">
          <div class="yan_category-meta">
            <span>${yan_escape_html(yan_item.category)}</span>
            <span>${yan_count} 份 · ${yan_percent}%</span>
          </div>
          <div class="yan_category-track">
            <span class="yan_category-fill" style="width: ${yan_percent}%"></span>
          </div>
        </div>
      `;
    }).join('');
  }

  function yan_render_recent_runs(yan_runs) {
    if (!yan_recent_runs) {
      return;
    }

    if (!yan_runs.length) {
      yan_recent_runs.innerHTML = '<p class="yan_state-text">暂无运行记录</p>';
      return;
    }

    yan_recent_runs.innerHTML = yan_runs.map((yan_run) => `
      <div class="yan_run-row">
        <span class="yan_run-name">${yan_escape_html(yan_run.workflowName)}</span>
        <span class="${yan_status_class(yan_run.status)}">${yan_escape_html(yan_status_text(yan_run.status))}</span>
        <span class="yan_run-time">${yan_escape_html(yan_format_short_datetime(yan_run.startedAt))}</span>
      </div>
    `).join('');
  }

  function yan_render_latest_reports(yan_reports) {
    if (!yan_latest_reports) {
      return;
    }

    if (!yan_reports.length) {
      yan_latest_reports.innerHTML = '<p class="yan_state-text">暂无报表数据</p>';
      return;
    }

    yan_latest_reports.innerHTML = yan_reports.map((yan_report) => `
      <a class="yan_latest-item" href="report-detail.html?id=${Number(yan_report.id)}">
        <span>
          <span class="yan_latest-title">${yan_escape_html(yan_report.title)}</span>
          <span class="yan_latest-meta">${yan_escape_html(yan_report.category)} · ${yan_escape_html(yan_report.owner)}</span>
        </span>
        <span class="yan_latest-side">
          <span class="${yan_status_class(yan_report.status)}">${yan_escape_html(yan_status_text(yan_report.status))}</span>
        </span>
      </a>
    `).join('');
  }

  function yan_show_error(yan_error) {
    console.error('[云栖数据工坊] 工作台数据加载失败：', yan_error);

    if (yan_error_box) {
      yan_error_box.hidden = false;
    }

    if (yan_error_text) {
      yan_error_text.textContent = `${yan_error.message}。请确认后端服务已启动，并检查浏览器控制台中的详细信息。`;
    }
  }

  async function yan_load_dashboard() {
    try {
      const yan_data = await yan_fetch_json('/api/dashboard');
      console.log('[云栖数据工坊] 工作台数据：', yan_data);

      yan_render_stats(yan_data.stats);
      yan_render_weekly(yan_data.weeklyOutput);
      yan_render_categories(yan_data.categoryDistribution);
      yan_render_recent_runs(yan_data.recentRuns);
      yan_render_latest_reports(yan_data.latestReports);

      if (yan_error_box) {
        yan_error_box.hidden = true;
      }

      if (yan_last_update) {
        yan_last_update.textContent = `${yan_clock_text()} 已同步`;
      }
    } catch (yan_error) {
      yan_show_error(yan_error);

      if (yan_last_update) {
        yan_last_update.textContent = '同步失败';
      }
    }
  }

  yan_load_dashboard();
})();
