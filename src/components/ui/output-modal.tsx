"use client";

import { useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Textarea,
} from "@takaki/go-design-system";

export function OutputModal({
  open,
  taskTitle,
  onSave,
  onSkip,
}: {
  open: boolean;
  taskTitle: string;
  onSave: (outputNote: string) => void | Promise<void>;
  onSkip: () => void | Promise<void>;
}) {
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(note);
      setNote("");
    } finally {
      setSaving(false);
    }
  };

  const handleSkip = async () => {
    setNote("");
    await onSkip();
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-sm">アウトプットを記録する</DialogTitle>
        </DialogHeader>
        <div className="mt-2 space-y-3">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{taskTitle}</span>{" "}
            を完了しました。学びや成果を記録しましょう。
          </p>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="学び・成果・気づきを書く（任意）"
            rows={4}
            className="resize-none"
            autoFocus
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
