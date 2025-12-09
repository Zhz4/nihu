"use client";

import { useRef, useState } from "react";
import { SortOptions } from "./components/SortOptions";
import { SearchInput } from "./components/SearchInput";
import Categories from "./components/Categories";
import Products from "./components/Products";
import UploadDialog from "./components/UploadDialog";

const Home = () => {
  const [selectedSort, setSelectedSort] = useState("smart");
  const [selectedProduct, setSelectedProduct] = useState("全部");
  const [selectedScene, setSelectedScene] = useState("全部");
  const [searchText, setSearchText] = useState("");
  const productCategories = [
    "全部",
    "日用百货",
    "家居家装",
    "服饰箱包",
    "美妆个护",
    "家用电器",
    "玩具类目",
    "儿童 & 母婴",
    "3C数码",
    "办公用品",
    "运动户外",
    "工艺/艺术品",
    "宠物用品",
    "食品饮料",
    "医药保健/护理",
    "汽车用品",
    "其他",
  ];
  const sceneCategories = [
    "全部",
    "室内",
    "室外",
    "节日活动",
    "简单背景",
    "工作场所",
  ];
  const uploadDialogRef = useRef<{ open: () => void; close: () => void }>(null);
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">场景参考图</h1>

        <div className="flex items-center gap-4 mb-6 flex-wrap">
          <SortOptions
            selectedSort={selectedSort}
            onSortChange={setSelectedSort}
          />
          <SearchInput value={searchText} onChange={setSearchText} />
        </div>

        <Categories
          selectedCategory={selectedProduct}
          onCategoryChange={setSelectedProduct}
          categories={productCategories}
          label="商品"
        />

        <Categories
          selectedCategory={selectedScene}
          onCategoryChange={setSelectedScene}
          categories={sceneCategories}
          label="场景"
        />

        <Products uploadDialogRef={uploadDialogRef} />

        <UploadDialog ref={uploadDialogRef} />
      </div>
    </div>
  );
};

export default Home;
