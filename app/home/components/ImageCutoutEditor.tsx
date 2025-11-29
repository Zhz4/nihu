"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Brush,
  Download,
  Eraser,
  Redo2,
  RotateCcw,
  Undo2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageCutoutEditorProps {
  sourceImage: string;
  onConfirm?: (result: string) => void;
}

interface Dimensions {
  displayWidth: number;
  displayHeight: number;
  naturalWidth: number;
  naturalHeight: number;
}

const checkerboardBg =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath fill='%23f3f4f6' d='M0 0h8v8H0zm8 8h8v8H8z'/%3E%3Cpath fill='%23e5e7eb' d='M8 0h8v8H8zM0 8h8v8H0z'/%3E%3C/svg%3E";

export const ImageCutoutEditor = ({
  sourceImage,
  onConfirm,
}: ImageCutoutEditorProps) => {
  const overlayCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const editorCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const naturalImageRef = useRef<HTMLImageElement | null>(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const historyRef = useRef<ImageData[]>([]);
  const redoRef = useRef<ImageData[]>([]);
  const previewFrameRef = useRef<number | undefined>(undefined);

  const [dimensions, setDimensions] = useState<Dimensions>({
    displayWidth: 0,
    displayHeight: 0,
    naturalWidth: 0,
    naturalHeight: 0,
  });
  const [mode, setMode] = useState<"keep" | "remove">("remove");
  const [brushSize, setBrushSize] = useState(28);
  const [zoom, setZoom] = useState(1);
  const [exporting, setExporting] = useState(false);
  const [historySizes, setHistorySizes] = useState({ undo: 0, redo: 0 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);

  const refreshToolbar = useCallback(() => {
    setHistorySizes({
      undo: historyRef.current.length,
      redo: redoRef.current.length,
    });
  }, []);

  const clearOverlay = useCallback(() => {
    const overlay = overlayCanvasRef.current;
    if (!overlay) return;
    const ctx = overlay.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    ctx.clearRect(0, 0, overlay.width, overlay.height);
  }, []);

  const renderComposite = useCallback(() => {
    const image = naturalImageRef.current;
    const maskCanvas = maskCanvasRef.current;
    const editorCanvas = editorCanvasRef.current;

    if (!image || !maskCanvas || dimensions.displayWidth === 0) {
      return;
    }

    const { displayWidth, displayHeight } = dimensions;

    // 绘制左侧编辑区
    if (editorCanvas) {
      editorCanvas.width = displayWidth;
      editorCanvas.height = displayHeight;
      const ctx = editorCanvas.getContext("2d", { willReadFrequently: true });
      if (ctx) {
        ctx.clearRect(0, 0, displayWidth, displayHeight);
        ctx.drawImage(image, 0, 0, displayWidth, displayHeight);
        ctx.globalCompositeOperation = "destination-in";
        ctx.drawImage(
          maskCanvas,
          0,
          0,
          maskCanvas.width,
          maskCanvas.height,
          0,
          0,
          displayWidth,
          displayHeight
        );
        ctx.globalCompositeOperation = "source-over";
      }
    }

    // 生成右侧预览的 base64 图片
    try {
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = displayWidth;
      tempCanvas.height = displayHeight;
      const tempCtx = tempCanvas.getContext("2d", { willReadFrequently: true });
      if (tempCtx) {
        tempCtx.drawImage(image, 0, 0, displayWidth, displayHeight);
        tempCtx.globalCompositeOperation = "destination-in";
        tempCtx.drawImage(
          maskCanvas,
          0,
          0,
          maskCanvas.width,
          maskCanvas.height,
          0,
          0,
          displayWidth,
          displayHeight
        );
        tempCtx.globalCompositeOperation = "source-over";
        setPreviewSrc(tempCanvas.toDataURL("image/png"));
      }
    } catch (error) {
      console.error("渲染透明预览失败", error);
    }
  }, [dimensions]);

  const schedulePreview = useCallback(() => {
    if (previewFrameRef.current) {
      window.cancelAnimationFrame(previewFrameRef.current);
    }
    previewFrameRef.current = window.requestAnimationFrame(() => {
      previewFrameRef.current = undefined;
      renderComposite();
    });
  }, [renderComposite]);

  useEffect(() => {
    return () => {
      if (previewFrameRef.current) {
        window.cancelAnimationFrame(previewFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      naturalImageRef.current = img;
      const maxWidth = 520;
      const scale = img.width > maxWidth ? maxWidth / img.width : 1;
      setDimensions({
        displayWidth: Math.round(img.width * scale),
        displayHeight: Math.round(img.height * scale),
        naturalWidth: img.width,
        naturalHeight: img.height,
      });
    };
    img.src = sourceImage;

    return () => {
      naturalImageRef.current = null;
      setDimensions({
        displayWidth: 0,
        displayHeight: 0,
        naturalWidth: 0,
        naturalHeight: 0,
      });
    };
  }, [sourceImage]);

  useEffect(() => {
    if (!dimensions.displayWidth) return;
    const canvases = [
      overlayCanvasRef.current,
      maskCanvasRef.current,
      editorCanvasRef.current,
    ];

    canvases.forEach((canvas) => {
      if (!canvas) return;
      canvas.width = dimensions.displayWidth;
      canvas.height = dimensions.displayHeight;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    });

    historyRef.current = [];
    redoRef.current = [];

    const maskCtx = maskCanvasRef.current?.getContext("2d", {
      willReadFrequently: true,
    });
    if (maskCtx) {
      maskCtx.save();
      maskCtx.globalCompositeOperation = "source-over";
      maskCtx.fillStyle = "white";
      maskCtx.fillRect(0, 0, dimensions.displayWidth, dimensions.displayHeight);
      maskCtx.restore();
    }
    schedulePreview();
  }, [dimensions, schedulePreview]);

  const getPoint = useCallback((event: React.PointerEvent) => {
    const canvas = overlayCanvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
    };
  }, []);

  const pushHistory = useCallback(() => {
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas) return;
    const ctx = maskCanvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    const snapshot = ctx.getImageData(
      0,
      0,
      maskCanvas.width,
      maskCanvas.height
    );
    historyRef.current.push(snapshot);
    if (historyRef.current.length > 20) {
      historyRef.current.shift();
    }
    redoRef.current = [];
    refreshToolbar();
  }, [refreshToolbar]);

  const drawStroke = useCallback(
    (from: { x: number; y: number }, to: { x: number; y: number }) => {
      const overlay = overlayCanvasRef.current;
      const maskCanvas = maskCanvasRef.current;
      if (!overlay || !maskCanvas) return;

      const overlayCtx = overlay.getContext("2d", { willReadFrequently: true });
      const maskCtx = maskCanvas.getContext("2d", { willReadFrequently: true });
      if (!overlayCtx || !maskCtx) return;

      overlayCtx.save();
      overlayCtx.globalAlpha = 0.6;
      overlayCtx.strokeStyle =
        mode === "keep" ? "rgba(99,102,241,1)" : "rgba(239,68,68,1)";
      overlayCtx.lineWidth = brushSize;
      overlayCtx.lineCap = "round";
      overlayCtx.lineJoin = "round";
      overlayCtx.beginPath();
      overlayCtx.moveTo(from.x, from.y);
      overlayCtx.lineTo(to.x, to.y);
      overlayCtx.stroke();
      overlayCtx.restore();

      maskCtx.save();
      maskCtx.lineWidth = brushSize;
      maskCtx.lineCap = "round";
      maskCtx.lineJoin = "round";
      if (mode === "keep") {
        maskCtx.globalCompositeOperation = "source-over";
        maskCtx.strokeStyle = "rgba(255,255,255,1)";
      } else {
        maskCtx.globalCompositeOperation = "destination-out";
        maskCtx.strokeStyle = "rgba(0,0,0,1)";
      }
      maskCtx.beginPath();
      maskCtx.moveTo(from.x, from.y);
      maskCtx.lineTo(to.x, to.y);
      maskCtx.stroke();
      maskCtx.restore();

      schedulePreview();
    },
    [brushSize, mode, schedulePreview]
  );

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      const point = getPoint(event);
      if (!point) return;
      drawingRef.current = true;
      lastPointRef.current = point;
      pushHistory();
      drawStroke(point, point);
      event.currentTarget.setPointerCapture(event.pointerId);
      setIsDrawing(true);
    },
    [drawStroke, getPoint, pushHistory]
  );

  const stopDrawing = useCallback(() => {
    drawingRef.current = false;
    lastPointRef.current = null;
    clearOverlay();
    setIsDrawing(false);
  }, [clearOverlay]);

  useEffect(() => {
    const handlePointerUp = () => stopDrawing();
    window.addEventListener("pointerup", handlePointerUp);
    return () => window.removeEventListener("pointerup", handlePointerUp);
  }, [stopDrawing]);

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      if (!drawingRef.current) return;
      const point = getPoint(event);
      const lastPoint = lastPointRef.current;
      if (!point || !lastPoint) return;
      drawStroke(lastPoint, point);
      lastPointRef.current = point;
    },
    [drawStroke, getPoint]
  );

  const restoreSnapshot = useCallback(
    (stack: React.MutableRefObject<ImageData[]>, targetStack?: ImageData[]) => {
      const maskCanvas = maskCanvasRef.current;
      if (!maskCanvas) return false;
      const ctx = maskCanvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return false;
      const snapshot = stack.current.pop();
      if (!snapshot) return false;
      if (targetStack) {
        const current = ctx.getImageData(
          0,
          0,
          maskCanvas.width,
          maskCanvas.height
        );
        targetStack.push(current);
      }
      ctx.putImageData(snapshot, 0, 0);
      schedulePreview();
      refreshToolbar();
      return true;
    },
    [refreshToolbar, schedulePreview]
  );

  const handleUndo = useCallback(() => {
    const redoStack = redoRef.current;
    restoreSnapshot(historyRef, redoStack);
  }, [restoreSnapshot]);

  const handleRedo = useCallback(() => {
    restoreSnapshot(redoRef, historyRef.current);
  }, [restoreSnapshot]);

  const handleFillAll = useCallback(() => {
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas) return;
    pushHistory();
    const ctx = maskCanvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    ctx.save();
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
    ctx.restore();
    clearOverlay();
    schedulePreview();
  }, [clearOverlay, pushHistory, schedulePreview]);

  const handleClear = useCallback(() => {
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas) return;
    pushHistory();
    const ctx = maskCanvas.getContext("2d", { willReadFrequently: true });
    ctx?.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
    clearOverlay();
    schedulePreview();
  }, [clearOverlay, pushHistory, schedulePreview]);

  const exportResult = useCallback(async () => {
    const image = naturalImageRef.current;
    const maskCanvas = maskCanvasRef.current;
    if (
      !image ||
      !maskCanvas ||
      dimensions.naturalWidth === 0 ||
      dimensions.naturalHeight === 0
    ) {
      return null;
    }

    const outputCanvas = document.createElement("canvas");
    outputCanvas.width = dimensions.naturalWidth;
    outputCanvas.height = dimensions.naturalHeight;
    const outputCtx = outputCanvas.getContext("2d", {
      willReadFrequently: true,
    });
    if (!outputCtx) return null;
    outputCtx.drawImage(image, 0, 0);

    const scaledMaskCanvas = document.createElement("canvas");
    scaledMaskCanvas.width = dimensions.naturalWidth;
    scaledMaskCanvas.height = dimensions.naturalHeight;
    const scaledMaskCtx = scaledMaskCanvas.getContext("2d", {
      willReadFrequently: true,
    });
    if (!scaledMaskCtx) return null;
    scaledMaskCtx.drawImage(
      maskCanvas,
      0,
      0,
      dimensions.displayWidth,
      dimensions.displayHeight,
      0,
      0,
      dimensions.naturalWidth,
      dimensions.naturalHeight
    );

    const imgData = outputCtx.getImageData(
      0,
      0,
      dimensions.naturalWidth,
      dimensions.naturalHeight
    );
    const maskData = scaledMaskCtx.getImageData(
      0,
      0,
      dimensions.naturalWidth,
      dimensions.naturalHeight
    );

    for (let i = 0; i < imgData.data.length; i += 4) {
      imgData.data[i + 3] = maskData.data[i + 3];
    }
    outputCtx.putImageData(imgData, 0, 0);
    return outputCanvas.toDataURL("image/png");
  }, [dimensions]);

  const handleDownload = useCallback(async () => {
    setExporting(true);
    const dataUrl = await exportResult();
    setExporting(false);
    if (!dataUrl) return;
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "cutout.png";
    link.click();
  }, [exportResult]);

  const handleConfirm = useCallback(async () => {
    setExporting(true);
    const dataUrl = await exportResult();
    setExporting(false);
    if (!dataUrl) return;
    onConfirm?.(dataUrl);
  }, [exportResult, onConfirm]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="lg:w-1/2 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">
              在左侧标记需要保留或清除的区域
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant={mode === "keep" ? "default" : "outline"}
              size="sm"
              onClick={() => setMode("keep")}
              className="gap-2"
            >
              <Brush className="h-4 w-4" />
              保留
            </Button>
            <Button
              type="button"
              variant={mode === "remove" ? "default" : "outline"}
              size="sm"
              onClick={() => setMode("remove")}
              className="gap-2"
            >
              <Eraser className="h-4 w-4" />
              去除
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleUndo}
              disabled={historySizes.undo === 0}
              className="gap-1"
            >
              <Undo2 className="h-4 w-4" />
              撤销
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRedo}
              disabled={historySizes.redo === 0}
              className="gap-1"
            >
              <Redo2 className="h-4 w-4" />
              重做
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleFillAll}
              className="gap-1"
            >
              <RotateCcw className="h-4 w-4" />
              全部保留
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClear}
            >
              清空
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <label className="flex items-center gap-2">
              画笔大小
              <input
                type="range"
                min={8}
                max={120}
                value={brushSize}
                onChange={(event) => setBrushSize(Number(event.target.value))}
                className="w-40"
              />
              <span className="w-8 text-right text-foreground">
                {brushSize}
              </span>
            </label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => setZoom((value) => Math.max(0.5, value - 0.2))}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span>{Math.round(zoom * 100)}%</span>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => setZoom((value) => Math.min(2, value + 0.2))}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="rounded-lg border bg-muted/30 p-3">
            <div className="text-xs font-medium text-muted-foreground mb-2">
              手动画线区
            </div>
            <div className="max-h-[520px] overflow-auto rounded-md border bg-white">
              <div
                className="relative"
                style={{
                  width: dimensions.displayWidth * zoom,
                  height: dimensions.displayHeight * zoom,
                }}
              >
                <div
                  className="absolute inset-0 rounded-lg"
                  style={{
                    backgroundImage: `url(${checkerboardBg})`,
                    backgroundSize: "16px 16px",
                  }}
                />
                <canvas
                  ref={editorCanvasRef}
                  className="absolute left-0 top-0"
                  style={{
                    width: dimensions.displayWidth * zoom,
                    height: dimensions.displayHeight * zoom,
                  }}
                />
                <canvas
                  ref={overlayCanvasRef}
                  className="absolute left-0 top-0"
                  style={{
                    width: dimensions.displayWidth * zoom,
                    height: dimensions.displayHeight * zoom,
                    cursor: isDrawing
                      ? "crosshair"
                      : mode === "keep"
                      ? "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2224%22 height=%2224%22 viewBox=%220 0 24 24%22%3E%3Ccircle cx=%2212%22 cy=%2212%22 r=%228%22 fill=%22%236363f1%22 fill-opacity=%220.8%22/%3E%3C/svg%3E') 12 12, crosshair"
                      : "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2224%22 height=%2224%22 viewBox=%220 0 24 24%22%3E%3Ccircle cx=%2212%22 cy=%2212%22 r=%228%22 fill=%22%23ef4444%22 fill-opacity=%220.8%22/%3E%3C/svg%3E') 12 12, crosshair",
                  }}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                />
                <canvas
                  ref={maskCanvasRef}
                  className="pointer-events-none absolute left-0 top-0 opacity-0"
                  aria-hidden
                />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:w-1/2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">扣图预览</p>
              <p className="text-xs text-muted-foreground">
                右侧展示实时透明背景效果
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDownload}
                disabled={exporting}
                className="gap-1"
              >
                <Download className="h-4 w-4" />
                下载PNG
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleConfirm}
                disabled={exporting}
              >
                {exporting ? "生成中..." : "确认使用"}
              </Button>
            </div>
          </div>

          <div
            className="rounded-xl border p-4"
            style={{
              backgroundImage: `url(${checkerboardBg})`,
              backgroundSize: "16px 16px",
            }}
          >
            {previewSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewSrc} alt="扣图预览" className="w-full h-auto" />
            ) : (
              <div
                className="w-full flex items-center justify-center text-muted-foreground text-sm"
                style={{
                  aspectRatio:
                    dimensions.displayWidth / dimensions.displayHeight || 1,
                }}
              >
                涂抹后预览将在此显示
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

ImageCutoutEditor.displayName = "ImageCutoutEditor";
