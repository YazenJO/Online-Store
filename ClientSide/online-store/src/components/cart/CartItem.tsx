import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '../../types';
import { Button } from '../ui/button';
import { useCart } from '../../contexts/CartContext';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const imageUrl = item.product.images && item.product.images.length > 0
    ? item.product.images[0].imageURL
    : 'https://via.placeholder.com/100x100?text=No+Image';

  return (
    <div className="flex gap-4 py-4 border-b">
      {/* Product Image */}
      <img
        src={imageUrl}
        alt={item.product.productName}
        className="w-24 h-24 object-cover rounded-md"
      />

      {/* Product Details */}
      <div className="flex-1">
        <h3 className="font-semibold">{item.product.productName}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{item.product.description}</p>
        <p className="text-lg font-bold mt-2">${item.product.price.toFixed(2)}</p>
      </div>

      {/* Quantity Controls */}
      <div className="flex flex-col items-end justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => removeFromCart(item.product.productID)}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => updateQuantity(item.product.productID, item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-8 text-center font-semibold">{item.quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => updateQuantity(item.product.productID, item.quantity + 1)}
            disabled={item.quantity >= item.product.quantityInStock}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>

        <p className="font-bold text-lg">
          ${(item.product.price * item.quantity).toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default CartItem;

