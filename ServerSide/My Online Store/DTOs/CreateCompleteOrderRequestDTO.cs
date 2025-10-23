namespace OnlineStoreAPI.DTOs
{
    /// <summary>
    /// Request DTO for creating a complete order with payment and shipping information
    /// </summary>
    public class CreateCompleteOrderRequestDTO
    {
        // Customer Information
        public int CustomerID { get; set; }

        // Order Items (Products in the order)
        public List<OrderItemRequestDTO> Items { get; set; } = new List<OrderItemRequestDTO>();

        // Payment Information
        public string PaymentMethod { get; set; } // e.g., "CreditCard", "PayPal", "Cash"
        
        // Shipping Information
        public string ShippingAddress { get; set; }
        public string CarrierName { get; set; } // e.g., "FedEx", "UPS", "DHL"
        public DateTime? EstimatedDeliveryDate { get; set; }

        // Order Information
        // Note: TotalAmount will be calculated from Items, not sent by client (security)
        public short? OrderStatus { get; set; } // Optional: defaults to 1 (Pending)
    }
}
