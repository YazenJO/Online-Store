using System;

namespace OnlineStore.Models
{
    public class ReviewDTO
    {
        public ReviewDTO(int? reviewid, int productid, int customerid, string reviewtext, decimal? rating, DateTime? reviewdate)
        {
            this.ReviewID = reviewid;
            this.ProductID = productid;
            this.CustomerID = customerid;
            this.ReviewText = reviewtext;
            this.Rating = rating;
            this.ReviewDate = reviewdate;
        }

        public int? ReviewID { get; set; }
        public int ProductID { get; set; }
        public int CustomerID { get; set; }
        public string ReviewText { get; set; }
        public decimal? Rating { get; set; }
        public DateTime? ReviewDate { get; set; }
    }
}
