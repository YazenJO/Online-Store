import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Package, Truck, CreditCard, XCircle } from 'lucide-react';
import { Order, OrderStatus, ShippingStatus, OrderItem, Shipping } from '../types';
import { orderService } from '../services/orderService';
import { Button } from '../components/ui/button';

const OrderDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [shipping, setShipping] = useState<Shipping | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    if (!id) return;
    try {
      const orderData = await orderService.getOrderById(parseInt(id));
      setOrder(orderData);

      // Fetch order items
      const items = await orderService.getOrderItems(parseInt(id));
      setOrderItems(items);

      // Fetch shipping info
      try {
        const shippingData = await orderService.getOrderShipping(parseInt(id));
        setShipping(shippingData);
      } catch (err) {
        console.log('No shipping info available');
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order || !id) return;
    
    if (!window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      return;
    }
    
    try {
      setCancelling(true);
      // Update order status to Cancelled
      await orderService.updateOrderStatus(parseInt(id), OrderStatus.Cancelled);
      // Refresh order details
      await fetchOrderDetails();
      alert('Order cancelled successfully!');
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Failed to cancel order. Please try again.');
    } finally {
      setCancelling(false);
    }
  };  const getOrderStatusLabel = (status: OrderStatus): string => {
    const labels: Record<OrderStatus, string> = {
      [OrderStatus.Pending]: 'Pending',
      [OrderStatus.Processing]: 'Processing',
      [OrderStatus.Shipped]: 'Shipped',
      [OrderStatus.Delivered]: 'Delivered',
      [OrderStatus.Cancelled]: 'Cancelled',
      [OrderStatus.Completed]: 'Completed',
    };
    return labels[status] || 'Unknown';
  };

  const getShippingStatusLabel = (status: ShippingStatus): string => {
    const labels: Record<ShippingStatus, string> = {
      [ShippingStatus.Processing]: 'Processing',
      [ShippingStatus.OutForDelivery]: 'Out for Delivery',
      [ShippingStatus.Delivered]: 'Delivered',
      [ShippingStatus.ReturnToSender]: 'Return to Sender',
      [ShippingStatus.OnHold]: 'On Hold',
      [ShippingStatus.Delayed]: 'Delayed',
      [ShippingStatus.Lost]: 'Lost',
    };
    return labels[status] || 'Unknown';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-8" />
          <div className="space-y-4">
            <div className="h-64 bg-muted rounded-lg" />
            <div className="h-48 bg-muted rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-xl text-center">Order not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-2">Order #{order.orderID}</h1>
      <p className="text-muted-foreground mb-8">
        Placed on {new Date(order.orderDate).toLocaleDateString()}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Order Items</h2>
            </div>

            <div className="space-y-4">
              {orderItems.map((item) => (
                <div key={item.productID} className="flex gap-4 pb-4 border-b last:border-0">
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.product?.productName || `Product #${item.productID}`}</h3>
                    <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                    <p className="text-sm text-muted-foreground">
                      Price: ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${item.totalItemsPrice.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Information */}
          {shipping && (
            <div className="bg-card rounded-lg border p-6">
              <div className="flex items-center gap-2 mb-4">
                <Truck className="h-5 w-5" />
                <h2 className="text-xl font-semibold">Shipping Information</h2>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Carrier:</span>
                  <span className="font-semibold">{shipping.carrierName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tracking Number:</span>
                  <span className="font-semibold">{shipping.trackingNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-semibold">
                    {getShippingStatusLabel(shipping.shippingStatus)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estimated Delivery:</span>
                  <span className="font-semibold">
                    {new Date(shipping.estimatedDeliveryDate).toLocaleDateString()}
                  </span>
                </div>
                {shipping.actualDeliveryDate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Actual Delivery:</span>
                    <span className="font-semibold">
                      {new Date(shipping.actualDeliveryDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Payment Information */}
          {order.payment && (
            <div className="bg-card rounded-lg border p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="h-5 w-5" />
                <h2 className="text-xl font-semibold">Payment Information</h2>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method:</span>
                  <span className="font-semibold">{order.payment.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount Paid:</span>
                  <span className="font-semibold">${order.payment.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transaction Date:</span>
                  <span className="font-semibold">
                    {new Date(order.payment.transactionDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg border p-6 sticky top-20">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className="font-semibold">{getOrderStatusLabel(order.status)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-semibold">${order.totalAmount.toFixed(2)}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg">
                  <span className="font-bold">Total:</span>
                  <span className="font-bold">${order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Cancel Order Button - Only show if order is not already cancelled or completed */}
            {order.status !== OrderStatus.Cancelled && 
             order.status !== OrderStatus.Delivered && 
             order.status !== OrderStatus.Completed && (
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={handleCancelOrder}
                disabled={cancelling}
              >
                <XCircle className="h-4 w-4 mr-2" />
                {cancelling ? 'Cancelling...' : 'Cancel Order'}
              </Button>
            )}

            {/* Order Cancelled Message */}
            {order.status === OrderStatus.Cancelled && (
              <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-center">
                <XCircle className="h-5 w-5 mx-auto mb-2" />
                <p className="font-semibold">Order Cancelled</p>
                <p className="text-sm">This order has been cancelled</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;

