# GitHub 推送脚本
# 在 myweatherweb 文件夹中运行此脚本

Write-Host "=== GitHub 推送脚本 ===" -ForegroundColor Green

# 检查 Git 是否安装
try {
    $gitVersion = git --version
    Write-Host "Git 已安装: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "错误: Git 未安装或不在 PATH 中" -ForegroundColor Red
    exit 1
}

# 检查是否在 Git 仓库中
if (-not (Test-Path ".git")) {
    Write-Host "初始化 Git 仓库..." -ForegroundColor Yellow
    git init
    git remote add origin git@github.com:david2fat/-web.git
    Write-Host "Git 仓库已初始化" -ForegroundColor Green
} else {
    Write-Host "Git 仓库已存在" -ForegroundColor Green
}

# 检查远程仓库
Write-Host "`n检查远程仓库配置..." -ForegroundColor Yellow
git remote -v

# 添加所有文件
Write-Host "`n添加所有文件..." -ForegroundColor Yellow
git add .

# 显示状态
Write-Host "`n当前 Git 状态:" -ForegroundColor Yellow
git status

# 提交
Write-Host "`n提交更改..." -ForegroundColor Yellow
$commitMessage = "配置 Railway 部署和项目文件"
git commit -m $commitMessage

# 设置主分支
Write-Host "`n设置主分支..." -ForegroundColor Yellow
git branch -M main

# 推送到 GitHub
Write-Host "`n推送到 GitHub..." -ForegroundColor Yellow
Write-Host "如果这是第一次推送，可能需要输入: git push -u origin main" -ForegroundColor Cyan
git push -u origin main

Write-Host "`n=== 完成 ===" -ForegroundColor Green

