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
