"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ImageCutoutEditor } from "./ImageCutoutEditor";

interface CutoutDialogProps {
  open: boolean;
  image: string | null;
  onOpenChange: (open: boolean) => void;
}

export const CutoutDialog = ({
  open,
  image,
  onOpenChange,
}: CutoutDialogProps) => {
  const [cutoutResult, setCutoutResult] = useState<string | null>(null);

  if (!image) return null;

  const handleDialogOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setCutoutResult(null);
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="max-w-5xl! max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>扣图工作台</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <ImageCutoutEditor
            sourceImage={image}
            onConfirm={(result) => setCutoutResult(result)}
          />

          {cutoutResult && (
            <div className="rounded-lg border bg-muted/40 p-4 space-y-2">
              <p className="text-sm font-medium">已确认的透明图</p>
              <div className="flex flex-wrap items-center gap-4">
                <div className="relative h-32 w-32 rounded-lg border bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 viewBox=%220 0 16 16%22%3E%3Cpath fill=%22%23f3f4f6%22 d=%22M0 0h8v8H0zm8 8h8v8H8z%22/%3E%3Cpath fill=%22%23e5e7eb%22 d=%22M8 0h8v8H8zM0 8h8v8H0z%22/%3E%3C/svg%3E')]">
                  <Image
                    src={cutoutResult}
                    alt="扣图结果"
                    fill
                    sizes="128px"
                    className="object-contain"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  透明图已生成，可直接用于后续生成或替换。若需要进一步调整，继续在画布中涂抹并重新确认。
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

CutoutDialog.displayName = "CutoutDialog";
