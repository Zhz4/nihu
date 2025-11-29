"use client";

import { useState, useCallback, forwardRef, useImperativeHandle } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Upload, X } from "lucide-react";

export interface UploadDialogRef {
  open: (productName?: string) => void;
  close: () => void;
}

export const UploadDialog = forwardRef<UploadDialogRef>((_, ref) => {
  const [open, setOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  useImperativeHandle(ref, () => ({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    open: (_productName?: string) => {
      setOpen(true);
    },
    close: () => {
      setOpen(false);
      setUploadedImage(null);
    },
  }));

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleFile = (file: File) => {
    // 验证文件类型
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      alert("请上传 jpg、jpeg、png 或 webp 格式的图片");
      return;
    }

    // 创建预览
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        handleFile(e.target.files[0]);
      }
    },
    []
  );

  // 好的示例图片（占位符，实际使用时需要替换为真实图片）
  const goodExamples = [
    { id: 1, src: "/assets/img/productExample1.png", alt: "好的示例1" },
    { id: 2, src: "/assets/img/productExample2.png", alt: "好的示例2" },
    { id: 3, src: "/assets/img/productExample3.png", alt: "好的示例3" },
    { id: 4, src: "/assets/img/productExample4.png", alt: "好的示例4" },
    { id: 5, src: "/assets/img/productExample5.png", alt: "好的示例5" },
    { id: 6, src: "/assets/img/productExample6.png", alt: "好的示例6" },
  ];

  // 不好的示例图片（占位符，实际使用时需要替换为真实图片）
  const badExamples = [
    {
      id: 1,
      src: "/assets/img/uploadExample23.jpg",
      alt: "商品主体太复杂",
      error: "商品主体太复杂",
    },
    {
      id: 2,
      src: "/assets/img/uploadExample24.jpg",
      alt: "场景太复杂",
      error: "场景太复杂",
    },
    {
      id: 3,
      src: "/assets/img/uploadExample35.png",
      alt: "商品主体被遮挡",
      error: "商品主体被遮挡",
    },
    {
      id: 4,
      src: "/assets/img/uploadExample36.png",
      alt: "商品表面阴影过重",
      error: "商品表面阴影过重",
    },
    {
      id: 5,
      src: "/assets/img/uploadExample37.png",
      alt: "网状透视物品",
      error: "网状透视物品",
    },
    {
      id: 6,
      src: "/assets/img/uploadExample38.png",
      alt: "商品半透明",
      error: "商品半透明",
    },
  ];

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setUploadedImage(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl! max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>上传商品图</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 上传区域 */}
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 transition-colors ${
              dragActive
                ? "border-primary bg-primary/5"
                : "border-gray-300 hover:border-primary/50"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileInput}
            />
            <div className="flex flex-col items-center justify-center gap-4">
              {uploadedImage ? (
                <div className="relative w-full max-w-md">
                  <Image
                    src={uploadedImage}
                    alt="上传的图片"
                    width={400}
                    height={400}
                    className="w-full h-auto rounded-lg"
                  />
                  <button
                    onClick={() => setUploadedImage(null)}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <label
                    htmlFor="file-upload"
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
                  >
                    <Upload className="w-5 h-5" />
                    <span>点击此处</span>
                  </label>
                  <p className="text-gray-600">或拖拽「商品图」到此处</p>
                </>
              )}
            </div>
          </div>

          {/* 图片要求说明 */}
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              图片格式:支持jpg、jpeg、png、webp格式,最大: 8192*8192,最大宽高比5
            </p>
            <p>拍摄要求:白底商品图、透明底商品图;不建议场景太复杂的商品图</p>
          </div>

          {/* 好的示例 */}
          <div className="space-y-3">
            <h3 className="text-base font-medium">
              不知道怎么操作吗?试试看以下图片去生成~
            </h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {goodExamples.map((example) => (
                <div
                  key={example.id}
                  className="aspect-square relative rounded-lg overflow-hidden border border-gray-200 cursor-pointer hover:border-primary transition-colors"
                  onClick={() => {
                    // 这里可以添加点击示例图片的逻辑
                    console.log("选择示例图片:", example.id);
                  }}
                >
                  <Image
                    src={example.src}
                    alt={example.alt}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      // 图片加载失败时显示占位符
                      const target = e.target as HTMLImageElement;
                      target.src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23f3f4f6' width='400' height='400'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='14' fill='%239ca3af'%3E示例%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 不好的示例 */}
          <div className="space-y-3">
            <p className="text-red-600 font-medium">
              请勿上传以下错误图片,会极大影响生成效果
            </p>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {badExamples.map((example) => (
                <div
                  key={example.id}
                  className="aspect-square relative rounded-lg overflow-hidden border border-gray-200"
                >
                  <Image
                    src={example.src}
                    alt={example.alt}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      // 图片加载失败时显示占位符
                      const target = e.target as HTMLImageElement;
                      target.src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23f3f4f6' width='400' height='400'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='14' fill='%239ca3af'%3E错误示例%3C/text%3E%3C/svg%3E";
                    }}
                  />
                  {/* 错误标记 */}
                  <div className="absolute top-1 right-1 bg-red-500 rounded-full p-1">
                    <X className="w-3 h-3 text-white" />
                  </div>
                  {/* 错误说明 */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 text-center">
                    {example.error}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});

UploadDialog.displayName = "UploadDialog";
