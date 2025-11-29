"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { mockProducts } from "./server";

// 排序选项
const sortOptions = [
  { label: "智能推荐", value: "smart" },
  { label: "按收藏时间", value: "time" },
  { label: "按素材热度", value: "hot" },
];

// 商品分类
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

// 场景分类
const sceneCategories = [
  "全部",
  "室内",
  "室外",
  "节日活动",
  "简单背景",
  "工作场所",
  "休闲场所",
  "运动场所",
  "自然环境",
  "展台",
  "其他",
];

const Home = () => {
  const [selectedSort, setSelectedSort] = useState("smart");
  const [selectedProduct, setSelectedProduct] = useState("全部");
  const [selectedScene, setSelectedScene] = useState("全部");
  const [searchText, setSearchText] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* 场景参考图 标题 */}
        <h1 className="text-2xl font-bold mb-6">场景参考图</h1>

        {/* 排序和搜索栏 */}
        <div className="flex items-center gap-4 mb-6 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">排序:</span>
            <div className="flex gap-2">
              {sortOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={
                    selectedSort === option.value ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedSort(option.value)}
                  className="rounded-md"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* 搜索框 */}
          <div className="flex-1 min-w-[200px] max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="搜索标签关键词"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full rounded-md border bg-background pl-9 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
        </div>

        {/* 商品分类 */}
        <div className="mb-4">
          <div className="flex items-start gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap pt-1.5">
              商品:
            </span>
            <div className="flex flex-wrap gap-2">
              {productCategories.map((category) => (
                <Button
                  key={category}
                  variant={selectedProduct === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedProduct(category)}
                  className="rounded-md"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* 场景分类 */}
        <div className="mb-6">
          <div className="flex items-start gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap pt-1.5">
              场景:
            </span>
            <div className="flex flex-wrap gap-2">
              {sceneCategories.map((category) => (
                <Button
                  key={category}
                  variant={selectedScene === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedScene(category)}
                  className="rounded-md"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* 商品网格 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {mockProducts.map((product) => (
            <div
              key={product.id}
              className="group relative overflow-hidden rounded-lg border bg-card hover:shadow-lg transition-all cursor-pointer"
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
    </div>
  );
};

export default Home;
