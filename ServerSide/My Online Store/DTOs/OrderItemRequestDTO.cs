namespace OnlineStoreAPI.DTOs
{
    /// <summary>
    /// Represents a single item in the shopping cart/order
    /// </summary>
    public class OrderItemRequestDTO
    {
        public int ProductID { get; set; }
        public int Quantity { get; set; }
        // Price will be fetched from Product table, not sent by client (security)
    }
}
