import { ShoppingCart, Plus, Minus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Product, ProductFlavor } from "./ProductCard";

export interface CartItem {
  product: Product;
  flavor: ProductFlavor;
  quantity: number;
}

interface CartProps {
  items: CartItem[];
  isOpen: boolean;
  onClose: () => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
  minimumOrder: number;
}

export function Cart({ 
  items, 
  isOpen, 
  onClose, 
  onUpdateQuantity, 
  onRemoveItem, 
  onCheckout,
  minimumOrder = 299.90 
}: CartProps) {
  const total = items.reduce((sum, item) => sum + (item.product.basePrice * item.quantity), 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const canCheckout = total >= minimumOrder;
  const remainingForMinimum = Math.max(0, minimumOrder - total);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background shadow-2xl">
        <Card className="h-full rounded-none border-0">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="h-5 w-5" />
                <CardTitle>Carrinho</CardTitle>
                {totalItems > 0 && (
                  <Badge variant="default" className="gradient-primary text-white">
                    {totalItems}
                  </Badge>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex h-full flex-col p-0">
            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">Carrinho vazio</h3>
                <p className="text-sm text-muted-foreground">
                  Adicione produtos para começar seu pedido
                </p>
              </div>
            ) : (
              <>
                {/* Items List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex items-center space-x-3 p-3 rounded-lg border bg-card">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-12 w-12 rounded-md object-cover"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">
                          {item.product.name}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Sabor: {item.flavor.name}
                        </p>
                        <p className="text-sm font-semibold text-primary">
                          R$ {item.product.basePrice.toFixed(2)}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="h-7 w-7"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        
                        <span className="w-8 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="h-7 w-7"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onRemoveItem(item.product.id)}
                          className="h-7 w-7 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="border-t p-4 space-y-4">
                  {/* Minimum Order Alert */}
                  {!canCheckout && (
                    <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800">
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        <strong>Pedido mínimo:</strong> R$ {minimumOrder.toFixed(2)}
                      </p>
                      <p className="text-xs text-yellow-700 dark:text-yellow-300">
                        Adicione mais R$ {remainingForMinimum.toFixed(2)} para finalizar
                      </p>
                    </div>
                  )}

                  {/* Total */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Subtotal:</span>
                      <span className="font-bold text-lg">R$ {total.toFixed(2)}</span>
                    </div>
                    
                    {canCheckout && (
                      <p className="text-xs text-muted-foreground">
                        🎉 Parabéns! Você atingiu o pedido mínimo
                      </p>
                    )}
                  </div>

                  <Separator />

                  {/* Checkout Button */}
                  <Button
                    onClick={onCheckout}
                    disabled={!canCheckout}
                    className="w-full gradient-primary text-white transition-smooth hover:shadow-glow disabled:opacity-50"
                    size="lg"
                  >
                    {canCheckout ? "Finalizar Pedido" : `Mínimo R$ ${minimumOrder.toFixed(2)}`}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}