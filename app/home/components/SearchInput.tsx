"use client";

import { Search } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchInput = ({
  value,
  onChange,
  placeholder = "搜索标签关键词",
}: SearchInputProps) => {
  return (
    <div className="flex-1 min-w-[200px] max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="search"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-md border bg-background pl-9 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
    </div>
  );
};
