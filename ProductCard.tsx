import { Plus, Minus, Star, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export interface ProductFlavor {
  id: string;
  name: string;
  inStock: boolean;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  originalPrice?: number;
  image: string;
  description?: string;
  flavors: ProductFlavor[];
  rating?: number;
  reviewCount?: number;
  isPromo?: boolean;
}

interface ProductCardProps {
  product: Product;
  onClick?: (product: Product) => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.basePrice) / product.originalPrice) * 100)
    : 0;

  const availableFlavors = product.flavors.filter(f => f.inStock);
  const isAnyFlavorInStock = availableFlavors.length > 0;

  return (
    <Card 
      className="group overflow-hidden transition-smooth hover:shadow-card hover:shadow-glow cursor-pointer"
      onClick={() => onClick?.(product)}
    >
      <div className="relative overflow-hidden">
        {/* Product Image */}
        <div className="aspect-square bg-gradient-subtle relative">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-smooth group-hover:scale-105"
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isPromo && (
              <Badge variant="destructive" className="text-xs">
                <Tag className="mr-1 h-3 w-3" />
                -{discount}%
              </Badge>
            )}
            {!isAnyFlavorInStock && (
              <Badge variant="secondary" className="text-xs">
                Esgotado
              </Badge>
            )}
          </div>

          {/* Rating */}
          {product.rating && (
            <div className="absolute top-2 right-2 flex items-center space-x-1 bg-black/20 backdrop-blur rounded-md px-2 py-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs text-white font-medium">{product.rating}</span>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          {/* Category */}
          <div className="mb-2">
            <Badge variant="secondary" className="text-xs">
              {product.category}
            </Badge>
          </div>

          {/* Product Info */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm leading-tight line-clamp-2">
              {product.name}
            </h3>
            
            <p className="text-sm text-muted-foreground">
              {product.flavors.length} sabor{product.flavors.length > 1 ? 'es' : ''} disponível{product.flavors.length > 1 ? 'is' : ''}
            </p>

            {/* Price */}
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-primary">
                R$ {product.basePrice.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  R$ {product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Reviews */}
            {product.reviewCount && (
              <p className="text-xs text-muted-foreground">
                ({product.reviewCount} avaliações)
              </p>
            )}
          </div>

          {/* View Details Button */}
          <div className="mt-4">
            <Button
              disabled={!isAnyFlavorInStock}
              className="w-full gradient-primary text-white transition-smooth hover:shadow-glow"
            >
              Ver Detalhes
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}