"use client";

import { Button } from "@/components/ui/button";

// 排序选项
const sortOptions = [
  { label: "智能推荐", value: "smart" },
  { label: "按收藏时间", value: "time" },
  { label: "按素材热度", value: "hot" },
];

interface SortOptionsProps {
  selectedSort: string;
  onSortChange: (value: string) => void;
}

export const SortOptions = ({
  selectedSort,
  onSortChange,
}: SortOptionsProps) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">排序:</span>
      <div className="flex gap-2">
        {sortOptions.map((option) => (
          <Button
            key={option.value}
            variant={selectedSort === option.value ? "default" : "outline"}
            size="sm"
            onClick={() => onSortChange(option.value)}
            className="rounded-md"
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
};
