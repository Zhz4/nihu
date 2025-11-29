"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { mockProducts } from "./server";
import { SortOptions } from "./components/SortOptions";
import { SearchInput } from "./components/SearchInput";
import { ProductCategories } from "./components/ProductCategories";
import { SceneCategories } from "./components/SceneCategories";
import { UploadDialog, UploadDialogRef } from "./components/UploadDialog";
import { CutoutDialog } from "./components/CutoutDialog";

const Home = () => {
  const [selectedSort, setSelectedSort] = useState("smart");
  const [selectedProduct, setSelectedProduct] = useState("全部");
  const [selectedScene, setSelectedScene] = useState("全部");
  const [searchText, setSearchText] = useState("");
  const uploadDialogRef = useRef<UploadDialogRef>(null);
  const [cutoutImage, setCutoutImage] = useState<string | null>(null);
  const [cutoutOpen, setCutoutOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* 场景参考图 标题 */}
        <h1 className="text-2xl font-bold mb-6">场景参考图</h1>

        {/* 排序和搜索栏 */}
        <div className="flex items-center gap-4 mb-6 flex-wrap">
          <SortOptions
            selectedSort={selectedSort}
            onSortChange={setSelectedSort}
          />
          <SearchInput value={searchText} onChange={setSearchText} />
        </div>

        {/* 商品分类 */}
        <ProductCategories
          selectedProduct={selectedProduct}
          onProductChange={setSelectedProduct}
        />

        {/* 场景分类 */}
        <SceneCategories
          selectedScene={selectedScene}
          onSceneChange={setSelectedScene}
        />

        {/* 商品网格 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {mockProducts.map((product) => (
            <div
              key={product.id}
              className="group relative overflow-hidden rounded-lg border bg-card hover:shadow-lg transition-all cursor-pointer"
              onClick={() => {
                uploadDialogRef.current?.open(product.name);
              }}
            >
              {/* 商品图片 */}
              <div className="aspect-square relative overflow-hidden bg-muted">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* 悬浮时显示的小图标 */}
                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded-md p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Image
                    src={product.image}
                    width={400}
                    height={400}
                    alt=""
                    className="w-10 h-10 object-cover rounded"
                  />
                </div>
              </div>

              {/* 商品名称 */}
              <div className="p-3">
                <p className="text-sm font-medium text-center truncate">
                  {product.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 上传商品图弹窗 */}
      <UploadDialog
        ref={uploadDialogRef}
        onStartCutout={(image) => {
          setCutoutImage(image);
          setCutoutOpen(true);
        }}
      />
      <CutoutDialog
        key={cutoutImage ?? "cutout-dialog"}
        open={cutoutOpen && !!cutoutImage}
        image={cutoutImage}
        onOpenChange={(isOpen) => {
          setCutoutOpen(isOpen);
          if (!isOpen) {
            setCutoutImage(null);
          }
        }}
      />
    </div>
  );
};

export default Home;
