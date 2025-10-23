using OnlineStore.Models;
using System.Collections.Generic;

namespace OnlineStoreAPI.DTOs
{
    /// <summary>
    /// Response DTO containing complete order information including payment and shipping details
    /// Note: OrderItems use composite key (OrderID + ProductID), no OrderItemID
    /// </summary>
    public class CompleteOrderResponseDTO
    {
        public OrderDTO Order { get; set; }
        public List<OrderItemDTO> OrderItems { get; set; } = new List<OrderItemDTO>();
        public PaymentDTO Payment { get; set; }
        public ShippingDTO Shipping { get; set; }
        public string Message { get; set; }
        public bool Success { get; set; }
    }
}
