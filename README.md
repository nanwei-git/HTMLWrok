<!--
姓名：杨庆鸿 | 学号：24002120509
时间：2026-11-09 | 大模型：DeepSeek V4.1 Flash Free
-->

# 云栖数据工坊

> 数据分析报表工作流平台。把数据接入、处理步骤、分析报表与运行记录串成可追踪的流程。

| 项目信息 | 内容 |
| --- | --- |
| 项目名称 | 云栖数据工坊（Yunqi Data Studio） |
| 项目类别 | 自选 |
| 姓名 | 杨庆鸿 |
| 学号 | 24002120509 |
| 技术栈 | 原生 HTML / CSS / JavaScript、Node.js、Express、MySQL、DeepSeek / SiliconFlow 兼容接口 |
| 服务端口 | 8509 |

## 项目简介

云栖数据工坊围绕「数据源 → 工作流 → 报表」组织分析工作。工作台展示实时运营指标与最近动态；工作流中心呈现调度、步骤与执行成功率；报表中心承载趋势与摘要；数据源页面统一展示连接状态与同步规模。

平台包含 7 张 MySQL 业务表、8 条数据源测试数据、8 个工作流、26 个步骤、10 份报表、12 条运行记录、12 条科技新闻与 8 个内置示例文件。工作流支持手动运行，执行后会写入新的运行记录并重新计算成功率；数据库连接页可验证 MySQL 凭据，科技新闻页展示数据库中的新闻与接口原始数据，文件上传页支持拖拽上传、进度展示、分类、下载与删除，AI 对话页通过后端代理连接 DeepSeek 等兼容 OpenAI Chat Completions 协议的大模型服务。

## 页面

| 页面 | 路径 | 说明 |
| --- | --- | --- |
| 工作台 | `/index.html` | 实时指标、图表、最近运行与页面导航 |
| 工作流中心 | `/workflows.html` | 工作流列表、状态筛选与成功率 |
| 工作流详情 | `/workflow-detail.html?id=1` | 步骤编排、运行记录与手动运行 |
| 报表中心 | `/reports.html` | 报表分类、状态筛选与迷你趋势 |
| 报表详情 | `/report-detail.html?id=1` | SVG 趋势图、摘要与生成链路 |
| 数据源 | `/data-sources.html` | 数据源连接状态与同步信息 |
| 文件上传 | `/file-upload.html` | 拖拽上传、进度、分类、文件库、下载与删除 |
| 数据库连接 | `/database.html` | 输入 MySQL 用户名与密码，测试连接并查看接口返回 |
| 科技新闻 | `/tech-news.html` | 科技新闻列表、分类筛选、接口链接与原始数据 |
| AI 对话 | `/ai-chat.html` | 通过后端代理连接 DeepSeek，支持多轮上下文与安全密钥托管 |
| 项目概览 | `/about.html` | 项目定位、分析链路与系统架构 |

`index.html` 提供工作流、报表、数据源、文件上传、数据库连接、科技新闻、AI 对话与项目概览的入口；工作流详情和报表详情由对应列表页进入。

## 技术栈

- **前端**：原生 HTML、CSS、JavaScript，不使用第三方库、框架或 CDN。Canvas 用于背景动画，SVG 用于报表趋势图。
- **后台管理**：工作流、报表、数据源与文件上传均提供列表、详情或操作界面；文件上传使用 `XMLHttpRequest` 展示进度。
- **后端**：Node.js + Express，采用 RESTful + MVC 分层，所有接口以 `/api/` 为前缀。
- **文件上传**：Multer 处理 `multipart/form-data`，限制单文件 10 MB，文件保存到后端目录，元数据写入 MySQL。
- **AI 对话**：浏览器请求本站 `/api/chat`，Express 使用后端环境变量中的 AI 服务 API Key 转发请求，密钥不进入前端。当前默认适配 DeepSeek 官方接口，也可切换到 SiliconFlow 等兼容服务。
- **数据库**：MySQL，表名与字段统一使用 `yan_` 前缀。
- **静态托管**：Express 通过 `express.static` 托管 `frontend/` 目录。
- **跨域**：后端允许所有来源跨域访问。

## 目录结构

```text
web_work/
├─ frontend/
│  ├─ css/yan_main.css
│  ├─ js/yan_main.js
│  ├─ js/yan_dashboard.js
│  ├─ js/yan_workflows.js
│  ├─ js/yan_workflow_detail.js
│  ├─ js/yan_reports.js
│  ├─ js/yan_report_detail.js
│  ├─ js/yan_sources.js
│  ├─ js/yan_upload.js
│  ├─ js/yan_database.js
│  ├─ js/yan_news.js
│  ├─ js/yan_chat.js
│  ├─ fonts/
│  ├─ images/
│  ├─ index.html
│  ├─ workflows.html
│  ├─ workflow-detail.html
│  ├─ reports.html
│  ├─ report-detail.html
│  ├─ data-sources.html
│  ├─ file-upload.html
│  ├─ database.html
│  ├─ tech-news.html
│  ├─ ai-chat.html
│  └─ about.html
├─ backend/
│  ├─ config/yan_db.js
│  ├─ config/yan_uploadConfig.js
│  ├─ config/yan_ai.js
│  ├─ controllers/
│  ├─ middleware/
│  ├─ models/
│  ├─ routes/yan_api.js
│  ├─ uploads/
│  │  ├─ seed/
│  │  └─ runtime/
│  ├─ app.js
│  ├─ server.js
│  ├─ yan_database.md
│  ├─ yan_interface.md
│  ├─ .env.example
│  └─ package.json
├─ AGENTS.md
├─ start.bat
├─ yangqinghong_prompt.md
└─ README.md
```

## 快速开始

### 1. 安装后端依赖

```bash
cd backend
cnpm i
```

如果 `cnpm` 安装失败或超时，改用：

```bash
npm i
```

### 2. 配置环境变量

将 `backend/.env.example` 复制为 `backend/.env`，填写本地 MySQL 信息与 AI 服务信息：

```dotenv
DB_USER=你的数据库用户名
DB_PASSWORD=你的数据库密码
DB_HOST=127.0.0.1
DB_NAME=yan_report_platform

AI_API_KEY=你的 AI 服务 API Key
AI_API_URL=https://api.deepseek.com/chat/completions
AI_MODEL=deepseek-flash
```

默认示例使用 DeepSeek 官方接口；如果要使用 SiliconFlow，请将 `AI_API_URL` 改为 `https://api.siliconflow.cn/v1/chat/completions`，并将 `AI_MODEL` 改为对应的 SiliconFlow 模型名。

`backend/.env` 已被 `.gitignore` 忽略，不会提交到仓库。AI 对话页面不会读取或展示 API Key，所有模型请求均由后端转发。

### 3. 初始化数据库

`backend/yan_database.md` 按执行顺序保存全部建表与测试数据 SQL，可直接在 MySQL 客户端中执行，完整重建 `yan_report_platform` 数据库。

注意：脚本包含 `DROP TABLE IF EXISTS`，请勿在已有生产数据的库中直接执行。

### 4. 启动服务

```bash
cd backend
npm start
```

Windows 用户也可以直接双击项目根目录的 `start.bat`。脚本会自动进入 `backend/`、检查 Node.js 与依赖、提示 `.env` 配置并启动服务。

浏览器访问：

- 工作台：<http://localhost:8509/>
- 工作流中心：<http://localhost:8509/workflows.html>
- 报表中心：<http://localhost:8509/reports.html>
- 数据源：<http://localhost:8509/data-sources.html>
- 文件上传：<http://localhost:8509/file-upload.html>
- 数据库连接：<http://localhost:8509/database.html>
- 科技新闻：<http://localhost:8509/tech-news.html>
- AI 对话：<http://localhost:8509/ai-chat.html>
- 项目概览：<http://localhost:8509/about.html>
- 健康检查：<http://localhost:8509/api/health>

## 接口

接口统一返回：

```json
{
  "code": 0,
  "msg": "提示信息",
  "data": {}
}
```

`code = 0` 表示成功，非 `0` 表示失败。当前接口：

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/health` | 服务状态与项目信息 |
| GET | `/api/dashboard` | 工作台指标、图表与最近动态 |
| GET | `/api/workflows` | 工作流列表，支持 `status` 筛选 |
| GET | `/api/workflows/:id` | 工作流详情、步骤与运行记录 |
| POST | `/api/workflows/:id/runs` | 手动运行工作流 |
| GET | `/api/reports` | 报表列表，支持 `category`、`status` 筛选 |
| GET | `/api/reports/:id` | 报表详情与趋势数据 |
| GET | `/api/data-sources` | 数据源列表与汇总 |
| GET | `/api/uploads` | 文件列表与统计，支持 `category` 筛选 |
| POST | `/api/uploads` | 上传单个文件（multipart/form-data，最大 10 MB） |
| DELETE | `/api/uploads/:id` | 删除用户上传文件 |
| GET | `/api/database/test` | 数据库连接测试接口说明 |
| POST | `/api/database/test` | 使用传入的 MySQL 凭据测试连接 |
| GET | `/api/tech-news` | 科技新闻列表，支持 `category` 筛选 |
| GET | `/api/chat` | AI 对话接口说明、服务商、模型与密钥配置状态 |
| POST | `/api/chat` | 转发多轮对话到配置的 AI 服务并返回模型回复 |

完整请求参数与响应示例见 `backend/yan_interface.md`。

## 数据模型

| 表名 | 说明 |
| --- | --- |
| `yan_data_sources` | 数据源与连接状态 |
| `yan_workflows` | 分析工作流与调度信息 |
| `yan_workflow_steps` | 工作流步骤编排 |
| `yan_reports` | 分析报表与趋势 JSON |
| `yan_workflow_runs` | 工作流运行记录 |
| `yan_tech_news` | 科技新闻与来源信息 |
| `yan_uploads` | 上传文件元数据与分类 |

完整 SQL 见 `backend/yan_database.md`。

## 开发约定

- 仅使用原生 HTML、CSS、JavaScript。
- CSS 类名、JavaScript 变量与函数名、数据库表名及字段使用 `yan_` 前缀。
- 新建 HTML 页面后，需要在 `frontend/index.html` 中添加入口；文件名包含 `detail` 的页面除外。
- 服务器返回的数据与错误信息分别通过 `console.log` 与 `console.error` 输出到浏览器控制台。
- 每张业务表至少保留 8 条具有真实业务意义的测试数据。

## 相关记录

- [项目开发规则](AGENTS.md)
- [AI 开发指令记录](yangqinghong_prompt.md)
- [接口记录](backend/yan_interface.md)
- [数据库记录](backend/yan_database.md)
