"use client";

import { Button } from "@/components/ui/button";

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

interface ProductCategoriesProps {
  selectedProduct: string;
  onProductChange: (category: string) => void;
}

export const ProductCategories = ({
  selectedProduct,
  onProductChange,
}: ProductCategoriesProps) => {
  return (
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
              onClick={() => onProductChange(category)}
              className="rounded-md"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
