import React, { useEffect, useState } from 'react';
import { Eye, Search, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { Order, OrderStatus } from '../../types';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';

const AdminOrdersManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<number | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [searchQuery, statusFilter, orders]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const ordersData = await adminService.getAllOrders();
      setOrders(ordersData);
    } catch (err: any) {
      console.error('Failed to fetch orders:', err);
      setError(err.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((o) => o.status === statusFilter);
    }

    // Filter by search query (order ID or customer)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (o) =>
          o.orderID.toString().includes(query) ||
          o.customer?.name.toLowerCase().includes(query) ||
          o.customer?.email.toLowerCase().includes(query)
      );
    }

    setFilteredOrders(filtered);
  };

  const getStatusBadge = (status: OrderStatus) => {
    const statusConfig = {
      [OrderStatus.Pending]: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
      [OrderStatus.Processing]: { label: 'Processing', color: 'bg-blue-100 text-blue-800' },
      [OrderStatus.Shipped]: { label: 'Shipped', color: 'bg-purple-100 text-purple-800' },
      [OrderStatus.Delivered]: { label: 'Delivered', color: 'bg-green-100 text-green-800' },
      [OrderStatus.Cancelled]: { label: 'Cancelled', color: 'bg-red-100 text-red-800' },
      [OrderStatus.Completed]: { label: 'Completed', color: 'bg-green-100 text-green-800' },
    };

    const config = statusConfig[status] || { label: 'Unknown', color: 'bg-gray-100 text-gray-800' };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Order Management</h1>
        <p className="text-muted-foreground">
          View and manage all customer orders ({orders.length} total)
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-destructive/10 text-destructive px-6 py-4 rounded-lg flex items-center gap-3 mb-6">
          <AlertCircle className="h-5 w-5" />
          <div>
            <h3 className="font-semibold">Error</h3>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by order ID or customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="all">All Statuses</option>
          <option value={OrderStatus.Pending}>Pending</option>
          <option value={OrderStatus.Processing}>Processing</option>
          <option value={OrderStatus.Shipped}>Shipped</option>
          <option value={OrderStatus.Delivered}>Delivered</option>
          <option value={OrderStatus.Cancelled}>Cancelled</option>
          <option value={OrderStatus.Completed}>Completed</option>
        </select>
      </div>

      {/* Orders Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Order ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Customer</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Total</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-right text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.orderID} className="hover:bg-muted/50">
                    <td className="px-6 py-4 font-medium">#{order.orderID}</td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium">{order.customer?.name || 'Unknown'}</div>
                        <div className="text-sm text-muted-foreground">{order.customer?.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {new Date(order.orderDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 font-medium">${order.totalAmount.toFixed(2)}</td>
                    <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm" asChild className="">
                        <Link to={`/admin/orders/${order.orderID}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    {searchQuery || statusFilter !== 'all'
                      ? 'No orders found matching your filters'
                      : 'No orders available'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Summary */}
      {filteredOrders.length > 0 && (
        <div className="mt-4 text-sm text-muted-foreground">
          Showing {filteredOrders.length} of {orders.length} orders
        </div>
      )}
    </div>
  );
};

export default AdminOrdersManagement;
