// 姓名：杨庆鸿 | 学号：24002120509
// 时间：2026-11-09 | 大模型：DeepSeek V4.1 Flash Free

(function yan_initialize_sources() {
  'use strict';

  const yan_grid = document.querySelector('[data-yan-source-grid]');
  const yan_error_box = document.querySelector('[data-yan-error]');
  const yan_error_text = document.querySelector('[data-yan-error-text]');

  function yan_render_summary(yan_summary) {
    const yan_total_node = document.querySelector('[data-yan-source-total]');
    const yan_connected_node = document.querySelector('[data-yan-source-connected]');
    const yan_syncing_node = document.querySelector('[data-yan-source-syncing]');
    const yan_error_node = document.querySelector('[data-yan-source-error]');
    const yan_records_node = document.querySelector('[data-yan-source-records]');

    if (yan_total_node) {
      yan_total_node.textContent = String(yan_summary.total);
    }

    if (yan_connected_node) {
      yan_connected_node.textContent = String(yan_summary.connected);
    }

    if (yan_syncing_node) {
      yan_syncing_node.textContent = String(yan_summary.syncing);
    }

    if (yan_error_node) {
      yan_error_node.textContent = String(yan_summary.error);
    }

    if (yan_records_node) {
      yan_records_node.textContent = yan_format_number(yan_summary.totalRecords);
    }
  }

  function yan_source_card(yan_source) {
    return `
      <article class="yan_source-card">
        <div class="yan_source-top">
          <span class="yan_source-type">${yan_escape_html(yan_source.type)}</span>
          <span class="${yan_status_class(yan_source.status)}">${yan_escape_html(yan_status_text(yan_source.status))}</span>
        </div>
        <h2 class="yan_source-name">${yan_escape_html(yan_source.name)}</h2>
        <p class="yan_source-host" title="${yan_escape_html(yan_source.host)}">${yan_escape_html(yan_source.host)}</p>
        <p class="yan_source-desc">${yan_escape_html(yan_source.description)}</p>
        <div class="yan_source-footer">
          <span class="yan_source-records"><strong>${yan_format_number(yan_source.recordCount)}</strong> 条记录</span>
          <span>同步于 ${yan_escape_html(yan_format_short_datetime(yan_source.lastSyncedAt))}</span>
        </div>
      </article>
    `;
  }

  function yan_render_sources(yan_sources) {
    if (!yan_grid) {
      return;
    }

    if (!yan_sources.length) {
      yan_grid.innerHTML = `
        <div class="yan_state-box" style="grid-column: 1 / -1;">
          <span class="yan_state-icon" aria-hidden="true">◇</span>
          <h2 class="yan_state-title">还没有接入数据源</h2>
          <p class="yan_state-text">接入第一个数据源后，工作流即可读取并处理业务数据。</p>
        </div>
      `;
      return;
    }

    yan_grid.innerHTML = yan_sources.map(yan_source_card).join('');
  }

  function yan_show_error(yan_error) {
    console.error('[云栖数据工坊] 数据源列表加载失败：', yan_error);

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

  async function yan_load_sources() {
    try {
      const yan_data = await yan_fetch_json('/api/data-sources');
      console.log('[云栖数据工坊] 数据源列表：', yan_data);

      yan_render_summary(yan_data.summary);
      yan_render_sources(Array.isArray(yan_data.sources) ? yan_data.sources : []);

      if (yan_error_box) {
        yan_error_box.hidden = true;
      }
    } catch (yan_error) {
      yan_show_error(yan_error);
    }
  }

  yan_load_sources();
})();
