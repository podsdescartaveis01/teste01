import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

export interface Category {
  id: string;
  name: string;
  count: number;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategories: string[];
  onCategoryToggle: (categoryId: string) => void;
  onClearAll: () => void;
}

export function CategoryFilter({
  categories,
  selectedCategories,
  onCategoryToggle,
  onClearAll
}: CategoryFilterProps) {
  const hasActiveFilters = selectedCategories.length > 0;

  return (
    <div className="space-y-4">
      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Filtros ativos:</span>
          {selectedCategories.map((categoryId) => {
            const category = categories.find(c => c.id === categoryId);
            if (!category) return null;
            
            return (
              <Badge
                key={categoryId}
                variant="default"
                className="gradient-primary text-white cursor-pointer transition-smooth hover:shadow-glow"
                onClick={() => onCategoryToggle(categoryId)}
              >
                {category.name}
                <X className="ml-1 h-3 w-3" />
              </Badge>
            );
          })}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="text-muted-foreground hover:text-foreground"
          >
            Limpar filtros
          </Button>
        </div>
      )}

      {/* Category Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {categories.map((category) => {
          const isSelected = selectedCategories.includes(category.id);
          
          return (
            <Button
              key={category.id}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => onCategoryToggle(category.id)}
              className={`
                justify-between transition-smooth
                ${isSelected 
                  ? "gradient-primary text-white shadow-glow border-transparent" 
                  : "hover:border-primary/50 hover:bg-primary/5"
                }
              `}
            >
              <span className="truncate">{category.name}</span>
              <Badge
                variant={isSelected ? "secondary" : "outline"}
                className={`ml-1 text-xs ${isSelected ? "bg-white/20 text-white border-white/30" : ""}`}
              >
                {category.count}
              </Badge>
            </Button>
          );
        })}
      </div>
    </div>
  );
}