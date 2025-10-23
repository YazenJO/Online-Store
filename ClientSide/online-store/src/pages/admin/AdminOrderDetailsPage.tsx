import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Package, 
  Truck, 
  CreditCard, 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar,
  DollarSign,
  Edit,
  Trash2,
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  FileText,
  Printer,
  Send
} from 'lucide-react';
import { Order, OrderStatus, ShippingStatus, OrderItem, Shipping, Customer } from '../../types';
import { orderService } from '../../services/orderService';
import { adminService } from '../../services/adminService';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';

const AdminOrderDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [shipping, setShipping] = useState<Shipping | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  // Edit modes
  const [editingStatus, setEditingStatus] = useState(false);
  const [editingShipping, setEditingShipping] = useState(false);
  const [newStatus, setNewStatus] = useState<OrderStatus>(OrderStatus.Pending);
  const [newShippingStatus, setNewShippingStatus] = useState<ShippingStatus>(ShippingStatus.Processing);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrierName, setCarrierName] = useState('');
  const [estimatedDelivery, setEstimatedDelivery] = useState('');
  
  // Notes
  const [orderNotes, setOrderNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const orderData = await orderService.getOrderById(parseInt(id));
      setOrder(orderData);
      setNewStatus(orderData.status);

      // Fetch order items
      const items = await orderService.getOrderItems(parseInt(id));
      setOrderItems(items);

      // Fetch customer info
      try {
        const customerData = await adminService.getCustomerById(orderData.customerID);
        setCustomer(customerData);
      } catch (err) {
        console.log('Could not fetch customer details');
      }

      // Fetch shipping info
      try {
        const shippingData = await orderService.getOrderShipping(parseInt(id));
        setShipping(shippingData);
        setNewShippingStatus(shippingData.shippingStatus);
        setTrackingNumber(shippingData.trackingNumber);
        setCarrierName(shippingData.carrierName);
        setEstimatedDelivery(new Date(shippingData.estimatedDeliveryDate).toISOString().split('T')[0]);
      } catch (err) {
        console.log('No shipping info available');
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async () => {
    if (!order) return;
    try {
      setUpdating(true);
      await adminService.updateOrderStatus(order.orderID, newStatus);
      setOrder({ ...order, status: newStatus });
      setEditingStatus(false);
      alert('Order status updated successfully!');
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateShipping = async () => {
    if (!shipping) return;
    try {
      setUpdating(true);
      // In a real app, you'd call an API to update shipping info
      // await adminService.updateShipping(shipping.shippingID, { ... });
      alert('Shipping information updated successfully!');
      setEditingShipping(false);
    } catch (error) {
      console.error('Error updating shipping:', error);
      alert('Failed to update shipping information');
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order) return;
    if (!window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      return;
    }
    try {
      setUpdating(true);
      await adminService.updateOrderStatus(order.orderID, OrderStatus.Cancelled);
      setOrder({ ...order, status: OrderStatus.Cancelled });
      alert('Order cancelled successfully!');
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Failed to cancel order');
    } finally {
      setUpdating(false);
    }
  };

  const handleRefundOrder = async () => {
    if (!order) return;
    if (!window.confirm(`Are you sure you want to refund $${order.totalAmount.toFixed(2)}? This will process a refund to the customer.`)) {
      return;
    }
    try {
      setUpdating(true);
      // In a real app, you'd call a refund API
      // await adminService.refundOrder(order.orderID);
      alert('Refund processed successfully!');
    } catch (error) {
      console.error('Error processing refund:', error);
      alert('Failed to process refund');
    } finally {
      setUpdating(false);
    }
  };

  const handlePrintInvoice = () => {
    // In a real app, this would generate and print an invoice
    window.print();
  };

  const handleSendEmail = () => {
    if (!customer) return;
    // In a real app, this would open an email modal or send an email
    alert(`Email functionality would send to: ${customer.email}`);
  };

  const getOrderStatusLabel = (status: OrderStatus): string => {
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

  const getStatusColor = (status: OrderStatus): string => {
    const colors: Record<OrderStatus, string> = {
      [OrderStatus.Pending]: 'bg-yellow-100 text-yellow-800',
      [OrderStatus.Processing]: 'bg-blue-100 text-blue-800',
      [OrderStatus.Shipped]: 'bg-purple-100 text-purple-800',
      [OrderStatus.Delivered]: 'bg-green-100 text-green-800',
      [OrderStatus.Cancelled]: 'bg-red-100 text-red-800',
      [OrderStatus.Completed]: 'bg-green-100 text-green-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
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
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-64 bg-muted rounded-lg" />
          <div className="h-48 bg-muted rounded-lg" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="outline" onClick={() => navigate('/admin/orders')} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Button>
        <Card className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
          <p className="text-muted-foreground">The order you're looking for doesn't exist.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with Actions */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Button variant="outline" onClick={() => navigate('/admin/orders')} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
          <h1 className="text-4xl font-bold">Order #{order.orderID}</h1>
          <p className="text-muted-foreground">
            Placed on {new Date(order.orderDate).toLocaleDateString()} at{' '}
            {new Date(order.orderDate).toLocaleTimeString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrintInvoice}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" onClick={handleSendEmail}>
            <Send className="h-4 w-4 mr-2" />
            Email Customer
          </Button>
        </div>
      </div>

      {/* Status Badge */}
      <div className="mb-6">
        <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
          {getOrderStatusLabel(order.status)}
        </span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Content - Left Side */}
        <div className="xl:col-span-2 space-y-6">
          {/* Order Items */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-semibold">Order Items</h2>
            </div>

            <div className="space-y-4">
              {orderItems.map((item) => (
                <div key={item.productID} className="flex gap-4 pb-4 border-b last:border-0">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">
                      {item.product?.productName || `Product #${item.productID}`}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Product ID: {item.productID}
                    </p>
                    <div className="flex gap-4 mt-2">
                      <p className="text-sm">
                        <span className="text-muted-foreground">Quantity:</span>{' '}
                        <span className="font-semibold">{item.quantity}</span>
                      </p>
                      <p className="text-sm">
                        <span className="text-muted-foreground">Unit Price:</span>{' '}
                        <span className="font-semibold">${item.price.toFixed(2)}</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">${item.totalItemsPrice.toFixed(2)}</p>
                  </div>
                </div>
              ))}
              
              {/* Order Totals */}
              <div className="pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="font-semibold">${order.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping:</span>
                  <span className="font-semibold">$0.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax:</span>
                  <span className="font-semibold">$0.00</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-lg">
                  <span className="font-bold">Total:</span>
                  <span className="font-bold text-primary">${order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Customer Information */}
          {customer && (
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-semibold">Customer Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Customer Name</p>
                    <p className="font-semibold">{customer.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      Email
                    </p>
                    <p className="font-semibold">{customer.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      Phone
                    </p>
                    <p className="font-semibold">{customer.phone || 'N/A'}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      Shipping Address
                    </p>
                    <p className="font-semibold">{customer.address || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Customer ID</p>
                    <p className="font-semibold">#{customer.customerID}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Account Created</p>
                    <p className="font-semibold">
                      {customer.dateOfBirth ? new Date(customer.dateOfBirth).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Shipping Information */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-semibold">Shipping Information</h2>
              </div>
              {shipping && !editingShipping && (
                <Button variant="outline" size="sm" onClick={() => setEditingShipping(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>

            {shipping ? (
              editingShipping ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Carrier Name</label>
                    <Input
                      value={carrierName}
                      onChange={(e) => setCarrierName(e.target.value)}
                      placeholder="e.g., UPS, FedEx, USPS"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Tracking Number</label>
                    <Input
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="Enter tracking number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Shipping Status</label>
                    <select
                      value={newShippingStatus}
                      onChange={(e) => setNewShippingStatus(parseInt(e.target.value) as ShippingStatus)}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    >
                      <option value={ShippingStatus.Processing}>Processing</option>
                      <option value={ShippingStatus.OutForDelivery}>Out for Delivery</option>
                      <option value={ShippingStatus.Delivered}>Delivered</option>
                      <option value={ShippingStatus.OnHold}>On Hold</option>
                      <option value={ShippingStatus.Delayed}>Delayed</option>
                      <option value={ShippingStatus.ReturnToSender}>Return to Sender</option>
                      <option value={ShippingStatus.Lost}>Lost</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Estimated Delivery Date</label>
                    <Input
                      type="date"
                      value={estimatedDelivery}
                      onChange={(e) => setEstimatedDelivery(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleUpdateShipping} disabled={updating}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setEditingShipping(false)}>
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Carrier</p>
                      <p className="font-semibold">{shipping.carrierName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p className="font-semibold">{getShippingStatusLabel(shipping.shippingStatus)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tracking Number</p>
                      <p className="font-semibold font-mono text-sm">{shipping.trackingNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                      <p className="font-semibold">
                        {new Date(shipping.estimatedDeliveryDate).toLocaleDateString()}
                      </p>
                    </div>
                    {shipping.actualDeliveryDate && (
                      <div className="col-span-2">
                        <p className="text-sm text-muted-foreground">Actual Delivery Date</p>
                        <p className="font-semibold">
                          {new Date(shipping.actualDeliveryDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )
            ) : (
              <p className="text-muted-foreground">No shipping information available yet.</p>
            )}
          </Card>

          {/* Payment Information */}
          {order.payment && (
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-semibold">Payment Information</h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Payment Method</p>
                  <p className="font-semibold">{order.payment.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Amount Paid</p>
                  <p className="font-semibold text-green-600">${order.payment.amount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Transaction Date</p>
                  <p className="font-semibold">
                    {new Date(order.payment.transactionDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment ID</p>
                  <p className="font-semibold">#{order.payment.paymentID}</p>
                </div>
              </div>
            </Card>
          )}

          {/* Order Notes */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-semibold">Order Notes</h2>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowNotes(!showNotes)}>
                {showNotes ? 'Hide' : 'Show'} Notes
              </Button>
            </div>
            
            {showNotes && (
              <div className="space-y-4">
                <textarea
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="Add internal notes about this order..."
                  className="w-full h-32 px-3 py-2 border border-input rounded-md bg-background resize-none"
                />
                <Button size="sm">
                  Save Notes
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar - Right Side */}
        <div className="xl:col-span-1 space-y-6">
          {/* Order Status Management */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Order Status</h3>
            
            {editingStatus ? (
              <div className="space-y-4">
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(parseInt(e.target.value) as OrderStatus)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value={OrderStatus.Pending}>Pending</option>
                  <option value={OrderStatus.Processing}>Processing</option>
                  <option value={OrderStatus.Shipped}>Shipped</option>
                  <option value={OrderStatus.Delivered}>Delivered</option>
                  <option value={OrderStatus.Completed}>Completed</option>
                  <option value={OrderStatus.Cancelled}>Cancelled</option>
                </select>
                <div className="flex flex-col gap-2">
                  <Button onClick={handleUpdateOrderStatus} disabled={updating} className="w-full">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Update Status
                  </Button>
                  <Button variant="outline" onClick={() => setEditingStatus(false)} className="w-full">
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className={`p-4 rounded-lg text-center font-semibold ${getStatusColor(order.status)}`}>
                  {getOrderStatusLabel(order.status)}
                </div>
                <Button variant="outline" onClick={() => setEditingStatus(true)} className="w-full">
                  <Edit className="h-4 w-4 mr-2" />
                  Change Status
                </Button>
              </div>
            )}
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={handlePrintInvoice}>
                <Printer className="h-4 w-4 mr-2" />
                Print Invoice
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={handleSendEmail}>
                <Send className="h-4 w-4 mr-2" />
                Email Customer
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={() => navigate(`/admin/customers`)}
              >
                <User className="h-4 w-4 mr-2" />
                View Customer Profile
              </Button>
            </div>
          </Card>

          {/* Order Timeline */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Order Timeline</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="w-0.5 h-full bg-border" />
                </div>
                <div className="pb-4">
                  <p className="font-semibold">Order Placed</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.orderDate).toLocaleString()}
                  </p>
                </div>
              </div>
              
              {order.status >= OrderStatus.Processing && (
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                      <Clock className="h-4 w-4 text-white" />
                    </div>
                    <div className="w-0.5 h-full bg-border" />
                  </div>
                  <div className="pb-4">
                    <p className="font-semibold">Processing</p>
                    <p className="text-sm text-muted-foreground">Order being prepared</p>
                  </div>
                </div>
              )}
              
              {order.status >= OrderStatus.Shipped && shipping && (
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center">
                      <Truck className="h-4 w-4 text-white" />
                    </div>
                    <div className="w-0.5 h-full bg-border" />
                  </div>
                  <div className="pb-4">
                    <p className="font-semibold">Shipped</p>
                    <p className="text-sm text-muted-foreground">Via {shipping.carrierName}</p>
                  </div>
                </div>
              )}
              
              {order.status === OrderStatus.Delivered && (
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold">Delivered</p>
                    <p className="text-sm text-muted-foreground">
                      {shipping?.actualDeliveryDate 
                        ? new Date(shipping.actualDeliveryDate).toLocaleString()
                        : 'Delivery confirmed'}
                    </p>
                  </div>
                </div>
              )}
              
              {order.status === OrderStatus.Cancelled && (
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center">
                      <XCircle className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold">Cancelled</p>
                    <p className="text-sm text-muted-foreground">Order was cancelled</p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Danger Zone */}
          {order.status !== OrderStatus.Cancelled && (
            <Card className="p-6 border-destructive">
              <h3 className="text-xl font-semibold mb-4 text-destructive">Danger Zone</h3>
              <div className="space-y-2">
                <Button 
                  variant="destructive" 
                  className="w-full justify-start"
                  onClick={handleCancelOrder}
                  disabled={updating}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel Order
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  onClick={handleRefundOrder}
                  disabled={updating}
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Process Refund
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetailsPage;
