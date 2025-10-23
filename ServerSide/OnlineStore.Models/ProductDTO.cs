using System;

namespace OnlineStore.Models
{
    public class ProductDTO
    {
        public ProductDTO(int? productid, string productname, string description, decimal price, int quantityinstock, int categoryid)
        {
            this.ProductID = productid;
            this.ProductName = productname;
            this.Description = description;
            this.Price = price;
            this.QuantityInStock = quantityinstock;
            this.CategoryID = categoryid;
        }

        public int? ProductID { get; set; }
        public string ProductName { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public int QuantityInStock { get; set; }
        public int CategoryID { get; set; }
    }
}
