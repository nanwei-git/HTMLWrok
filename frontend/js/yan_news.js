// 姓名：杨庆鸿 | 学号：24002120509
// 时间：2026-11-09 | 大模型：DeepSeek V4.1 Flash Free

(function yan_initialize_tech_news() {
  'use strict';

  const yan_list = document.querySelector('[data-yan-news-list]');
  const yan_filters = document.querySelector('[data-yan-news-filters]');
  const yan_error_box = document.querySelector('[data-yan-error]');
  const yan_error_text = document.querySelector('[data-yan-error-text]');
  const yan_json_output = document.querySelector('[data-yan-news-json]');
  const yan_api_link = document.querySelector('[data-yan-news-api]');
  const yan_state = {
    yan_news: [],
    yan_category: 'all'
  };

  if (yan_api_link) {
    yan_api_link.href = `${window.location.origin}/api/tech-news`;
    yan_api_link.textContent = `${window.location.origin}/api/tech-news`;
  }

  function yan_safe_news_url(yan_url) {
    try {
      const yan_parsed = new URL(yan_url);

      if (yan_parsed.protocol === 'http:' || yan_parsed.protocol === 'https:') {
        return yan_parsed.href;
      }
    } catch (yan_error) {
      console.error('[云栖数据工坊] 新闻链接格式不正确：', yan_url, yan_error);
    }

    return '#';
  }

  function yan_news_date(yan_datetime) {
    const yan_text = String(yan_datetime || '');
    const yan_date = yan_text.slice(0, 10);

    if (yan_date.length !== 10) {
      return {
        yan_day: '--',
        yan_year: '----'
      };
    }

    return {
      yan_day: yan_date.slice(5),
      yan_year: yan_date.slice(0, 4)
    };
  }

  function yan_render_summary(yan_summary) {
    const yan_total_node = document.querySelector('[data-yan-news-total]');
    const yan_category_node = document.querySelector('[data-yan-news-category-count]');
    const yan_source_node = document.querySelector('[data-yan-news-source-count]');
    const yan_latest_node = document.querySelector('[data-yan-news-latest]');

    if (yan_total_node) {
      yan_total_node.textContent = String(yan_summary.total);
    }

    if (yan_category_node) {
      yan_category_node.textContent = String(yan_summary.categoryCount);
    }

    if (yan_source_node) {
      yan_source_node.textContent = String(yan_summary.sourceCount);
    }

    if (yan_latest_node) {
      yan_latest_node.textContent = yan_format_short_datetime(yan_summary.latestPublishedAt);
    }
  }

  function yan_render_filters() {
    if (!yan_filters) {
      return;
    }

    const yan_categories = [...new Set(yan_state.yan_news.map((yan_item) => yan_item.category))];

    yan_filters.innerHTML = [
      '<button class="yan_filter yan_filter--active" type="button" data-yan-news-category="all">全部分类</button>',
      ...yan_categories.map((yan_category) => {
        const yan_count = yan_state.yan_news.filter((yan_item) => yan_item.category === yan_category).length;
        return `<button class="yan_filter" type="button" data-yan-news-category="${yan_escape_html(yan_category)}">${yan_escape_html(yan_category)} ${yan_count}</button>`;
      })
    ].join('');

    yan_filters.querySelectorAll('[data-yan-news-category]').forEach((yan_button) => {
      yan_button.addEventListener('click', () => {
        yan_state.yan_category = yan_button.dataset.yanNewsCategory;

        yan_filters.querySelectorAll('[data-yan-news-category]').forEach((yan_item) => {
          yan_item.classList.toggle('yan_filter--active', yan_item === yan_button);
        });

        yan_render_news();
      });
    });
  }

  function yan_news_item(yan_news, yan_index) {
    const yan_date = yan_news_date(yan_news.publishedAt);
    const yan_url = yan_safe_news_url(yan_news.url);

    return `
      <article class="yan_news-item">
        <div class="yan_news-date">
          <strong>${yan_escape_html(yan_date.yan_day)}</strong>
          <span>${yan_escape_html(yan_date.yan_year)}</span>
        </div>
        <div class="yan_news-body">
          <div class="yan_news-top">
            <span class="yan_news-category">${yan_escape_html(yan_news.category)}</span>
            <span class="yan_news-source">${yan_escape_html(yan_news.source)}</span>
          </div>
          <h2 class="yan_news-title">
            <a href="${yan_escape_html(yan_url)}" target="_blank" rel="noopener">${yan_escape_html(yan_news.title)}</a>
          </h2>
          <p class="yan_news-summary">${yan_escape_html(yan_news.summary)}</p>
          <div class="yan_news-meta">
            <span>作者 ${yan_escape_html(yan_news.author)}</span>
            <span>${yan_format_number(yan_news.readCount)} 次阅读</span>
            <span>${yan_escape_html(yan_format_datetime(yan_news.publishedAt))}</span>
          </div>
        </div>
        <span class="yan_news-index" aria-hidden="true">${String(yan_index + 1).padStart(2, '0')}</span>
      </article>
    `;
  }

  function yan_render_news() {
    if (!yan_list) {
      return;
    }

    const yan_visible = yan_state.yan_category === 'all'
      ? yan_state.yan_news
      : yan_state.yan_news.filter((yan_item) => yan_item.category === yan_state.yan_category);

    if (!yan_visible.length) {
      yan_list.innerHTML = `
        <div class="yan_state-box" style="margin: 18px 0; border: 0;">
          <span class="yan_state-icon" aria-hidden="true">◇</span>
          <h2 class="yan_state-title">当前分类下没有新闻</h2>
          <p class="yan_state-text">切换分类查看其他科技新闻。</p>
        </div>
      `;
      return;
    }

    yan_list.innerHTML = yan_visible.map(yan_news_item).join('');
  }

  async function yan_load_news() {
    try {
      const yan_data = await yan_fetch_json('/api/tech-news');
      console.log('[云栖数据工坊] 科技新闻数据：', yan_data);

      yan_state.yan_news = Array.isArray(yan_data.news) ? yan_data.news : [];
      yan_render_summary(yan_data.summary);
      yan_render_filters();
      yan_render_news();

      if (yan_json_output) {
        yan_json_output.textContent = JSON.stringify({
          code: 0,
          msg: '科技新闻列表获取成功',
          data: yan_data
        }, null, 2);
      }

      if (yan_error_box) {
        yan_error_box.hidden = true;
      }
    } catch (yan_error) {
      console.error('[云栖数据工坊] 科技新闻加载失败：', yan_error);

      if (yan_error_box) {
        yan_error_box.hidden = false;
      }

      if (yan_error_text) {
        yan_error_text.textContent = `${yan_error.message}。请确认后端服务已启动，并检查浏览器控制台。`;
      }

      if (yan_list) {
        yan_list.innerHTML = '';
      }

      if (yan_json_output) {
        yan_json_output.textContent = JSON.stringify(yan_error.payload || {
          code: yan_error.status || 500,
          msg: yan_error.message,
          data: {}
        }, null, 2);
      }
    }
  }

  yan_load_news();
})();
