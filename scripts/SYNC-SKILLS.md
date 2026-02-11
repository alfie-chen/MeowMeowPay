# Skills 同步服務

將 `.claude/skills/` 實時同步到 `.agents/skills/`，讓 Antigravity 可以使用相同的 Skills。

## 運作原理

使用 macOS LaunchAgent + fswatch + rsync 實現：

1. **fswatch** 監控 `.claude/skills/` 目錄的檔案變動
2. 偵測到變動後，**rsync** 將完整內容同步到 `.agents/skills/`
3. 使用 `--delete` flag，確保兩邊目錄完全一致（鏡像同步）
4. macOS **LaunchAgent** 在登入後自動啟動，異常退出時自動重啟

## 相關檔案

| 檔案 | 用途 |
|------|------|
| `scripts/sync-skills.sh` | 同步 script（fswatch + rsync） |
| `~/Library/LaunchAgents/com.alfie.sync-skills-meowmeowpay.plist` | macOS LaunchAgent 設定 |
| `~/Library/Logs/sync-skills-meowmeowpay.log` | 服務運行 log |

## 常用指令

### 查看 log

```bash
# 即時追蹤 log
tail -f ~/Library/Logs/sync-skills-meowmeowpay.log

# 查看最近 20 行
tail -20 ~/Library/Logs/sync-skills-meowmeowpay.log
```

### 檢查服務狀態

```bash
launchctl list | grep sync-skills
```

輸出格式為 `PID  ExitCode  Label`，有 PID 表示正在運行。

### 停止服務

```bash
launchctl unload ~/Library/LaunchAgents/com.alfie.sync-skills-meowmeowpay.plist
```

### 啟動服務

```bash
launchctl load ~/Library/LaunchAgents/com.alfie.sync-skills-meowmeowpay.plist
```

### 重啟服務

```bash
launchctl unload ~/Library/LaunchAgents/com.alfie.sync-skills-meowmeowpay.plist
launchctl load ~/Library/LaunchAgents/com.alfie.sync-skills-meowmeowpay.plist
```

### 手動同步（單次）

```bash
./scripts/sync-skills.sh once
```

## 前置需求

- **fswatch**：透過 Homebrew 安裝

  ```bash
  brew install fswatch
  ```

## 移除服務

如果不再需要此同步服務：

```bash
# 停止並移除 LaunchAgent
launchctl unload ~/Library/LaunchAgents/com.alfie.sync-skills-meowmeowpay.plist
rm ~/Library/LaunchAgents/com.alfie.sync-skills-meowmeowpay.plist

# 移除 log
rm ~/Library/Logs/sync-skills-meowmeowpay.log

# 移除 script
rm scripts/sync-skills.sh
```
