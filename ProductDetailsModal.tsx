import { useState } from "react";
import { Plus, Minus, Star, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Product, ProductFlavor } from "@/components/ProductCard";

interface ProductDetailsModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, flavor: ProductFlavor, quantity: number) => void;
}

export function ProductDetailsModal({ product, isOpen, onClose, onAddToCart }: ProductDetailsModalProps) {
  const [selectedFlavor, setSelectedFlavor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.basePrice) / product.originalPrice) * 100)
    : 0;

  const availableFlavors = product.flavors.filter(f => f.inStock);
  const selectedFlavorObj = product.flavors.find(f => f.id === selectedFlavor);

  const handleAddToCart = () => {
    if (selectedFlavorObj) {
      onAddToCart(product, selectedFlavorObj, quantity);
      onClose();
      setSelectedFlavor("");
      setQuantity(1);
    }
  };

  const handleClose = () => {
    onClose();
    setSelectedFlavor("");
    setQuantity(1);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-left">{product.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Image */}
          <div className="relative">
            <div className="aspect-square bg-gradient-subtle rounded-lg overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>
            
            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {product.isPromo && (
                <Badge variant="destructive" className="text-xs">
                  <Tag className="mr-1 h-3 w-3" />
                  -{discount}%
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

          {/* Product Info */}
          <div className="space-y-4">
            {/* Category */}
            <Badge variant="secondary" className="text-xs">
              {product.category}
            </Badge>

            {/* Description */}
            {product.description && (
              <p className="text-sm text-muted-foreground">
                {product.description}
              </p>
            )}

            {/* Price */}
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-primary">
                R$ {product.basePrice.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  R$ {product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Reviews */}
            {product.reviewCount && (
              <p className="text-sm text-muted-foreground">
                ({product.reviewCount} avaliações)
              </p>
            )}

            {/* Flavor Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Escolha o sabor:</label>
              <Select value={selectedFlavor} onValueChange={setSelectedFlavor}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um sabor" />
                </SelectTrigger>
                <SelectContent>
                  {availableFlavors.map((flavor) => (
                    <SelectItem key={flavor.id} value={flavor.id}>
                      {flavor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Quantity Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Quantidade:</label>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-10 w-10"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                
                <span className="text-lg font-medium min-w-[3rem] text-center">
                  {quantity}
                </span>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                  className="h-10 w-10"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              disabled={!selectedFlavor || availableFlavors.length === 0}
              className="w-full gradient-primary text-white transition-smooth hover:shadow-glow"
            >
              Adicionar ao Carrinho
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}