import { Button } from "@/components/ui/button";

interface CategoriesProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
  label: string;
}

const Categories = ({
  selectedCategory,
  onCategoryChange,
  categories,
  label,
}: CategoriesProps) => {
  return (
    <div className="mb-4">
      <div className="flex items-start gap-2">
        <span className="text-sm text-muted-foreground whitespace-nowrap pt-1.5">
          {label}:
        </span>
        <div className="flex flex-wrap gap-2">
          {categories.map((category: string) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => onCategoryChange(category)}
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

export default Categories;
