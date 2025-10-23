namespace OnlineStore.Models
{
    /// <summary>
    /// DTO for Order Items - Uses composite key (OrderID + ProductID)
    /// </summary>
    public class OrderItemDTO
    {
        public OrderItemDTO(int orderid, int productid, int quantity, decimal price, decimal totalitemsprice)
        {
            this.OrderID = orderid;
            this.ProductID = productid;
            this.Quantity = quantity;
            this.Price = price;
            this.TotalItemsPrice = totalitemsprice;
        }

        // Composite Primary Key
        public int OrderID { get; set; }
        public int ProductID { get; set; }
        
        // Item Details
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public decimal TotalItemsPrice { get; set; }
    }
}
