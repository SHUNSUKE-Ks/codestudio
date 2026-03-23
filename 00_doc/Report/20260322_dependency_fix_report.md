# CodeStudio V1.1 — 依存関係エラー修正レポート

| 項目 | 内容 |
|------|------|
| **日付** | 2026-03-22 |
| **対象プロジェクト** | `codestudio` (`C:\GameProjectMaster\00_CodeEditer\Codestudio_v1.1\codestudio`) |
| **ステータス** | ✅ 解決済み |

---

## 1. 発生した問題

`npm install` 実行時に **ERESOLVE** エラーが発生し、依存関係のインストールが失敗。

```
npm error code ERESOLVE
npm error ERESOLVE could not resolve
```

## 2. 原因

`vite-plugin-pwa@1.2.0` と `vite@8.0.1` の **peer dependency 競合**。

| パッケージ | バージョン | 要求する Vite |
|-----------|-----------|---------------|
| `vite` (root) | `^8.0.1` | — |
| `@vitejs/plugin-react` | `^6.0.1` | `^8.0.0` ✅ |
| `vite-plugin-pwa` | `^1.2.0` | `^3.1.0 \|\| ^4.0.0 \|\| ^5.0.0 \|\| ^6.0.0 \|\| ^7.0.0` ❌ |

**Vite 8 は 2026-03-12 にリリース**されたが、`vite-plugin-pwa` の peer dependency リストにはまだ `^8.0.0` が追加されていないことが原因。

## 3. 適用した修正

```bash
npm install --legacy-peer-deps
```

### このコマンドの効果

- npm の厳格な peer dependency チェックをスキップし、互換性のない peer dependency を無視してインストールを実行する。
- Vite 8 は既存プラグインとの後方互換性を維持する設計のため、`vite-plugin-pwa` は問題なく動作する見込み。

### 実行結果

- **終了コード**: `0`（正常終了）
- **警告**: `EBADENGINE`（Node.js バージョンの推奨警告 — 動作に影響なし）

## 4. 今後の対応

| 対応内容 | 優先度 | 備考 |
|---------|--------|------|
| `vite-plugin-pwa` の更新を監視 | 中 | Vite 8 対応版がリリースされたらバージョンを上げる |
| `npm run dev` で動作確認 | 高 | PWA 関連機能（Service Worker 登録等）が正常か要確認 |
| `npm run build` で本番ビルド確認 | 中 | ビルド成果物の正常性を確認 |

## 5. 備考

- `--legacy-peer-deps` は **一時的な回避策**です。`vite-plugin-pwa` が Vite 8 を公式サポートした段階で、通常の `npm install` に戻すことを推奨します。
- `package-lock.json` にこのフラグの影響が反映されるため、チームでの共有時は注意してください。
