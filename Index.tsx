import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { ProductCard, Product, ProductFlavor } from "@/components/ProductCard";
import { ProductDetailsModal } from "@/components/ProductDetailsModal";
import { CategoryFilter, Category } from "@/components/CategoryFilter";
import { Cart, CartItem } from "@/components/Cart";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Tag, Truck, Clock, Shield } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";
import vapePod1 from "@/assets/vape-pod-1.jpg";
import vapePod2 from "@/assets/vape-pod-2.jpg";
import vapePod3 from "@/assets/vape-pod-3.jpg";

// Mock data - em produção viria do backend
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Pod Disposable Premium",
    category: "Frutados",
    basePrice: 25.90,
    originalPrice: 32.90,
    image: vapePod1,
    description: "Pod descartável premium com 600 puffs",
    rating: 4.8,
    reviewCount: 156,
    isPromo: true,
    flavors: [
      { id: "1-1", name: "Morango Kiwi", inStock: true },
      { id: "1-2", name: "Frutas Vermelhas", inStock: true },
      { id: "1-3", name: "Uva Ice", inStock: false }
    ]
  },
  {
    id: "2",
    name: "Pod Ultra Smooth",
    category: "Mentolados",
    basePrice: 28.90,
    image: vapePod2,
    description: "Sabor intenso e refrescante",
    rating: 4.9,
    reviewCount: 243,
    flavors: [
      { id: "2-1", name: "Menta Gelada", inStock: true },
      { id: "2-2", name: "Ice Mint", inStock: true }
    ]
  },
  {
    id: "3",
    name: "Pod Berry Mix",
    category: "Frutados",
    basePrice: 26.90,
    originalPrice: 34.90,
    image: vapePod3,
    description: "Mix exclusivo de frutas vermelhas",
    rating: 4.7,
    reviewCount: 89,
    isPromo: true,
    flavors: [
      { id: "3-1", name: "Berry Mix", inStock: true },
      { id: "3-2", name: "Tropical Berry", inStock: true },
      { id: "3-3", name: "Wild Berry", inStock: false }
    ]
  },
  {
    id: "4",
    name: "Pod Classic",
    category: "Frutados",
    basePrice: 22.90,
    image: vapePod1,
    description: "Pod descartável clássico",
    rating: 4.6,
    reviewCount: 134,
    flavors: [
      { id: "4-1", name: "Maçã Verde", inStock: true },
      { id: "4-2", name: "Banana", inStock: true },
      { id: "4-3", name: "Manga", inStock: true }
    ]
  },
  {
    id: "5",
    name: "Pod Ice Series",
    category: "Mentolados",
    basePrice: 29.90,
    originalPrice: 35.90,
    image: vapePod2,
    description: "Série especial gelada",
    rating: 4.8,
    reviewCount: 98,
    isPromo: true,
    flavors: [
      { id: "5-1", name: "Limão Ice", inStock: true },
      { id: "5-2", name: "Maracujá Ice", inStock: false }
    ]
  }
];

const mockCategories: Category[] = [
  { id: "frutados", name: "Frutados", count: 6 },
  { id: "mentolados", name: "Mentolados", count: 3 },
  { id: "doces", name: "Doces", count: 2 },
  { id: "premium", name: "Premium", count: 4 }
];

const MINIMUM_ORDER = 299.90;

const Index = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>("vape-cart", []);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // Filtrar produtos
  const filteredProducts = useMemo(() => {
    return mockProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.flavors.some(flavor => 
                             flavor.name.toLowerCase().includes(searchQuery.toLowerCase())
                           );
      
      const matchesCategory = selectedCategories.length === 0 ||
                             selectedCategories.some(cat => 
                               product.category.toLowerCase().includes(cat.toLowerCase())
                             );
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategories]);

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleAddToCart = (product: Product, flavor: ProductFlavor, quantity: number) => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(
        item => item.product.id === product.id && item.flavor.id === flavor.id
      );
      
      if (quantity === 0) {
        // Remove item
        return prev.filter(item => !(item.product.id === product.id && item.flavor.id === flavor.id));
      }
      
      if (existingIndex >= 0) {
        // Update existing item
        const newItems = [...prev];
        newItems[existingIndex] = { ...newItems[existingIndex], quantity };
        return newItems;
      } else {
        // Add new item
        return [...prev, { product, flavor, quantity }];
      }
    });

    toast({
      title: "Produto adicionado!",
      description: `${product.name} - ${flavor.name} foi adicionado ao carrinho.`,
    });
  };

  const handleUpdateCartQuantity = (productId: string, flavorId: string, quantity: number) => {
    if (quantity === 0) {
      setCartItems(prev => prev.filter(item => 
        !(item.product.id === productId && item.flavor.id === flavorId)
      ));
    } else {
      setCartItems(prev => 
        prev.map(item => 
          (item.product.id === productId && item.flavor.id === flavorId)
            ? { ...item, quantity }
            : item
        )
      );
    }
  };

  const handleRemoveFromCart = (productId: string, flavorId: string) => {
    setCartItems(prev => prev.filter(item => 
      !(item.product.id === productId && item.flavor.id === flavorId)
    ));
    toast({
      title: "Produto removido",
      description: "Item removido do carrinho.",
    });
  };

  const handleCheckout = () => {
    // Implementar checkout - por enquanto só mostra toast
    toast({
      title: "Redirecionando para checkout...",
      description: "Finalizando seu pedido.",
    });
    setIsCartOpen(false);
  };


  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header 
        cartItemsCount={totalCartItems}
        onSearchChange={setSearchQuery}
        onCartClick={() => setIsCartOpen(true)}
      />

      {/* Hero Banner */}
      <section className="relative overflow-hidden">
        <div 
          className="h-64 md:h-80 bg-cover bg-center gradient-hero"
          style={{ backgroundImage: `url(${heroBanner})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/60 to-transparent" />
          <div className="relative container mx-auto px-4 h-full flex items-center">
            <div className="max-w-2xl text-white">
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                Pods Premium
                <span className="block text-accent-glow">No Atacado</span>
              </h1>
              <p className="text-lg md:text-xl mb-6 text-white/90">
                Os melhores sabores com preços especiais para revenda
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Badge className="bg-accent text-accent-foreground text-lg px-4 py-2">
                  <Tag className="mr-2 h-4 w-4" />
                  Pedido mínimo: R$ {MINIMUM_ORDER.toFixed(2)}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Truck, title: "Frete Grátis", desc: "Acima de R$ 499" },
              { icon: Clock, title: "Entrega Rápida", desc: "2-3 dias úteis" },
              { icon: Shield, title: "Garantia", desc: "Produtos originais" },
              { icon: Tag, title: "Atacado", desc: "Preços especiais" }
            ].map((feature, i) => (
              <Card key={i} className="text-center p-4 hover:shadow-card transition-smooth">
                <CardContent className="p-0">
                  <feature.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-semibold text-sm">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Categories Filter */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Categorias</h2>
          <CategoryFilter
            categories={mockCategories}
            selectedCategories={selectedCategories}
            onCategoryToggle={handleCategoryToggle}
            onClearAll={() => setSelectedCategories([])}
          />
        </section>

        {/* Products Grid */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              Produtos {searchQuery && `para "${searchQuery}"`}
            </h2>
            <span className="text-sm text-muted-foreground">
              {filteredProducts.length} produtos encontrados
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">Nenhum produto encontrado</h3>
              <p className="text-muted-foreground">
                Tente ajustar os filtros ou buscar por outros termos
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategories([]);
                }}
                className="mt-4"
              >
                Limpar filtros
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={handleProductClick}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Cart */}
      <Cart
        items={cartItems}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={(productId, quantity) => {
          // Para manter compatibilidade, vamos assumir que é o primeiro flavor do produto
          const item = cartItems.find(item => item.product.id === productId);
          if (item) {
            handleUpdateCartQuantity(productId, item.flavor.id, quantity);
          }
        }}
        onRemoveItem={(productId) => {
          // Para manter compatibilidade, vamos assumir que é o primeiro flavor do produto
          const item = cartItems.find(item => item.product.id === productId);
          if (item) {
            handleRemoveFromCart(productId, item.flavor.id);
          }
        }}
        onCheckout={handleCheckout}
        minimumOrder={MINIMUM_ORDER}
      />

      {/* Product Details Modal */}
      <ProductDetailsModal
        product={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
};

export default Index;