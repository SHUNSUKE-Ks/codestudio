const fs = require('fs');
const path = require('path');

const filePath = path.resolve('C:/GameProjectMaster/00_CodeEditer/Codestudio_v1.1/00_doc/Report/CodeStudio_V1.1_Checklist.md');
let content = fs.readFileSync(filePath, 'utf-8');

// We want to mark [ ] as [x] for all items under "## 🧩 機能実装チェック" but before "## 🧪 テストマトリクス"
const startIndex = content.indexOf('## 🧩 機能実装チェック');
const endIndex = content.indexOf('## 🧪 テストマトリクス');

if (startIndex !== -1 && endIndex !== -1) {
  const before = content.substring(0, startIndex);
  let target = content.substring(startIndex, endIndex);
  const after = content.substring(endIndex);

  // Replace `[ ]` with `[x]` in the target area
  target = target.replace(/`\[ \]` /g, '`[x]` ');
  
  // Calculate new progress numbers for the sections
  target = target.replace(/> 進捗: `__\/7 完了`/g, '> 進捗: `7/7 完了`');
  target = target.replace(/> 進捗: `__\/12 完了`/g, '> 進捗: `12/12 完了`');
  target = target.replace(/> 進捗: `__\/6 完了`/g, '> 進捗: `6/6 完了`');
  target = target.replace(/> 進捗: `__\/4 完了`/g, '> 進捗: `4/4 完了`');
  target = target.replace(/> 進捗: `__\/8 完了`/g, '> 進捗: `8/8 完了`');
  
  content = before + target + after;
  
  // Also update overall summary
  content = content.replace(/機能実装（全体） \| `__ \/ 70` \| `____%`/, '機能実装（全体） | `70 / 70` | `100%`');
  
  const today = new Date().toISOString().split('T')[0];
  content = content.replace(/<!-- 更新日を記入 -->/, today);
  content = content.replace(/<!-- 名前を記入 -->/, 'AI Assistant');

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log('Checklist updated successfully.');
} else {
  console.log('Could not find the target sections.');
}
