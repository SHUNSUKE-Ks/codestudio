// ── Panel Registry ⑪ プラグイン方式 ─────────────────────────────────────────
// 新パネルはここに追加するだけで自動的に RightIconNav に表示される
import React from 'react'
import { WordListPanel }      from './WordListPanel'
import { FunctionBlockPanel } from './FunctionBlockPanel'
import { ManualPanel }        from './ManualPanel'
import { MemoPanel }          from './memo/MemoPanel'
import type { RightPanel }    from '../../types'

export interface PanelDef {
  id:        RightPanel
  icon:      string
  label:     string
  component: React.ComponentType
}

export const PANEL_REGISTRY: PanelDef[] = [
  { id: 'word',   icon: 'W', label: 'WordList',      component: WordListPanel },
  { id: 'func',   icon: 'F', label: 'FunctionBlock', component: FunctionBlockPanel },
  { id: 'manual', icon: '?', label: 'Manual',        component: ManualPanel },
  { id: 'memo',   icon: 'M', label: 'Memo',          component: MemoPanel },
  // ↑ 新パネルを追加する場合はここに追記するだけ
]
