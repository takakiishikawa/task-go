"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
  Textarea,
} from "@takaki/go-design-system";

interface OutputModalProps {
  open: boolean;
  taskTitle: string;
  onSave: (outputNote: string) => Promise<void>;
  onSkip: () => Promise<void>;
}

export function OutputModal({
  open,
  taskTitle,
  onSave,
  onSkip,
}: OutputModalProps) {
  const [outputNote, setOutputNote] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(outputNote);
      setOutputNote("");
    } finally {
      setSaving(false);
    }
  };

  const handleSkip = async () => {
    setSaving(true);
    try {
      await onSkip();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-sm">アウトプットを記録する</DialogTitle>
        </DialogHeader>
        <div className="mt-2 space-y-3">
          <p className="text-sm text-muted-foreground">
            「{taskTitle}」を完了しました。アウトプットを記録しますか？
          </p>
          <Textarea
            value={outputNote}
            onChange={(e) => setOutputNote(e.target.value)}
            placeholder="何を学んだか、何を作ったか..."
            rows={4}
            className="resize-none"
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={handleSkip} disabled={saving}>
              スキップ
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "保存中..." : "記録する"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
