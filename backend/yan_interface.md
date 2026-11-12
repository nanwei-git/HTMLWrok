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
