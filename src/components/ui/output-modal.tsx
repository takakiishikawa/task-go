'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { CheckCircle2 } from 'lucide-react'

interface OutputModalProps {
  open: boolean
  taskTitle: string
  onSave: (outputNote: string) => Promise<void>
  onSkip: () => void
}

export function OutputModal({ open, taskTitle, onSave, onSkip }: OutputModalProps) {
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!note.trim()) { onSkip(); return }
    setSaving(true)
    try {
      await onSave(note.trim())
      setNote('')
    } finally {
      setSaving(false)
    }
  }

  const handleSkip = () => {
    setNote('')
    onSkip()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleSkip() }}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 style={{ width: 16, height: 16, color: '#30A46C' }} />
            <DialogTitle className="text-foreground text-sm">タスク完了</DialogTitle>
          </div>
        </DialogHeader>

        <div className="mt-1">
          <p className="text-sm text-muted-foreground mb-1 truncate">「{taskTitle}」</p>
          <p className="text-sm font-medium text-foreground mb-4">
            このタスクで出したアウトプット・バリューを一言で記録しましょう
          </p>

          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="例: ロードマップv2の骨子を決定、○○機能の仕様書を完成 など"
            className="text-sm resize-none bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-ring mb-4"
            rows={3}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSave()
            }}
          />

          <div className="flex justify-end gap-2">
            <button
              onClick={handleSkip}
              disabled={saving}
              className="text-sm px-3 py-2 rounded transition-colors bg-secondary text-muted-foreground hover:text-foreground"
            >
              スキップ
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !note.trim()}
              className="text-sm px-4 py-2 rounded transition-colors disabled:opacity-50"
              style={{ background: '#30A46C', color: '#FFFFFF' }}
            >
              {saving ? '保存中...' : '記録する'}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
