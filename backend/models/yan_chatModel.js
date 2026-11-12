// 姓名：杨庆鸿 | 学号：24002120509
// 时间：2026-11-12 | 大模型：DeepSeek V4.1 Flash Free

const { yan_ai_settings } = require('../config/yan_ai');

function yan_extract_content(yan_message) {
  if (!yan_message || yan_message.content === undefined || yan_message.content === null) {
    return '';
  }

  if (typeof yan_message.content === 'string') {
    return yan_message.content.trim();
  }

  if (Array.isArray(yan_message.content)) {
    return yan_message.content
      .map((yan_part) => {
        if (typeof yan_part === 'string') {
          return yan_part;
        }

        return yan_part && typeof yan_part.text === 'string' ? yan_part.text : '';
      })
      .join('')
      .trim();
  }

  return '';
}

async function yan_request_chat_completion(yan_messages) {
  if (!yan_ai_settings.apiKey) {
    const yan_error = new Error('AI 服务尚未配置 API Key');
    yan_error.code = 'YAN_AI_KEY_MISSING';
    throw yan_error;
  }

  const yan_controller = new AbortController();
  const yan_timeout = setTimeout(() => yan_controller.abort(), yan_ai_settings.timeoutMs);

  try {
    const yan_response = await fetch(yan_ai_settings.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${yan_ai_settings.apiKey}`
      },
      body: JSON.stringify({
        model: yan_ai_settings.model,
        messages: [
          {
            role: 'system',
            content: yan_ai_settings.systemPrompt
          },
          ...yan_messages
        ],
        stream: false,
        temperature: 0.7,
        max_tokens: 1500
      }),
      signal: yan_controller.signal
    });

    const yan_response_text = await yan_response.text();
    let yan_payload = null;

    try {
      yan_payload = yan_response_text ? JSON.parse(yan_response_text) : null;
    } catch (yan_parse_error) {
      console.error('[AI 对话] AI 服务响应无法解析为 JSON：', yan_parse_error);
    }

    if (!yan_response.ok) {
      const yan_upstream_error = new Error(
        (yan_payload && (yan_payload.message || yan_payload.error?.message)) ||
        `AI 服务返回 HTTP ${yan_response.status}`
      );
      yan_upstream_error.code = 'YAN_AI_UPSTREAM_ERROR';
      yan_upstream_error.upstreamStatus = yan_response.status;
      yan_upstream_error.providerCode = yan_payload && yan_payload.code ? yan_payload.code : null;
      throw yan_upstream_error;
    }

    const yan_choice = yan_payload && Array.isArray(yan_payload.choices)
      ? yan_payload.choices[0]
      : null;
    const yan_reply = yan_extract_content(yan_choice && yan_choice.message);

    if (!yan_reply) {
      const yan_empty_error = new Error('AI 服务返回了空回复');
      yan_empty_error.code = 'YAN_AI_EMPTY_RESPONSE';
      throw yan_empty_error;
    }

    return {
      reply: yan_reply,
      model: (yan_payload && yan_payload.model) || yan_ai_settings.model,
      finishReason: (yan_choice && yan_choice.finish_reason) || null,
      usage: yan_payload && yan_payload.usage
        ? {
            promptTokens: Number(yan_payload.usage.prompt_tokens) || 0,
            completionTokens: Number(yan_payload.usage.completion_tokens) || 0,
            totalTokens: Number(yan_payload.usage.total_tokens) || 0
          }
        : null
    };
  } catch (yan_error) {
    if (yan_error.code === 'YAN_AI_UPSTREAM_ERROR' || yan_error.code === 'YAN_AI_EMPTY_RESPONSE') {
      throw yan_error;
    }

    if (yan_error.name === 'AbortError') {
      const yan_timeout_error = new Error('AI 服务响应超时');
      yan_timeout_error.code = 'YAN_AI_TIMEOUT';
      throw yan_timeout_error;
    }

    const yan_network_error = new Error('无法连接 AI 服务');
    yan_network_error.code = 'YAN_AI_NETWORK_ERROR';
    yan_network_error.cause = yan_error;
    throw yan_network_error;
  } finally {
    clearTimeout(yan_timeout);
  }
}

module.exports = {
  yan_request_chat_completion
};
