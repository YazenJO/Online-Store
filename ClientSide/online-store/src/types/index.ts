// Database entity types based on the schema

export interface Customer {
  customerID: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  username: string;
  password?: string;
  role: string; // "Customer" or "Admin"
}

export interface ProductCategory {
  categoryID: number;
  categoryName: string;
  description?: string;
}

export interface ProductCatalog {
  productID: number;
  productName: string;
  description: string;
  price: number;
  quantityInStock: number;
  categoryID: number;
  category?: ProductCategory;
  images?: ProductImage[];
}

export interface ProductImage {
  imageID: number;
  imageURL: string;
  productID: number;
  imageOrder: number;
}

export interface Order {
  orderID: number;
  customerID: number;
  orderDate: string;
  totalAmount: number;
  status: OrderStatus;
  statusText?: string; // Server provides status as text
  customer?: Customer;
  items?: OrderItem[];
  shipping?: Shipping;
  payment?: Payment;
}

export interface OrderItem {
  orderID: number;
  productID: number;
  quantity: number;
  price: number;
  totalItemsPrice: number;
  product?: ProductCatalog;
}

export interface Payment {
  paymentID: number;
  orderID: number;
  amount: number;
  paymentMethod: string;
  transactionDate: string;
}

export interface Shipping {
  shippingID: number;
  orderID: number;
  carrierName: string;
  trackingNumber: string;
  shippingStatus: ShippingStatus;
  estimatedDeliveryDate: string;
  actualDeliveryDate?: string;
}

export interface Review {
  reviewID: number;
  productID: number;
  customerID: number;
  reviewText: string;
  rating: number;
  reviewDate: string;
  customer?: Customer;
}

// Enums for status fields (matching backend API)
export enum OrderStatus {
  Pending = 1,
  Processing = 2,
  Shipped = 3,
  Delivered = 4,
  Cancelled = 5,
  Completed = 6,
}

export enum ShippingStatus {
  Processing = 1,
  OutForDelivery = 2,
  Delivered = 3,
  ReturnToSender = 4,
  OnHold = 5,
  Delayed = 6,
  Lost = 7,
}

// Helper types for forms and API requests
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  username: string;
  password: string;
}

// Complete order request matching backend /api/orders/complete endpoint
export interface CreateOrderRequest {
  customerID: number;
  items: {
    productID: number;
    quantity: number;
  }[];
  paymentMethod: string; // "CreditCard", "DebitCard", "PayPal", "Cash"
  shippingAddress: string;
  carrierName: string; // "FedEx", "UPS", "DHL", etc.
  estimatedDeliveryDate?: string;
  orderStatus?: OrderStatus;
}

// Response from /api/orders/complete endpoint
export interface CompleteOrderResponse {
  success: boolean;
  message: string;
  order: Order;
  orderItems: OrderItem[];
  payment: Payment;
  shipping: Shipping;
}

export interface CreateReviewRequest {
  productID: number;
  customerID: number;
  reviewText: string;
  rating: number;
}

// Cart item type for client-side cart management
export interface CartItem {
  product: ProductCatalog;
  quantity: number;
}

// Auth context type
export interface AuthState {
  isAuthenticated: boolean;
  customer: Customer | null;
  login: (username: string, password: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

