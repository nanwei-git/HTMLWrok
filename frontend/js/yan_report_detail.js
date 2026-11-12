// 姓名：杨庆鸿 | 学号：24002120509
// 时间：2026-11-09 | 大模型：DeepSeek V4.1 Flash Free

(function yan_initialize_report_detail() {
  'use strict';

  const yan_params = new URLSearchParams(window.location.search);
  const yan_report_id = Number.parseInt(yan_params.get('id'), 10);
  const yan_content = document.querySelector('[data-yan-detail-content]');
  const yan_error_box = document.querySelector('[data-yan-error]');
  const yan_error_text = document.querySelector('[data-yan-error-text]');

  function yan_compact_value(yan_value) {
    const yan_number = Number(yan_value) || 0;
    const yan_absolute = Math.abs(yan_number);

    if (yan_absolute >= 10000) {
      return `${(yan_number / 10000).toFixed(1)}万`;
    }

    if (yan_absolute >= 1000) {
      return `${(yan_number / 1000).toFixed(1)}k`;
    }

    return Number.isInteger(yan_number) ? String(yan_number) : yan_number.toFixed(1);
  }

  function yan_show_error(yan_error) {
    console.error('[云栖数据工坊] 报表详情加载失败：', yan_error);

    if (yan_error_box) {
      yan_error_box.hidden = false;
    }

    if (yan_error_text) {
      yan_error_text.textContent = `${yan_error.message}。请返回报表中心选择有效的报表，或检查后端服务。`;
    }

    if (yan_content) {
      yan_content.hidden = true;
    }
  }

  function yan_render_header(yan_report) {
    const yan_category_node = document.querySelector('[data-yan-report-category]');
    const yan_status_node = document.querySelector('[data-yan-report-status]');
    const yan_code_node = document.querySelector('[data-yan-report-code]');
    const yan_title_node = document.querySelector('[data-yan-report-title]');
    const yan_summary_node = document.querySelector('[data-yan-report-summary]');
    const yan_latest_node = document.querySelector('[data-yan-report-latest]');
    const yan_change_node = document.querySelector('[data-yan-report-change]');
    const yan_views_node = document.querySelector('[data-yan-report-views]');
    const yan_updated_node = document.querySelector('[data-yan-report-updated]');
    const yan_owner_node = document.querySelector('[data-yan-report-owner]');
    const yan_category_info_node = document.querySelector('[data-yan-report-category-info]');
    const yan_created_node = document.querySelector('[data-yan-report-created]');
    const yan_workflow_link = document.querySelector('[data-yan-workflow-link]');
    const yan_workflow_status_node = document.querySelector('[data-yan-workflow-status]');
    const yan_last_value = yan_report.chartValues.length
      ? yan_report.chartValues[yan_report.chartValues.length - 1]
      : 0;
    const yan_change = Number(yan_report.chartChange || 0);

    if (yan_category_node) {
      yan_category_node.textContent = yan_report.category;
    }

    if (yan_status_node) {
      yan_status_node.className = yan_status_class(yan_report.status);
      yan_status_node.textContent = yan_status_text(yan_report.status);
    }

    if (yan_code_node) {
      yan_code_node.textContent = `REPORT / ${String(Number(yan_report.id)).padStart(3, '0')}`;
    }

    if (yan_title_node) {
      yan_title_node.textContent = yan_report.title;
    }

    if (yan_summary_node) {
      yan_summary_node.textContent = yan_report.summary;
    }

    if (yan_latest_node) {
      yan_latest_node.textContent = yan_format_number(yan_last_value);
    }

    if (yan_change_node) {
      yan_change_node.textContent = `${yan_change >= 0 ? '+' : ''}${yan_change.toFixed(1)}%`;
    }

    if (yan_views_node) {
      yan_views_node.textContent = yan_format_number(yan_report.views);
    }

    if (yan_updated_node) {
      yan_updated_node.textContent = yan_format_datetime(yan_report.updatedAt);
    }

    if (yan_owner_node) {
      yan_owner_node.textContent = yan_report.owner;
    }

    if (yan_category_info_node) {
      yan_category_info_node.textContent = yan_report.category;
    }

    if (yan_created_node) {
      yan_created_node.textContent = yan_format_datetime(yan_report.createdAt);
    }

    if (yan_workflow_link) {
      if (yan_report.workflowId) {
        yan_workflow_link.href = `workflow-detail.html?id=${Number(yan_report.workflowId)}`;
        yan_workflow_link.textContent = yan_report.workflowName || `工作流 ${yan_report.workflowId}`;
      } else {
        yan_workflow_link.removeAttribute('href');
        yan_workflow_link.textContent = '未关联工作流';
      }
    }

    if (yan_workflow_status_node) {
      yan_workflow_status_node.textContent = yan_report.workflowStatus
        ? yan_status_text(yan_report.workflowStatus)
        : '—';
    }
  }

  function yan_build_line_path(yan_points) {
    if (!yan_points.length) {
      return '';
    }

    if (yan_points.length === 1) {
      return `M ${yan_points[0].x} ${yan_points[0].y}`;
    }

    let yan_path = `M ${yan_points[0].x} ${yan_points[0].y}`;

    for (let yan_index = 0; yan_index < yan_points.length - 1; yan_index += 1) {
      const yan_current = yan_points[yan_index];
      const yan_next = yan_points[yan_index + 1];
      const yan_mid_x = (yan_current.x + yan_next.x) / 2;
      yan_path += ` C ${yan_mid_x} ${yan_current.y}, ${yan_mid_x} ${yan_next.y}, ${yan_next.x} ${yan_next.y}`;
    }

    return yan_path;
  }

  function yan_render_chart(yan_report) {
    const yan_chart_container = document.querySelector('[data-yan-chart]');
    const yan_points_container = document.querySelector('[data-yan-data-points]');
    const yan_labels = Array.isArray(yan_report.chartLabels) ? yan_report.chartLabels : [];
    const yan_values = Array.isArray(yan_report.chartValues) ? yan_report.chartValues : [];

    if (!yan_chart_container) {
      return;
    }

    if (!yan_values.length) {
      yan_chart_container.innerHTML = `
        <div class="yan_state-box" style="min-height: 300px; border: 0;">
          <h2 class="yan_state-title">暂无趋势数据</h2>
          <p class="yan_state-text">该报表尚未写入图表数据。</p>
        </div>
      `;

      if (yan_points_container) {
        yan_points_container.innerHTML = '';
      }
      return;
    }

    const yan_width = 760;
    const yan_height = 300;
    const yan_padding = { top: 34, right: 24, bottom: 38, left: 48 };
    const yan_plot_width = yan_width - yan_padding.left - yan_padding.right;
    const yan_plot_height = yan_height - yan_padding.top - yan_padding.bottom;
    const yan_min_value = Math.min(...yan_values);
    const yan_max_value = Math.max(...yan_values);
    const yan_range = Math.max(yan_max_value - yan_min_value, 1);
    const yan_step_x = yan_plot_width / Math.max(yan_values.length - 1, 1);
    const yan_points = yan_values.map((yan_value, yan_index) => {
      const yan_x = yan_padding.left + yan_step_x * yan_index;
      const yan_ratio = (Number(yan_value) - yan_min_value) / yan_range;
      const yan_y = yan_padding.top + yan_plot_height - yan_ratio * yan_plot_height;

      return {
        x: yan_x,
        y: yan_y,
        value: Number(yan_value),
        label: yan_labels[yan_index] || `#${yan_index + 1}`
      };
    });
    const yan_line_path = yan_build_line_path(yan_points);
    const yan_base_y = yan_padding.top + yan_plot_height;
    const yan_area_path = `${yan_line_path} L ${yan_points[yan_points.length - 1].x} ${yan_base_y} L ${yan_points[0].x} ${yan_base_y} Z`;
    const yan_grid_lines = Array.from({ length: 5 }, (_, yan_index) => {
      const yan_ratio = yan_index / 4;
      const yan_y = yan_padding.top + yan_plot_height * yan_ratio;
      const yan_grid_value = yan_max_value - (yan_max_value - yan_min_value) * yan_ratio;

      return `
        <line class="yan_chart-grid-line" x1="${yan_padding.left}" y1="${yan_y}" x2="${yan_width - yan_padding.right}" y2="${yan_y}"></line>
        <text class="yan_chart-value" x="${yan_padding.left - 10}" y="${yan_y + 3}" style="text-anchor: end">${yan_compact_value(yan_grid_value)}</text>
      `;
    }).join('');
    const yan_circles = yan_points.map((yan_point) => `
      <circle class="yan_chart-point" cx="${yan_point.x}" cy="${yan_point.y}" r="4.5">
        <title>${yan_escape_html(yan_point.label)}：${yan_escape_html(yan_format_number(yan_point.value))}</title>
      </circle>
      <text class="yan_chart-value" x="${yan_point.x}" y="${yan_point.y - 12}">${yan_compact_value(yan_point.value)}</text>
      <text class="yan_chart-label" x="${yan_point.x}" y="${yan_height - 12}">${yan_escape_html(yan_point.label)}</text>
    `).join('');

    yan_chart_container.innerHTML = `
      <svg class="yan_chart-svg" viewBox="0 0 ${yan_width} ${yan_height}" role="img" aria-label="${yan_escape_html(yan_report.title)}趋势图">
        <defs>
          <linearGradient id="yan_chart_gradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stop-color="#72e0c2" stop-opacity="0.26"></stop>
            <stop offset="100%" stop-color="#72e0c2" stop-opacity="0"></stop>
          </linearGradient>
        </defs>
        ${yan_grid_lines}
        <path class="yan_chart-area" d="${yan_area_path}"></path>
        <path class="yan_chart-line" d="${yan_line_path}"></path>
        ${yan_circles}
      </svg>
    `;

    if (yan_points_container) {
      yan_points_container.innerHTML = yan_points.map((yan_point) => `
        <span class="yan_data-point">${yan_escape_html(yan_point.label)} <strong>${yan_escape_html(yan_format_number(yan_point.value))}</strong></span>
      `).join('');
    }
  }

  async function yan_load_report() {
    if (!Number.isInteger(yan_report_id) || yan_report_id <= 0) {
      yan_show_error(new Error('报表编号格式不正确'));
      return;
    }

    try {
      const yan_data = await yan_fetch_json(`/api/reports/${yan_report_id}`);
      console.log('[云栖数据工坊] 报表详情：', yan_data);

      yan_render_header(yan_data.report);
      yan_render_chart(yan_data.report);

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

  yan_load_report();
})();
