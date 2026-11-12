<!--
姓名：杨庆鸿 | 学号：24002120509
时间：2026-11-09 | 大模型：DeepSeek V4.1 Flash Free
-->

# 后端接口记录

> 本文件仅追加，不覆盖历史记录。

## 2026-11-09 15:45:00

### 健康检查

- 接口路径：`/api/health`
- HTTP 方法：`GET`
- 请求参数：无
- 请求示例：

```http
GET http://localhost:8509/api/health
```

- 响应格式：

```json
{
  "code": 0,
  "msg": "提示信息",
  "data": {
    "status": "ok",
    "project": {
      "name": "云栖校园服务平台",
      "englishName": "Yunqi Campus Platform",
      "category": "自选",
      "studentName": "杨庆鸿",
      "studentId": "24002120509",
      "version": "1.0.0"
    },
    "runtime": {
      "node": "v24.16.0",
      "platform": "win32",
      "uptimeSeconds": 12
    },
    "timestamp": "2026-11-09T07:45:00.000Z"
  }
}
```

- 响应示例：

```json
{
  "code": 0,
  "msg": "服务运行正常",
  "data": {
    "status": "ok",
    "project": {
      "name": "云栖校园服务平台",
      "englishName": "Yunqi Campus Platform",
      "category": "自选",
      "studentName": "杨庆鸿",
      "studentId": "24002120509",
      "version": "1.0.0"
    },
    "runtime": {
      "node": "v24.16.0",
      "platform": "win32",
      "uptimeSeconds": 12
    },
    "timestamp": "2026-11-09T07:45:00.000Z"
  }
}
```

- 修改时间：2026-11-09 15:45:00

## 2026-11-09 16:30:00 | 数据分析报表工作流平台接口

### 工作台概览

- 接口路径：`/api/dashboard`
- HTTP 方法：`GET`
- 请求参数：无
- 请求示例：

```http
GET http://localhost:8509/api/dashboard
```

- 响应格式：

```json
{
  "code": 0,
  "msg": "工作台数据获取成功",
  "data": {
    "project": {
      "name": "云栖数据工坊",
      "tagline": "数据分析报表工作流平台",
      "englishName": "Yunqi Data Studio",
      "category": "自选",
      "studentName": "杨庆鸿",
      "studentId": "24002120509",
      "version": "2.0.0"
    },
    "stats": {
      "dataSources": 8,
      "activeWorkflows": 5,
      "publishedReports": 7,
      "totalRuns": 12,
      "todayRuns": 6,
      "rowsProcessed": 129420,
      "successRate": 91.7
    },
    "weeklyOutput": [
      { "label": "11-08", "value": 1 },
      { "label": "11-09", "value": 3 }
    ],
    "categoryDistribution": [
      { "category": "经营分析", "count": 2 },
      { "category": "运营监控", "count": 2 }
    ],
    "recentRuns": [
      {
        "id": 12,
        "workflowId": 1,
        "workflowName": "每日经营日报",
        "status": "success",
        "durationSeconds": 145,
        "rowsProcessed": 18920,
        "triggerType": "manual",
        "startedAt": "2026-11-09 14:20:10"
      }
    ],
    "latestReports": [
      {
        "id": 10,
        "title": "促销活动异常监控",
        "category": "风险预警",
        "status": "review",
        "owner": "杨庆鸿",
        "views": 31,
        "updatedAt": "2026-11-09 09:40:00"
      }
    ]
  }
}
```

- 修改时间：2026-11-09 16:30:00

### 工作流列表

- 接口路径：`/api/workflows`
- HTTP 方法：`GET`
- 请求参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `status` | string | 否 | 可选值：`active`、`paused`、`draft` |

- 请求示例：

```http
GET http://localhost:8509/api/workflows?status=active
```

- 响应格式：

```json
{
  "code": 0,
  "msg": "工作流列表获取成功",
  "data": {
    "workflows": [
      {
        "id": 1,
        "name": "每日经营日报",
        "description": "汇聚交易与用户数据，生成面向管理层的经营日报",
        "owner": "杨庆鸿",
        "status": "active",
        "schedule": "每天 08:30",
        "lastRunAt": "2026-11-09 14:22:35",
        "successRate": 98.6,
        "stepCount": 4,
        "createdAt": "2026-10-08 09:30:00",
        "updatedAt": "2026-11-09 14:22:35"
      }
    ]
  }
}
```

- 修改时间：2026-11-09 16:30:00

### 工作流详情

- 接口路径：`/api/workflows/:id`
- HTTP 方法：`GET`
- 请求参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | number | 是 | 工作流 ID，需为正整数 |

- 请求示例：

```http
GET http://localhost:8509/api/workflows/1
```

- 响应格式：

```json
{
  "code": 0,
  "msg": "工作流详情获取成功",
  "data": {
    "workflow": {
      "id": 1,
      "name": "每日经营日报",
      "description": "汇聚交易与用户数据，生成面向管理层的经营日报",
      "owner": "杨庆鸿",
      "status": "active",
      "schedule": "每天 08:30",
      "lastRunAt": "2026-11-09 14:22:35",
      "successRate": 98.6,
      "stepCount": 4,
      "createdAt": "2026-10-08 09:30:00",
      "updatedAt": "2026-11-09 14:22:35"
    },
    "steps": [
      {
        "id": 1,
        "order": 1,
        "name": "抽取交易明细",
        "type": "extract",
        "configSummary": "增量读取订单、支付、退款三表",
        "status": "ready"
      }
    ],
    "runs": [
      {
        "id": 12,
        "workflowId": 1,
        "workflowName": "每日经营日报",
        "status": "success",
        "durationSeconds": 145,
        "rowsProcessed": 18920,
        "triggerType": "manual",
        "startedAt": "2026-11-09 14:20:10",
        "finishedAt": "2026-11-09 14:22:35"
      }
    ]
  }
}
```

- 响应示例（工作流不存在，HTTP 404）：

```json
{
  "code": 404,
  "msg": "工作流不存在",
  "data": {}
}
```

- 修改时间：2026-11-09 16:30:00

### 手动运行工作流

- 接口路径：`/api/workflows/:id/runs`
- HTTP 方法：`POST`
- 请求参数：无请求体；`id` 为工作流 ID。
- 请求示例：

```http
POST http://localhost:8509/api/workflows/1/runs
```

- 响应格式：

```json
{
  "code": 0,
  "msg": "工作流执行成功",
  "data": {
    "run": {
      "id": 13,
      "workflowId": 1,
      "workflowName": "每日经营日报",
      "status": "success",
      "durationSeconds": 81,
      "rowsProcessed": 7612,
      "triggerType": "manual",
      "startedAt": "2026-11-09 16:15:02",
      "finishedAt": "2026-11-09 16:16:23"
    },
    "workflow": {
      "id": 1,
      "name": "每日经营日报",
      "description": "汇聚交易与用户数据，生成面向管理层的经营日报",
      "owner": "杨庆鸿",
      "status": "active",
      "schedule": "每天 08:30",
      "lastRunAt": "2026-11-09 16:15:02",
      "successRate": 100,
      "stepCount": 4,
      "createdAt": "2026-10-08 09:30:00",
      "updatedAt": "2026-11-09 16:15:02"
    }
  }
}
```

- 响应示例（非运行中状态，HTTP 409）：

```json
{
  "code": 409,
  "msg": "仅运行中的工作流可以手动执行",
  "data": {}
}
```

- 修改时间：2026-11-09 16:30:00

### 报表列表

- 接口路径：`/api/reports`
- HTTP 方法：`GET`
- 请求参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `category` | string | 否 | 报表分类，例如 `经营分析` |
| `status` | string | 否 | 可选值：`published`、`review`、`draft` |

- 请求示例：

```http
GET http://localhost:8509/api/reports?category=经营分析&status=published
```

- 响应格式：

```json
{
  "code": 0,
  "msg": "报表列表获取成功",
  "data": {
    "reports": [
      {
        "id": 1,
        "workflowId": 1,
        "workflowName": "每日经营日报",
        "workflowStatus": "active",
        "title": "2026年11月经营日报",
        "category": "经营分析",
        "summary": "全渠道 GMV 连续三日回升，华东区域贡献最高，退款率保持在健康区间。",
        "status": "published",
        "owner": "杨庆鸿",
        "views": 128,
        "chartLabels": ["11-03", "11-04", "11-05", "11-06", "11-07", "11-08", "11-09"],
        "chartValues": [82.4, 86.1, 79.8, 91.2, 94.7, 88.5, 96.3],
        "chartChange": 16.9,
        "createdAt": "2026-11-09 08:35:00",
        "updatedAt": "2026-11-09 08:35:00"
      }
    ]
  }
}
```

- 修改时间：2026-11-09 16:30:00

### 报表详情

- 接口路径：`/api/reports/:id`
- HTTP 方法：`GET`
- 请求参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | number | 是 | 报表 ID，需为正整数 |

- 请求示例：

```http
GET http://localhost:8509/api/reports/1
```

- 响应格式：

```json
{
  "code": 0,
  "msg": "报表详情获取成功",
  "data": {
    "report": {
      "id": 1,
      "workflowId": 1,
      "workflowName": "每日经营日报",
      "workflowStatus": "active",
      "title": "2026年11月经营日报",
      "category": "经营分析",
      "summary": "全渠道 GMV 连续三日回升，华东区域贡献最高，退款率保持在健康区间。",
      "status": "published",
      "owner": "杨庆鸿",
      "views": 128,
      "chartLabels": ["11-03", "11-04", "11-05", "11-06", "11-07", "11-08", "11-09"],
      "chartValues": [82.4, 86.1, 79.8, 91.2, 94.7, 88.5, 96.3],
      "chartChange": 16.9,
      "createdAt": "2026-11-09 08:35:00",
      "updatedAt": "2026-11-09 08:35:00"
    }
  }
}
```

- 修改时间：2026-11-09 16:30:00

### 数据源列表

- 接口路径：`/api/data-sources`
- HTTP 方法：`GET`
- 请求参数：无
- 请求示例：

```http
GET http://localhost:8509/api/data-sources
```

- 响应格式：

```json
{
  "code": 0,
  "msg": "数据源列表获取成功",
  "data": {
    "sources": [
      {
        "id": 1,
        "name": "交易主库",
        "type": "MySQL",
        "host": "10.20.1.12:3306",
        "description": "订单、支付与退款明细",
        "status": "connected",
        "recordCount": 1284600,
        "lastSyncedAt": "2026-11-09 08:25:00",
        "createdAt": "2026-10-08 09:10:00"
      }
    ],
    "summary": {
      "total": 8,
      "connected": 6,
      "syncing": 1,
      "error": 1,
      "totalRecords": 2569246
    }
  }
}
```

- 修改时间：2026-11-09 16:30:00

### 健康检查信息更新

- 接口路径：`/api/health`
- HTTP 方法：`GET`
- 说明：项目信息已更新为「云栖数据工坊」，版本号 `2.0.0`，接口结构与响应格式保持不变。
- 修改时间：2026-11-09 16:30:00

### 数据库连接测试接口说明

- 接口路径：`/api/database/test`
- HTTP 方法：`GET`
- 请求参数：无
- 请求示例：

```http
GET http://localhost:8509/api/database/test
```

- 响应格式：

```json
{
  "code": 0,
  "msg": "数据库连接测试接口说明",
  "data": {
    "method": "POST",
    "path": "/api/database/test",
    "contentType": "application/json",
    "fields": {
      "username": "MySQL 用户名，例如 root",
      "password": "MySQL 密码，仅用于本次连接测试"
    },
    "note": "该接口使用 backend/.env 中的 DB_HOST 与 DB_NAME，用户名和密码由请求体传入。"
  }
}
```

- 修改时间：2026-11-09 16:48:00

### 数据库连接测试

- 接口路径：`/api/database/test`
- HTTP 方法：`POST`
- 请求参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `username` | string | 是 | MySQL 用户名，最长 64 个字符 |
| `password` | string | 是 | MySQL 密码，最长 128 个字符 |

- 请求示例：

```http
POST http://localhost:8509/api/database/test
Content-Type: application/json

{
  "username": "root",
  "password": "123456"
}
```

- 成功响应：

```json
{
  "code": 0,
  "msg": "数据库连接成功",
  "data": {
    "host": "127.0.0.1",
    "database": "yan_report_platform",
    "username": "root",
    "serverVersion": "8.0.40",
    "currentTime": "2026-11-09 16:48:00"
  }
}
```

- 失败响应（账号或密码错误，HTTP 401）：

```json
{
  "code": 401,
  "msg": "用户名或密码不正确，无法连接 MySQL",
  "data": {
    "reason": "ER_ACCESS_DENIED_ERROR"
  }
}
```

- 其他错误状态：用户名或密码格式不合法返回 400，数据库不存在返回 404，MySQL 服务不可用返回 503，连接超时返回 504。
- 说明：后端使用 `mysql2` 建立短连接，连接成功后立即关闭；密码不会写入数据库或日志。
- 修改时间：2026-11-09 16:48:00

### 科技新闻列表

- 接口路径：`/api/tech-news`
- HTTP 方法：`GET`
- 请求参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `category` | string | 否 | 按新闻分类筛选，例如 `人工智能` |

- 请求示例：

```http
GET http://localhost:8509/api/tech-news
GET http://localhost:8509/api/tech-news?category=人工智能
```

- 响应格式：

```json
{
  "code": 0,
  "msg": "科技新闻列表获取成功",
  "data": {
    "news": [
      {
        "id": 1,
        "title": "开源推理框架发布 2.0，支持多模态批处理",
        "summary": "新版本重构了调度内核，在多模态输入与长上下文场景下提升了吞吐，并补充了细粒度显存监控。",
        "source": "InfoQ",
        "category": "人工智能",
        "author": "林澈",
        "publishedAt": "2026-11-09 09:20:00",
        "readCount": 3820,
        "url": "https://www.infoq.cn"
      }
    ],
    "summary": {
      "total": 12,
      "categoryCount": 6,
      "sourceCount": 4,
      "latestPublishedAt": "2026-11-09 09:20:00"
    }
  }
}
```

- 数据来源：MySQL 表 `yan_tech_news`。
- 修改时间：2026-11-09 16:48:00

### 文件列表

- 接口路径：`/api/uploads`
- HTTP 方法：`GET`
- 请求参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `category` | string | 否 | 按分类筛选，可选值：`数据集`、`报表`、`日志`、`文档`、`图片`、`其他` |

- 请求示例：

```http
GET http://localhost:8509/api/uploads
GET http://localhost:8509/api/uploads?category=数据集
```

- 响应格式：

```json
{
  "code": 0,
  "msg": "文件列表获取成功",
  "data": {
    "uploads": [
      {
        "id": 1,
        "originalName": "yan_sales_channels_2026_11.csv",
        "extension": "csv",
        "mimeType": "text/csv",
        "sizeBytes": 543,
        "category": "数据集",
        "description": "11 月各渠道订单、成交额与退款率样例数据",
        "uploader": "杨庆鸿",
        "isSeed": true,
        "uploadedAt": "2026-11-12 08:05:00",
        "downloadUrl": "/uploads/seed/yan_sales_channels_2026_11.csv"
      }
    ],
    "summary": {
      "total": 8,
      "totalSizeBytes": 5777,
      "seedCount": 8,
      "categoryCount": 4,
      "latestUploadedAt": "2026-11-12 08:05:00",
      "categories": [
        { "category": "数据集", "count": 3 },
        { "category": "报表", "count": 2 },
        { "category": "文档", "count": 2 },
        { "category": "日志", "count": 1 }
      ]
    }
  }
}
```

- 修改时间：2026-11-12 15:50:00

### 文件上传

- 接口路径：`/api/uploads`
- HTTP 方法：`POST`
- 请求格式：`multipart/form-data`
- 请求参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `file` | file | 是 | 单个文件，最大 10 MB |
| `category` | string | 否 | 文件分类；不传时根据扩展名自动识别 |
| `description` | string | 否 | 文件说明，最长 200 个字符 |

- 支持扩展名：`CSV`、`JSON`、`TXT`、`LOG`、`MD`、`XLS`、`XLSX`、`PDF`、`PNG`、`JPG`、`JPEG`。
- 请求示例：

```http
POST http://localhost:8509/api/uploads
Content-Type: multipart/form-data; boundary=----YanBoundary

------YanBoundary
Content-Disposition: form-data; name="file"; filename="sales.csv"
Content-Type: text/csv

yan_date,yan_gmv
2026-11-12,128400
------YanBoundary
Content-Disposition: form-data; name="category"

数据集
------YanBoundary
Content-Disposition: form-data; name="description"

11 月销售明细
------YanBoundary--
```

- 成功响应（HTTP 201）：

```json
{
  "code": 0,
  "msg": "文件上传成功",
  "data": {
    "upload": {
      "id": 9,
      "originalName": "sales.csv",
      "extension": "csv",
      "mimeType": "text/csv",
      "sizeBytes": 42,
      "category": "数据集",
      "description": "11 月销售明细",
      "uploader": "杨庆鸿",
      "isSeed": false,
      "uploadedAt": "2026-11-12 15:50:00",
      "downloadUrl": "/uploads/runtime/yan_20261112155000_0123456789abcdef.csv"
    }
  }
}
```

- 失败响应：

```json
{
  "code": 413,
  "msg": "文件大小不能超过 10 MB",
  "data": {
    "reason": "LIMIT_FILE_SIZE"
  }
}
```

- 其他错误：未选择文件、文件类型不支持、分类非法、文件名为空等返回 400，超过大小限制返回 413。
- 文件存储路径：`backend/uploads/runtime/`；元数据写入表 `yan_uploads`。
- 修改时间：2026-11-12 15:50:00

### 删除文件

- 接口路径：`/api/uploads/:id`
- HTTP 方法：`DELETE`
- 请求参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | number | 是 | 文件编号，路径参数 |

- 请求示例：

```http
DELETE http://localhost:8509/api/uploads/9
```

- 成功响应：

```json
{
  "code": 0,
  "msg": "文件已删除",
  "data": {
    "id": 9,
    "originalName": "sales.csv"
  }
}
```

- 内置示例文件删除受限（HTTP 409）：

```json
{
  "code": 409,
  "msg": "内置示例文件不可删除",
  "data": {
    "id": 1
  }
}
```

- 文件不存在返回 404，编号格式错误返回 400。
- 修改时间：2026-11-12 15:50:00

### AI 对话接口说明

- 接口路径：`/api/chat`
- HTTP 方法：`GET`
- 请求参数：无
- 请求示例：

```http
GET http://localhost:8509/api/chat
```

- 响应格式：

```json
{
  "code": 0,
  "msg": "AI 对话接口说明",
  "data": {
    "method": "POST",
    "path": "/api/chat",
    "provider": "DeepSeek",
    "model": "deepseek-flash",
    "stream": false,
    "messageLimit": 20,
    "contentLimit": 4000,
    "keyConfigured": true
  }
}
```

- 说明：`keyConfigured` 只表示后端环境变量中是否配置了密钥，不返回密钥内容，也不代表密钥一定有效。
- 修改时间：2026-11-12 16:20:00

### AI 对话

- 接口路径：`/api/chat`
- HTTP 方法：`POST`
- 请求格式：`application/json`
- 请求参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `messages` | array | 是 | 对话消息数组，最多 20 条，最后一条必须为 `user` |
| `messages[].role` | string | 是 | 仅允许 `user` 或 `assistant` |
| `messages[].content` | string | 是 | 消息内容，单条最多 4000 个字符 |

- 后端环境变量：

```dotenv
AI_API_KEY=你的 AI 服务 API Key
AI_API_URL=https://api.deepseek.com/chat/completions
AI_MODEL=deepseek-flash
```

- 请求示例：

```json
{
  "messages": [
    {
      "role": "user",
      "content": "你好，请用一句话介绍你自己。"
    }
  ]
}
```

- 成功响应：

```json
{
  "code": 0,
  "msg": "AI 回复成功",
  "data": {
    "reply": "我是云栖数据工坊的 AI 助手，可以帮你分析数据、编写 SQL 和优化前端页面。",
    "model": "deepseek-flash",
    "finishReason": "stop",
    "usage": {
      "promptTokens": 86,
      "completionTokens": 42,
      "totalTokens": 128
    }
  }
}
```

- 上游鉴权失败响应（AI 服务返回 401/403，后端映射为 502）：

```json
{
  "code": 502,
  "msg": "AI 服务鉴权失败，请检查后端 API Key 配置",
  "data": {
    "reason": "YAN_AI_UPSTREAM_ERROR",
    "upstreamStatus": 401
  }
}
```

- 其他错误：消息格式错误返回 400；请求过于频繁返回 429；未配置密钥或网络不可用返回 503；上游超时返回 504。
- 安全说明：API Key 仅从 `backend/.env` 读取，不写入前端代码、不返回给浏览器、不记录到日志。
- 修改时间：2026-11-12 16:20:00

### AI 服务配置调整

- 调整时间：2026-11-12 16:20:00
- 环境变量统一为 `AI_API_KEY`、`AI_API_URL`、`AI_MODEL`，同时兼容旧的 `SILICONFLOW_*` 变量名。
- 当前配置：DeepSeek 官方接口 `https://api.deepseek.com/chat/completions`，模型 `deepseek-flash`。
- `GET /api/chat` 的 `data` 新增 `provider` 字段，用于前端展示当前服务商。
- 该接口仍保持 OpenAI Chat Completions 兼容协议，只要目标服务兼容该协议，即可通过修改环境变量切换。
