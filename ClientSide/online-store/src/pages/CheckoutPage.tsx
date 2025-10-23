import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { orderService } from '../services/orderService';
import { CreateOrderRequest, OrderStatus } from '../types';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

const CheckoutPage: React.FC = () => {
  const { items, getTotalPrice, clearCart } = useCart();
  const { customer } = useAuth();
  const navigate = useNavigate();

  const [shippingInfo, setShippingInfo] = useState({
    carrierName: 'FedEx',
    shippingAddress: customer?.address || '',
  });

  const [paymentInfo, setPaymentInfo] = useState({
    paymentMethod: 'CreditCard',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!customer) {
      setError('Please login to place an order');
      setLoading(false);
      return;
    }

    try {
      // Calculate estimated delivery date (7 days from now)
      const estimatedDeliveryDate = new Date();
      estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 7);

      const orderData: CreateOrderRequest = {
        customerID: customer.customerID,
        items: items.map((item) => ({
          productID: item.product.productID,
          quantity: item.quantity,
        })),
        paymentMethod: paymentInfo.paymentMethod,
        shippingAddress: shippingInfo.shippingAddress || customer.address || '',
        carrierName: shippingInfo.carrierName,
        estimatedDeliveryDate: estimatedDeliveryDate.toISOString(),
        orderStatus: OrderStatus.Pending,
      };

      const response = await orderService.createCompleteOrder(orderData);
      clearCart();
      navigate(`/orders/${response.order.orderID}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Checkout</h1>

      <form onSubmit={handlePlaceOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            <div className="bg-card rounded-lg border p-6">
              <div className="flex items-center gap-2 mb-4">
                <Truck className="h-5 w-5" />
                <h2 className="text-xl font-semibold">Shipping Information</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="shippingAddress">Shipping Address</Label>
                  <Input 
                    id="shippingAddress"
                    value={shippingInfo.shippingAddress}
                    onChange={(e) =>
                      setShippingInfo({ ...shippingInfo, shippingAddress: e.target.value })
                    }
                    placeholder="123 Main St, City, State 12345"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="carrier">Carrier / Shipping Method</Label>
                  <select
                    id="carrier"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={shippingInfo.carrierName}
                    onChange={(e) =>
                      setShippingInfo({ ...shippingInfo, carrierName: e.target.value })
                    }
                  >
                    <option value="FedEx">FedEx (5-7 days)</option>
                    <option value="UPS">UPS (5-7 days)</option>
                    <option value="DHL">DHL Express (2-3 days)</option>
                    <option value="USPS">USPS (7-10 days)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-card rounded-lg border p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="h-5 w-5" />
                <h2 className="text-xl font-semibold">Payment Information</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <select
                    id="paymentMethod"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={paymentInfo.paymentMethod}
                    onChange={(e) =>
                      setPaymentInfo({ ...paymentInfo, paymentMethod: e.target.value })
                    }
                  >
                    <option value="CreditCard">Credit Card</option>
                    <option value="DebitCard">Debit Card</option>
                    <option value="PayPal">PayPal</option>
                    <option value="Cash">Cash on Delivery</option>
                  </select>
                </div>

                {(paymentInfo.paymentMethod === 'CreditCard' ||
                  paymentInfo.paymentMethod === 'DebitCard') && (
                  <>
                    <div>
                      <Label htmlFor="cardName">Cardholder Name</Label>
                      <Input
                        id="cardName"
                        value={paymentInfo.cardName}
                        onChange={(e) =>
                          setPaymentInfo({ ...paymentInfo, cardName: e.target.value })
                        }
                        required
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        value={paymentInfo.cardNumber}
                        onChange={(e) =>
                          setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })
                        }
                        required
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          value={paymentInfo.expiryDate}
                          onChange={(e) =>
                            setPaymentInfo({ ...paymentInfo, expiryDate: e.target.value })
                          }
                          required
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          value={paymentInfo.cvv}
                          onChange={(e) =>
                            setPaymentInfo({ ...paymentInfo, cvv: e.target.value })
                          }
                          required
                          placeholder="123"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg border p-6 sticky top-20">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.product.productID} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.product.productName} x {item.quantity}
                    </span>
                    <span className="font-semibold">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}

                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg">
                    <span className="font-bold">Total</span>
                    <span className="font-bold">${getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md mb-4 text-sm">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? 'Processing...' : 'Place Order'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;

