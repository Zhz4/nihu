"use client";

import { Button } from "@/components/ui/button";

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

interface SceneCategoriesProps {
  selectedScene: string;
  onSceneChange: (category: string) => void;
}

export const SceneCategories = ({
  selectedScene,
  onSceneChange,
}: SceneCategoriesProps) => {
  return (
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
              onClick={() => onSceneChange(category)}
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
