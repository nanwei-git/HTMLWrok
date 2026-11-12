@echo off
REM 姓名：杨庆鸿 | 学号：24002120509
REM 时间：2026-11-09 | 大模型：DeepSeek V4.1 Flash Free
REM 云栖数据工坊 - 后台启动脚本

chcp 65001 >nul
setlocal
title 云栖数据工坊 - 启动后台服务

cd /d "%~dp0backend"

if not exist "package.json" (
  echo [错误] 未找到 backend\package.json，请确认项目目录是否完整。
  pause
  exit /b 1
)

where node >nul 2>nul
if errorlevel 1 (
  echo [错误] 未检测到 Node.js，请先安装 Node.js 后再运行本脚本。
  pause
  exit /b 1
)

if not exist ".env" (
  if exist ".env.example" (
    copy /Y ".env.example" ".env" >nul
    echo [提示] 已根据 .env.example 创建 backend\.env。
    echo        请先填写 DB_USER、DB_PASSWORD、DB_HOST、DB_NAME，然后重新运行本脚本。
    pause
    exit /b 1
  )

  echo [错误] 未找到 backend\.env，请先配置 MySQL 数据库连接信息。
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo [信息] 未检测到后端依赖，正在安装...
  where cnpm >nul 2>nul
  if errorlevel 1 (
    call npm i
  ) else (
    call cnpm i
  )

  if errorlevel 1 (
    echo [错误] 依赖安装失败，请检查网络或手动执行 cnpm i / npm i。
    pause
    exit /b 1
  )
)

echo ============================================================
echo   云栖数据工坊 - 数据分析报表工作流平台
echo   服务地址：http://localhost:8509
echo   接口前缀：http://localhost:8509/api
echo   按 Ctrl + C 可停止服务
echo ============================================================
echo.

node server.js

echo.
echo [信息] 后台服务已停止。
pause
