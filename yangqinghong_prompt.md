<!--
姓名：杨庆鸿 | 学号：24002120509
时间：2026-11-09 | 大模型：DeepSeek V4.1 Flash Free
-->

# AI 开发指令记录

> 本文件仅追加，不覆盖历史记录。

## 2026-11-09 15:36:37 | DeepSeek V4.1 Flash Free

### 提示词全文

> 数据库用户名和密码已按项目安全规则脱敏；真实凭据仅允许存放在 `backend/.env`。

```text
在当前项目根目录创建 AGENTS.md，写入以下规则。

## 项目结构与技术栈
- 前端：frontend/ 目录
  - 原生 HTML、CSS、JavaScript，禁止使用任何第三方库、框架、CDN 链接
  - 目录结构：frontend/ 下建 css/、js/、fonts/、images/ 子目录；
    fonts/ 存放 iconfont 图标文件（如果有）
- 后端：backend/ 目录，Node.js + Express，RESTful+MVC 风格，
  所有接口以 /api/ 为前缀，端口固定为 8509，
  并以 express.static 托管 frontend/ 目录
  后端支持所有跨域访问。
- 后端依赖安装：优先 cnpm i 包名；失败或超时则使用 npm i 包名
- 数据库：MySQL （用户名：[已脱敏]、密码：[已脱敏]）- 数据库凭据写入 backend/.env（变量名：DB_USER、DB_PASSWORD、
  DB_HOST、DB_NAME），不得出现在代码或 AGENTS.md 中；
  .env 同时加入 .gitignore
- 根据后端的要求自行建立和修改数据库表，每张表建立后，插入至少 8 条有真实业务意义的测试数据

## 命名与注释
- CSS 类名、JS 变量名、JS 函数名、数据库表名（及字段相关命名）
  一律以 yan_ 开头
- 每个文件头部包含注释块：
  姓名：杨庆鸿 | 学号：24002120509|
  时间：yyyy-mm-dd | 大模型：{本次使用的大模型名称}

## 记录文件（一律追加写入，禁止覆盖已有内容）
- yangqinghong_prompt.md（项目根目录）：每次向 AI 发出开发指令后，
  追加记录：时间 | 提示词全文 | 大模型名称
- backend/yan_interface.md：每次创建或修改接口后，追加：
  接口路径 | HTTP 方法 | 请求参数（含示例）|
  响应格式（含 JSON 示例）| 修改时间
- backend/yan_database.md：每次建表、改表或插入数据后，
  按执行顺序追加对应 SQL 语句（含测试数据的 INSERT），
  要求仅凭此文件即可在新机器上完整重建数据库
- 统一 JSON 响应格式：{ "code": 0, "msg": "提示信息", "data": {...} }，
  code=0 表示成功，非 0 表示失败
## 前端约定
- 服务器返回的数据和错误信息输出到浏览器控制台（console.log /
  console.error）；
- 新建 HTML 页面后，在 frontend/index.html 中追加超链接入口；
  文件名包含 detail 的页面除外
```

## 2026-11-09 15:40:30 | DeepSeek V4.1 Flash Free

### 提示词全文

```text
请初始化本项目:
1、git init +.gitignore(除 node_modules、.env)+首次提交
2、按AGENTS.md规则创建前后端目录骨架、安装依赖、 3、创建前端首页index.html，包括姓名*、学号*、项目名称、项目类别(自选、模仿)，所有完成的html页面的超
链接。有canvas背景动画。主体是页面链接导航。页面美观。4、创建readme.md，在根目录下，包括学号、姓名。
```

## 2026-11-09 16:03:57 | DeepSeek V4.1 Flash Free

### 提示词全文

```text
做成数据分析报表工作流平台
```

## 2026-11-09 16:32:00 | DeepSeek V4.1 Flash Free

### 提示词全文

```text
继续
```

## 2026-11-09 16:35:44 | DeepSeek V4.1 Flash Free

### 提示词全文

```text
提交地址：https://github.com/nanwei-git/HTMLWrok.git
```

## 2026-11-09 16:47:00 | DeepSeek V4.1 Flash Free

### 提示词全文

```text
创建运行后台的bat文件，在根目录下。创建database.html页面，输入用户名，密码，链接数据库，数据库使用mysql，成功和错误都有提示，默认用户名
root,密码123456。完成科技新闻列表页面，新闻的数据存在数据库表里。网页显示后端接口链接和数据内容。
```

## 2026-11-12 15:15:05 | DeepSeek V4.1 Flash Free

### 提示词全文

```text
继续
```

## 2026-11-12 15:19:30 | DeepSeek V4.1 Flash Free

### 提示词全文

```text
继续完善文件上传部分功能
```

## 2026-11-12 15:50:13 | DeepSeek V4.1 Flash Free

### 提示词全文

```text
创建AI聊天页面。
Api-key：[API Key 已脱敏，仅写入 backend/.env]
curl --request POST \
  --url https://api.siliconflow.cn/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "deepseek-ai/DeepSeek-V4-Flash",
    "messages": [
      {"role": "system", "content": "你是一个有用的助手"},
      {"role": "user", "content": "你好，请介绍一下你自己"}
    ]
  }'
```

## 2026-11-12 16:15:35 | DeepSeek V4.1 Flash Free

### 提示词全文

```text
sk-[API Key 已脱敏，仅写入 backend/.env]
```
