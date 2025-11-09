# Railway 部署指南

## 已完成的配置

1. ✅ 已添加 `serve` 包用于提供静态文件服务
2. ✅ 已创建 `railway.json` 配置文件
3. ✅ 已创建 `Procfile` 用于 Railway 部署
4. ✅ 已创建 `nixpacks.toml` 用于构建配置

## 在 Railway 中设置环境变量

部署前，您需要在 Railway 项目中设置以下环境变量：

### 必需的环境变量

1. **REACT_APP_WEATHER_API_PROVIDER**
   - 值：`openweather` 或 `cwb`

2. **REACT_APP_OPENWEATHER_API_KEY**
   - 值：`b056d2639727215b67d7ed7f02958c67`

3. **REACT_APP_CWB_API_KEY**
   - 值：`CWA-B300F895-3D5E-4C28-B03E-11E9E94CCE39`

### 设置步骤

1. 在 Railway 项目页面，点击 **Variables** 标签
2. 点击 **+ New Variable** 添加每个环境变量
3. 添加完所有变量后，重新部署

## 部署流程

1. 将代码推送到 GitHub
2. Railway 会自动检测到更改并开始构建
3. 构建完成后会自动部署

## 如果部署失败

1. 检查 Railway 的构建日志
2. 确保所有环境变量都已设置
3. 确保 `package.json` 中的依赖都已正确安装

