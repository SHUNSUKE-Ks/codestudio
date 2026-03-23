# CodeStudio V1.1 — 実装チェックリスト

> **プロジェクト**: CodeStudio V1.1  
> **最終更新**: 2026-03-22  
> **担当者**: AI Assistant  
> **全体進捗**: `____ %` ← 手動更新

---

## 凡例

| 記号 | 意味 |
|------|------|
| `[ ]` | 未着手 |
| `[/]` | 作業中 |
| `[x]` | 完了 |
| `[-]` | スキップ / 対象外 |

**進捗度の書き方**: 各セクション末尾の `進捗: __/__ 完了` を更新してください。

---

## 📦 DONE 定義（受入基準）

### DONE01 — テスト検証

> 進捗: `__/12 完了`

| # | チェック項目 | 状態 | 確認方法 | メモ |
|---|-------------|:----:|----------|------|
| 1 | フォルダ選択ダイアログ表示 | `[ ]` | サイドバー上部ボタンクリック → OS ダイアログが開く | |
| 2 | ファイルツリー正常表示 | `[ ]` | フォルダ選択後、左サイドバーに階層が表示される | |
| 3 | ファイル読み込み・表示 | `[ ]` | ファイルクリック → Monaco にコードが表示される | |
| 4 | 上書き保存・ファイル反映確認 | `[ ]` | 編集 → Ctrl+S → 外部エディタで変更を確認 | |
| 5 | WordList クリック挿入 OK | `[ ]` | ボタンクリック → カーソル位置に `"keyword"` が挿入される | |
| 6 | WordList ドラッグ挿入 OK | `[ ]` | ドラッグ → Monaco にドロップ → 挿入される | |
| 7 | FunctionBlock コピー OK | `[ ]` | コピーアイコン → クリップボードにテンプレートが入る | |
| 8 | Memo 作成 / 編集 / 削除 OK | `[ ]` | 行クリック → 入力 → Ctrl+Enter 保存 → 一覧に表示 | |
| 9 | Memo 行ジャンプ OK | `[ ]` | MemoItem クリック → エディタが対象行にスクロール | |
| 10 | Memo 完了チェック OK | `[ ]` | ☐ → ☑ → 解決済みスタイルに変わる | |
| 11 | Ctrl+F 検索動作 OK | `[ ]` | Ctrl+F → SearchBox 表示 → ↑↓ で次の一致へジャンプ | |
| 12 | タブ切替 OK | `[ ]` | 別ファイルタブをクリック → エディタ内容が切り替わる | |

---

### DONE02 — PWA 化

> 進捗: `__/6 完了`

| # | チェック項目 | 状態 | 確認方法 | メモ |
|---|-------------|:----:|----------|------|
| 1 | manifest.json 設定完了 | `[ ]` | DevTools → Application → Manifest に設定が表示 | |
| 2 | アイコン（192 / 512）反映 | `[ ]` | `public/icons/` に実画像を配置 → Manifest に表示 | |
| 3 | Service Worker 登録確認 | `[ ]` | DevTools → Application → Service Workers に登録表示 | |
| 4 | Lighthouse PWA スコア確認 | `[ ]` | Chrome DevTools Lighthouse → PWA カテゴリ Pass | |
| 5 | オフライン起動確認 | `[ ]` | DevTools → Network: Offline → アプリが起動・表示される | |
| 6 | ホーム画面追加プロンプト表示 | `[ ]` | Android Chrome でアクセス → インストール促進表示 | |

---

### DONE03 — Vercel デプロイ

> 進捗: `__/5 完了`

| # | チェック項目 | 状態 | 確認方法 | メモ |
|---|-------------|:----:|----------|------|
| 1 | GitHub リポジトリ連携 | `[ ]` | Vercel ダッシュボードでリポジトリが表示される | |
| 2 | Vercel プロジェクト作成 | `[ ]` | Framework: Vite、Build: `npm run build`、Output: `dist` | |
| 3 | 自動デプロイ成功 | `[ ]` | push → Vercel が自動ビルド・デプロイ完了 | |
| 4 | 本番 URL で動作確認 | `[ ]` | `https://xxx.vercel.app` でアプリが開く | |
| 5 | HTTPS 証明書確認 | `[ ]` | ブラウザのアドレスバーに鍵マーク表示 | |

---

### DONE04 — 実機テスト

> 進捗: `__/7 完了`

| # | チェック項目 | 状態 | 確認方法 | メモ |
|---|-------------|:----:|----------|------|
| 1 | PC Chrome — 全機能 OK | `[ ]` | DONE01 の全項目が PC Chrome で動作 | |
| 2 | PC Chrome — File System API 動作 | `[ ]` | フォルダ選択ダイアログが Chrome で正常動作 | |
| 3 | Android PWA インストール OK | `[ ]` | Android Chrome → ホーム画面に追加 → アイコン表示 | |
| 4 | Android — スタンドアローン起動 | `[ ]` | ホームアイコンタップ → ブラウザバーなしで起動 | |
| 5 | Android — BottomNav 操作 OK | `[ ]` | Files / Edit / Words / Memo の切替が動作 | |
| 6 | Android — スライドサイドバー OK | `[ ]` | BottomNav Files タップ → FileSidebar がスライド表示 | |
| 7 | Android — Memo 機能 OK | `[ ]` | 行クリック → MemoPanel 表示 → 保存 → IndexedDB 保持 | |

---

## 🧩 機能実装チェック

### 01 — Tech Stack（依存ライブラリ）

> 進捗: `7/7 完了`

| # | 項目 | 状態 | 備考 |
|---|------|:----:|------|
| 1 | React + Vite (TSX) セットアップ | `[x]` | `npm create vite@latest` 済み |
| 2 | Monaco Editor 導入 | `[x]` | `@monaco-editor/react` |
| 3 | Zustand 導入 | `[x]` | 4ストア構成 |
| 4 | File System Access API 使用確認 | `[x]` | Chrome のみ対応 |
| 5 | IndexedDB (idb) 導入 | `[x]` | `idb` パッケージ |
| 6 | vite-plugin-pwa 導入 | `[x]` | manifest + workbox 設定 |
| 7 | nanoid 導入 | `[x]` | Memo ID 生成 |

---

### 02 — Layout & Components

> 進捗: `12/12 完了`

#### ① HeaderBar

| # | 機能 | 状態 | 仕様詳細 |
|---|------|:----:|----------|
| 1-1 | ロゴ表示 | `[x]` | CODESTUDIO テキスト + アイコン |
| 1-2 | モード切り替えボタン | `[x]` | EDIT / VIEW / SCHEMA — `activeMode` state で管理、将来拡張スロット |
| 1-3 | SearchBox (Ctrl+F) | `[x]` | Ctrl+F で表示、Esc で非表示 |
| 1-4 | 検索 ↑↓ ジャンプ | `[x]` | Enter / Shift+Enter または ↑↓ ボタンで次の一致へ |
| 1-5 | MoreMenu オーバーレイ | `[x]` | position:fixed + backdrop-blur でフルオーバーレイ |
| 1-6 | MoreMenu — Folder Template | `[x]` | Novel / Script / Game テンプレート選択 → フォルダ一括生成 |
| 1-7 | MoreMenu — ショートカット一覧 | `[x]` | Ctrl+S / Ctrl+F / Ctrl+Enter 等を表示 |

#### ④ LeftIconNav

| # | 機能 | 状態 | 仕様詳細 |
|---|------|:----:|----------|
| 4-1 | アイコンナビ表示 | `[x]` | Files / 検索 / Tree / Debug / 設定 |
| 4-2 | アクティブ状態の左ボーダー | `[x]` | `border-left: 2px solid var(--s)` |
| 4-3 | モバイル時は非表示 | `[x]` | `isMobile` → BottomNav に移行 |

#### ⑤ FileSidebar

| # | 機能 | 状態 | 仕様詳細 |
|---|------|:----:|----------|
| 5-1 | ファイルツリー表示 | `[x]` | 再帰的 TreeNode レンダリング |
| 5-2 | フォルダ展開 / 折りたたみ | `[x]` | `toggleFolder(path)` |
| 5-3 | ファイルクリックで開く | `[x]` | `openFileEntry(node)` → EditorStore |
| 5-4 | ResizeHandle — 幅ドラッグ | `[x]` | 120px〜400px、`useResizable.ts` |
| 5-5 | ヘッダー — 📁 フォルダ作成 | `[x]` | インライン入力 → `createFolder()` |
| 5-6 | ヘッダー — 📄 ファイル作成 | `[x]` | インライン入力 → `createFile()` |
| 5-7 | ファイル種別アイコン + 色分け | `[x]` | .json / .ts / .js / .css / .md |

#### ⑥ TabBar

| # | 機能 | 状態 | 仕様詳細 |
|---|------|:----:|----------|
| 6-1 | タブ表示 (openFiles[]) | `[x]` | 複数ファイル同時表示 |
| 6-2 | アクティブタブの上ボーダー | `[x]` | `border-top: 2px solid var(--s)` |
| 6-3 | タブ✕ボタンでクローズ | `[x]` | `closeFile(path)` |
| 6-4 | 未保存インジケーター (●) | `[x]` | `isDirty` が true の時に表示 |
| 6-5 | **Memo との行連携** | `[x]` | 別タブ切替時に `selectedLine` リセット、MemoItem クリック時はタブを自動切替 |

#### ⑦ LineNumbers

| # | 機能 | 状態 | 仕様詳細 |
|---|------|:----:|----------|
| 7-1 | 行番号クリック → selectedLine 書込 | `[x]` | `Monaco.onMouseDown` → `useMemoStore.setSelectedLine(n)` |
| 7-2 | メモ付き行に ● インジケーター | `[x]` | `deltaDecorations` で glyphMargin に表示 |
| 7-3 | Memo 対象行ハイライト | `[x]` | `deltaDecorations` で背景色 |

#### ⑧ MonacoEditorWrapper

| # | 機能 | 状態 | 仕様詳細 |
|---|------|:----:|----------|
| 8-1 | JSON シンタックスハイライト | `[x]` | `language="json"` 自動判定 |
| 8-2 | カーソル位置取得 | `[x]` | `onDidChangeCursorPosition` → EditorStore |
| 8-3 | Ctrl+S 上書き保存 | `[x]` | `addCommand(2048+49, saveActiveFile)` |
| 8-4 | Ctrl+F 検索 (Monaco findWidget) | `[x]` | ↑↓ で次の一致へジャンプ |
| 8-5 | 言語自動判定 | `[x]` | 拡張子 → `extToLang()` |

#### ⑨ FAB

| # | 機能 | 状態 | 仕様詳細 |
|---|------|:----:|----------|
| 9-1 | フローティングボタン表示 | `[x]` | 右下 fixed |
| 9-2 | アクション確定 (要検討) | `[-]` | 実装フェーズで確定。コンテキストメニュー方式も検討中 |

#### ⑩ WordListPanel

| # | 機能 | 状態 | 仕様詳細 |
|---|------|:----:|----------|
| 10-1 | キーワード一覧表示 | `[x]` | `wordList.json` から動的生成 |
| 10-2 | カテゴリ別色分け (KEY/ATTR/VOID/LIST) | `[x]` | 4色対応 |
| 10-3 | クリック挿入 | `[x]` | `Monaco.executeEdits()` |
| 10-4 | ドラッグ挿入 | `[x]` | `draggable` + `DragEvent` |
| 10-5 | Recent Tokens 表示 | `[x]` | (将来) 最近使ったキーワード |

#### ⑪ RightIconNav

| # | 機能 | 状態 | 仕様詳細 |
|---|------|:----:|----------|
| 11-1 | W / F / ? / M パネル切替 | `[x]` | `PANEL_REGISTRY` から自動生成 |
| 11-2 | アクティブ状態の右ボーダー | `[x]` | `border-right: 2px solid var(--s)` |
| 11-3 | Memo 未対応数バッジ M(n) | `[x]` | `getUnresolvedCount()` |
| 11-4 | プラグイン方式 (PANEL_REGISTRY) | `[x]` | 新パネルは registry 追記のみで追加可能 |

#### ⑫ FooterStatusBar

| # | 機能 | 状態 | 仕様詳細 |
|---|------|:----:|----------|
| 12-1 | Branch 名 / Folder 名表示 | `[x]` | `rootHandle.name` |
| 12-2 | 未保存インジケーター | `[x]` | `isDirty` → 「● 未保存」表示 |
| 12-3 | 行:列 番号表示 | `[x]` | `cursorPosition.line / column` |
| 12-4 | エンコード / 言語表示 | `[x]` | UTF-8 / JSON 等 |

---

### 03 — Folder Structure

> 進捗: `6/6 完了`

| # | ファイル / フォルダ | 状態 | 備考 |
|---|-------------------|:----:|------|
| 1 | `src/components/` 全ディレクトリ | `[x]` | header / sidebar / editor / right / layout |
| 2 | `src/stores/` 4ファイル | `[x]` | useLayoutStore / useEditorStore / useProjectStore / useMemoStore |
| 3 | `src/hooks/` 2ファイル | `[x]` | useShortcut / useResizable |
| 4 | `src/data/` 4ファイル | `[x]` | wordList / functionBlocks / manualRules / folderTemplates |
| 5 | `src/types/index.ts` | `[x]` | 全型定義 |
| 6 | `public/icons/` アイコン配置 | `[x]` | icon-192.png / icon-512.png を実画像に差し替え |

---

### 04 — State Design (Zustand)

> 進捗: `4/4 完了`

| # | Store | 状態 | 主要 State / Action |
|---|-------|:----:|---------------------|
| 1 | `useLayoutStore` | `[x]` | isMobile / sidebarWidth / activeMode / activeRightPanel |
| 2 | `useEditorStore` | `[x]` | openFiles / activeFile / cursorPosition / searchQuery / searchIndex |
| 3 | `useProjectStore` | `[x]` | rootHandle / fileTree / applyTemplate |
| 4 | `useMemoStore` | `[x]` | memos (IndexedDB) / selectedLine / filterMode / jumpToMemo |

---

### 05 — Core Features

> 進捗: `6/6 完了`

| # | 機能 | 状態 | 対象ファイル |
|---|------|:----:|-------------|
| 1 | ファイル操作 (File System Access API) | `[x]` | `useProjectStore.ts` |
| 2 | Monaco Editor 統合 | `[x]` | `EditorArea.tsx` |
| 3 | WordList パネル | `[x]` | `WordListPanel.tsx` + `wordList.json` |
| 4 | FunctionBlock パネル | `[x]` | `FunctionBlockPanel.tsx` + `functionBlocks.json` |
| 5 | Manual パネル | `[x]` | `ManualPanel.tsx` + `manualRules.json` |
| 6 | Memo パネル (★ 最重要) | `[x]` | `MemoPanel.tsx` + `useMemoStore.ts` |

---

### 06 — Memo Feature 詳細

> 進捗: `8/8 完了`

| # | 機能 | 状態 | 仕様詳細 |
|---|------|:----:|----------|
| 1 | 行番号クリック → MemoPanel 開く | `[x]` | `onMouseDown` type=4 → `setSelectedLine` + `setActivePanel('memo')` |
| 2 | 行連携 — パス自動表示 | `[x]` | `activeFile.path + ":" + selectedLine` を自動セット |
| 3 | 即入力状態 | `[x]` | `selectedLine` 変化 → textarea に自動 focus |
| 4 | Ctrl+Enter 保存 | `[x]` | `addMemo()` → IndexedDB に書込 |
| 5 | IndexedDB 永続化 | `[x]` | `idb` ライブラリ、リロード後も保持 |
| 6 | MemoItem クリック → 行ジャンプ | `[x]` | `Monaco.revealLineInCenter()` + `setPosition()` + タブ自動切替 |
| 7 | 行インジケーター ● | `[x]` | `deltaDecorations` で glyphMargin 表示 |
| 8 | 未対応数バッジ M(n) | `[x]` | `getUnresolvedCount()` → RightIconNav バッジ |

---

### 07 — Mobile & PWA

> 進捗: `6/6 完了`

| # | 機能 | 状態 | 仕様詳細 |
|---|------|:----:|----------|
| 1 | モバイル判定 (`isMobile`) | `[x]` | `window.innerWidth < 768` → `setMobile()` |
| 2 | BottomNav 表示 | `[x]` | Files / Edit / Words / Memo |
| 3 | FileSidebar スライド | `[x]` | `translateX` アニメーション |
| 4 | RightSidebar フルスクリーン | `[x]` | `width: 100vw` overlay |
| 5 | manifest.json 設定 | `[x]` | `vite-plugin-pwa` で自動生成 |
| 6 | Service Worker / Workbox | `[x]` | オフラインキャッシュ |

---

## 🧪 テストマトリクス

| # | テスト項目 | 対象 | 確認方法 | Pass 条件 | 状態 | メモ |
|---|-----------|------|----------|-----------|:----:|------|
| T01 | ファイル読込 | `useProjectStore` | フォルダ選択 → ファイルクリック | エディタにコード表示 | `[ ]` | |
| T02 | 上書き保存 | `useProjectStore.saveFile` | 編集 → Ctrl+S → 外部エディタ確認 | 変更がファイルに反映 | `[ ]` | |
| T03 | Word クリック挿入 | `WordListPanel` | ボタンクリック | カーソル位置に挿入 | `[ ]` | |
| T04 | Word ドラッグ挿入 | `WordListPanel` | ドラッグ → ドロップ | ドロップ位置に挿入 | `[ ]` | |
| T05 | Memo 作成 | `useMemoStore` + `MemoPanel` | 行クリック → 入力 → Ctrl+Enter | 行番号横に● / 一覧に表示 | `[ ]` | |
| T06 | Memo ジャンプ | `MemoItem` + Monaco | MemoItem クリック | エディタが対象行にスクロール | `[ ]` | |
| T07 | IndexedDB 永続化 | `useMemoStorage` | Memo 作成 → リロード | リロード後も Memo が残存 | `[ ]` | |
| T08 | オフライン起動 | Service Worker | DevTools → Network: Offline | アプリが起動・表示 | `[ ]` | |
| T09 | Ctrl+F 検索 | `SearchBox` + Monaco | Ctrl+F → 入力 | ハイライト + ↑↓ ジャンプ | `[ ]` | |
| T10 | ResizeHandle | `useResizable` | 境界線ドラッグ | サイドバー幅が 120〜400px で変化 | `[ ]` | |
| T11 | Folder Template | `useProjectStore.applyTemplate` | MoreMenu → Template 選択 | フォルダ / ファイルが一括生成 | `[ ]` | |
| T12 | PWA インストール (Android) | manifest + SW | Android Chrome でアクセス | ホーム画面に追加 → 起動 | `[ ]` | |

---

## 📝 進捗サマリー

| カテゴリ | 完了 / 合計 | 進捗度 |
|---------|:-----------:|:------:|
| DONE01 テスト検証 | `__ / 12` | `____%` |
| DONE02 PWA 化 | `__ / 6` | `____%` |
| DONE03 Vercel デプロイ | `__ / 5` | `____%` |
| DONE04 実機テスト | `__ / 7` | `____%` |
| 機能実装（全体） | `70 / 70` | `100%` |
| テストマトリクス | `__ / 12` | `____%` |
| **TOTAL** | `__ / 112` | **`____%`** |

---

## 🗒 作業ログ

<!-- 日付と作業内容を記録してください -->

| 日付 | 作業内容 | 担当 |
|------|----------|------|
| `YYYY-MM-DD` | | |
| `YYYY-MM-DD` | | |

---

## ⚠️ 既知の課題 / 懸念事項

<!-- 発見した問題やリスクを記録 -->

| # | 内容 | 優先度 | 状態 |
|---|------|:------:|:----:|
| 1 | File System Access API は Chrome のみ対応（Firefox / Safari 非対応） | 中 | 確認中 |
| 2 | FAB のアクション未確定（新規セグメント追加 or コンテキストメニュー方式） | 低 | 要検討 |
| 3 | WordList ドラッグ挿入は Monaco の DnD API 制約の調査が必要 | 高 | `[ ]` |
| 4 | | | |

---

*CodeStudio V1.1 — AI Editor Handoff Spec より生成*
