// 姓名：杨庆鸿 | 学号：24002120509
// 时间：2026-11-09 | 大模型：DeepSeek V4.1 Flash Free

(function yan_initialize_reports() {
  'use strict';

  const yan_grid = document.querySelector('[data-yan-report-grid]');
  const yan_category_filters = document.querySelector('[data-yan-category-filters]');
  const yan_status_filters = document.querySelectorAll('[data-yan-report-status]');
  const yan_error_box = document.querySelector('[data-yan-error]');
  const yan_error_text = document.querySelector('[data-yan-error-text]');
  const yan_state = {
    yan_reports: [],
    yan_category: 'all',
    yan_status: 'all'
  };

  function yan_render_summary() {
    const yan_total_node = document.querySelector('[data-yan-report-count]');
    const yan_published_node = document.querySelector('[data-yan-report-published]');
    const yan_review_node = document.querySelector('[data-yan-report-review]');
    const yan_draft_node = document.querySelector('[data-yan-report-draft]');

    if (yan_total_node) {
      yan_total_node.textContent = String(yan_state.yan_reports.length);
    }

    if (yan_published_node) {
      yan_published_node.textContent = String(yan_state.yan_reports.filter((yan_item) => yan_item.status === 'published').length);
    }

    if (yan_review_node) {
      yan_review_node.textContent = String(yan_state.yan_reports.filter((yan_item) => yan_item.status === 'review').length);
    }

    if (yan_draft_node) {
      yan_draft_node.textContent = String(yan_state.yan_reports.filter((yan_item) => yan_item.status === 'draft').length);
    }
  }

  function yan_render_category_filters() {
    if (!yan_category_filters) {
      return;
    }

    const yan_categories = [...new Set(yan_state.yan_reports.map((yan_item) => yan_item.category))];

    yan_category_filters.innerHTML = [
      '<button class="yan_filter yan_filter--active" type="button" data-yan-report-category="all">全部分类</button>',
      ...yan_categories.map((yan_category) => `
        <button class="yan_filter" type="button" data-yan-report-category="${yan_escape_html(yan_category)}">${yan_escape_html(yan_category)}</button>
      `)
    ].join('');

    yan_category_filters.querySelectorAll('[data-yan-report-category]').forEach((yan_button) => {
      yan_button.addEventListener('click', () => {
        yan_state.yan_category = yan_button.dataset.yanReportCategory;

        yan_category_filters.querySelectorAll('[data-yan-report-category]').forEach((yan_item) => {
          yan_item.classList.toggle('yan_filter--active', yan_item === yan_button);
        });

        yan_render_reports();
      });
    });
  }

  function yan_report_spark(yan_values) {
    if (!Array.isArray(yan_values) || !yan_values.length) {
      return '';
    }

    const yan_max_value = Math.max(...yan_values.map((yan_value) => Number(yan_value) || 0), 1);
    const yan_min_value = Math.min(...yan_values.map((yan_value) => Number(yan_value) || 0));

    return `
      <div class="yan_spark" aria-hidden="true">
        ${yan_values.map((yan_value) => {
          const yan_number = Number(yan_value) || 0;
          const yan_height = 18 + ((yan_number - yan_min_value) / Math.max(yan_max_value - yan_min_value, 1)) * 82;

          return `<span class="yan_spark-bar" style="height: ${Math.max(yan_height, 12)}%"></span>`;
        }).join('')}
      </div>
    `;
  }

  function yan_report_card(yan_report) {
    const yan_change = Number(yan_report.chartChange || 0);
    const yan_change_text = `${yan_change >= 0 ? '↑' : '↓'} ${Math.abs(yan_change).toFixed(1)}%`;

    return `
      <a class="yan_report-card" href="report-detail.html?id=${Number(yan_report.id)}">
        <div class="yan_report-top">
          <span class="yan_report-category">${yan_escape_html(yan_report.category)}</span>
          <span class="${yan_status_class(yan_report.status)}">${yan_escape_html(yan_status_text(yan_report.status))}</span>
        </div>
        <h3>${yan_escape_html(yan_report.title)}</h3>
        <p class="yan_report-summary">${yan_escape_html(yan_report.summary)}</p>
        ${yan_report_spark(yan_report.chartValues)}
        <div class="yan_report-footer">
          <span class="yan_report-stats">
            <span>${yan_escape_html(yan_report.owner)}</span>
            <span>${yan_escape_html(yan_format_short_datetime(yan_report.updatedAt))}</span>
          </span>
          <span>${yan_format_number(yan_report.views)} 次浏览 · ${yan_change_text}</span>
        </div>
      </a>
    `;
  }

  function yan_render_reports() {
    if (!yan_grid) {
      return;
    }

    const yan_visible = yan_state.yan_reports.filter((yan_item) => {
      const yan_category_match = yan_state.yan_category === 'all' || yan_item.category === yan_state.yan_category;
      const yan_status_match = yan_state.yan_status === 'all' || yan_item.status === yan_state.yan_status;
      return yan_category_match && yan_status_match;
    });

    if (!yan_visible.length) {
      yan_grid.innerHTML = `
        <div class="yan_state-box" style="grid-column: 1 / -1;">
          <span class="yan_state-icon" aria-hidden="true">◇</span>
          <h2 class="yan_state-title">当前筛选条件下没有报表</h2>
          <p class="yan_state-text">尝试切换业务分类或发布状态，查看其他分析成果。</p>
        </div>
      `;
      return;
    }

    yan_grid.innerHTML = yan_visible.map(yan_report_card).join('');
  }

  function yan_bind_status_filters() {
    yan_status_filters.forEach((yan_button) => {
      yan_button.addEventListener('click', () => {
        yan_state.yan_status = yan_button.dataset.yanReportStatus;

        yan_status_filters.forEach((yan_item) => {
          yan_item.classList.toggle('yan_filter--active', yan_item === yan_button);
        });

        yan_render_reports();
      });
    });
  }

  function yan_show_error(yan_error) {
    console.error('[云栖数据工坊] 报表列表加载失败：', yan_error);

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

  async function yan_load_reports() {
    try {
      const yan_data = await yan_fetch_json('/api/reports');
      console.log('[云栖数据工坊] 报表列表：', yan_data);

      yan_state.yan_reports = Array.isArray(yan_data.reports) ? yan_data.reports : [];
      yan_render_summary();
      yan_render_category_filters();
      yan_render_reports();

      if (yan_error_box) {
        yan_error_box.hidden = true;
      }
    } catch (yan_error) {
      yan_show_error(yan_error);
    }
  }

  yan_bind_status_filters();
  yan_load_reports();
})();
