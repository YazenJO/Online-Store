import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { ProductCatalog } from '../../types';
import { Button } from '../ui/button';
import { useCart } from '../../contexts/CartContext';

interface ProductCardProps {
  product: ProductCatalog;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
  };

  // Get the first image or use a placeholder
  const imageUrl = product.images && product.images.length > 0 
    ? product.images[0].imageURL 
    : 'https://via.placeholder.com/300x300?text=No+Image';

  return (
    <Link to={`/products/${product.productID}`}>
      <div className="group relative overflow-hidden rounded-lg border bg-card transition-all hover:shadow-lg">
        {/* Product Image */}
        <div className="aspect-square overflow-hidden bg-muted">
          <img
            src={imageUrl}
            alt={product.productName}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1 line-clamp-1">{product.productName}</h3>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">${product.price.toFixed(2)}</p>
              {product.quantityInStock > 0 ? (
                <p className="text-xs text-muted-foreground">In Stock: {product.quantityInStock}</p>
              ) : (
                <p className="text-xs text-destructive">Out of Stock</p>
              )}
            </div>

            <Button
              size="icon"
              onClick={handleAddToCart}
              disabled={product.quantityInStock === 0}
              className="transition-transform hover:scale-110"
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stock Badge */}
        {product.quantityInStock === 0 && (
          <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground px-2 py-1 rounded text-xs font-semibold">
            Out of Stock
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;

