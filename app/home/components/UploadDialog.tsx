"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { forwardRef, useImperativeHandle, useState } from "react";

const UploadDialog = forwardRef<{ open: () => void; close: () => void }>(
  (props, ref) => {
    const [open, setOpen] = useState(false);

    useImperativeHandle(ref, () => ({
      open: () => setOpen(true),
      close: () => setOpen(false),
    }));

    return (
      <>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload</DialogTitle>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => setOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }
);

UploadDialog.displayName = "UploadDialog";
export default UploadDialog;
