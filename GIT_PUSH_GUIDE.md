# GitHub 推送指南

## 检查清单

在推送前，请确保：

### 1. 检查 Git 仓库状态

在 `myweatherweb` 文件夹中打开 PowerShell 或 Git Bash，运行：

```bash
git status
```

### 2. 如果还没有初始化 Git 仓库

```bash
git init
git remote add origin git@github.com:david2fat/-web.git
```

### 3. 检查远程仓库配置

```bash
git remote -v
```

应该显示：
```
origin  git@github.com:david2fat/-web.git (fetch)
origin  git@github.com:david2fat/-web.git (push)
```

### 4. 添加所有文件

```bash
git add .
```

### 5. 提交更改

```bash
git commit -m "配置 Railway 部署和项目文件"
```

### 6. 推送到 GitHub

```bash
git branch -M main
git push -u origin main
```

## 重要文件检查

确保以下文件已包含：
- ✅ package.json
- ✅ railway.json
- ✅ nixpacks.toml
- ✅ Procfile
- ✅ .gitignore
- ✅ src/ 目录
- ✅ public/ 目录

## 确保不会提交的文件

`.gitignore` 应该排除：
- ❌ node_modules/
- ❌ build/
- ❌ .env
- ❌ .env.local

## 如果推送失败

### 错误：远程仓库已有内容

```bash
git pull origin main --allow-unrelated-histories
# 解决冲突后
git push -u origin main
```

### 错误：SSH 连接问题

确保 SSH 密钥已添加到 GitHub：
```bash
ssh -T git@github.com
```

应该看到：`Hi david2fat! You've successfully authenticated...`

