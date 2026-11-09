<!--
姓名：杨庆鸿 | 学号：24002120509
时间：2026-11-09 | 大模型：DeepSeek V4.1 Flash Free
-->

# 云栖校园服务平台

> 连接校园生活与数字体验的全栈 Web 项目。

| 项目信息 | 内容 |
| --- | --- |
| 项目名称 | 云栖校园服务平台（Yunqi Campus Platform） |
| 项目类别 | 自选 |
| 姓名 | 杨庆鸿 |
| 学号 | 24002120509 |
| 技术栈 | 原生 HTML / CSS / JavaScript、Node.js、Express、MySQL |
| 服务端口 | 8509 |

## 项目简介

云栖校园服务平台是一个持续迭代的校园数字服务门户。当前阶段已完成项目骨架、首页与项目概览页面，以及后端健康检查接口；后续业务模块将按照统一规范逐步接入。

## 技术栈

- **前端**：原生 HTML、CSS、JavaScript，不依赖第三方库、框架或 CDN。
- **后端**：Node.js + Express，采用 RESTful + MVC 分层，所有接口统一以 `/api/` 为前缀。
- **数据库**：MySQL，数据表与字段命名统一使用 `yan_` 前缀。
- **静态托管**：Express 通过 `express.static` 托管 `frontend/` 目录。
- **跨域**：后端允许所有来源跨域访问。

## 目录结构

```text
web_work/
├─ frontend/
│  ├─ css/                 # 页面样式
│  ├─ js/                  # Canvas 动画与页面交互
│  ├─ fonts/               # iconfont 图标资源
│  ├─ images/              # 图片与站点图标
│  ├─ index.html           # 项目首页
│  └─ about.html           # 项目概览
├─ backend/
│  ├─ config/              # 数据库连接配置
│  ├─ controllers/         # 控制器
│  ├─ middleware/          # 404 与异常处理
│  ├─ models/              # 数据模型
│  ├─ routes/              # API 路由
│  ├─ app.js               # Express 应用
│  ├─ server.js            # 服务入口
│  ├─ .env.example         # 环境变量示例
│  └─ package.json
├─ AGENTS.md               # 项目开发规则
├─ yangqinghong_prompt.md  # AI 开发指令记录
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

将 `backend/.env.example` 复制为 `backend/.env`，填写本地 MySQL 信息：

```dotenv
DB_USER=你的数据库用户名
DB_PASSWORD=你的数据库密码
DB_HOST=127.0.0.1
DB_NAME=yan_campus_platform
```

`backend/.env` 已被 `.gitignore` 忽略，不会提交到仓库。

### 3. 启动服务

```bash
cd backend
npm start
```

浏览器访问：

- 项目首页：<http://localhost:8509/>
- 项目概览：<http://localhost:8509/about.html>
- 健康检查：<http://localhost:8509/api/health>

## 接口约定

接口统一返回：

```json
{
  "code": 0,
  "msg": "提示信息",
  "data": {}
}
```

当前已提供：

- `GET /api/health`：返回服务运行状态与项目基础信息。

## 前端约定

- 仅使用原生 HTML、CSS、JavaScript。
- 新建 HTML 页面后，需在 `frontend/index.html` 中追加超链接入口；文件名包含 `detail` 的页面除外。
- 服务器返回的数据与错误信息分别通过 `console.log` 和 `console.error` 输出到浏览器控制台。

## 开发记录

- [项目开发规则](AGENTS.md)
- [AI 开发指令记录](yangqinghong_prompt.md)
- 接口与数据库变更记录位于 `backend/` 目录。
