using System;

namespace OnlineStore.Models
{
    /// <summary>
    /// Order Status Values
    /// </summary>
    public enum OrderStatus : short
    {
        /// <summary>
        /// Order has been placed but not yet processed
        /// </summary>
        Pending = 1,

        /// <summary>
        /// Order is being prepared/processed
        /// </summary>
        Processing = 2,

        /// <summary>
        /// Order has been shipped to customer
        /// </summary>
        Shipped = 3,

        /// <summary>
        /// Order has been delivered to customer
        /// </summary>
        Delivered = 4,

        /// <summary>
        /// Order has been cancelled by customer or admin
        /// </summary>
        Cancelled = 5,

        /// <summary>
        /// Order has been completed successfully
        /// </summary>
        Completed = 6
    }

    public class OrderDTO
    {
        public OrderDTO(int? orderid, int customerid, DateTime? orderdate, decimal totalamount, short? status)
        {
            this.OrderID = orderid;
            this.CustomerID = customerid;
            this.OrderDate = orderdate;
            this.TotalAmount = totalamount;
            this.Status = status;
        }

        /// <summary>
        /// Unique identifier for the order (auto-generated)
        /// </summary>
        public int? OrderID { get; set; }

        /// <summary>
        /// ID of the customer who placed the order
        /// </summary>
        public int CustomerID { get; set; }

        /// <summary>
        /// Date and time when the order was placed
        /// </summary>
        public DateTime? OrderDate { get; set; }

        /// <summary>
        /// Total amount for the order (sum of all order items)
        /// </summary>
        public decimal TotalAmount { get; set; }

        /// <summary>
        /// Current status of the order
        /// Values:
        /// 1 = Pending (default)
        /// 2 = Processing
        /// 3 = Shipped
        /// 4 = Delivered
        /// 5 = Cancelled
        /// 6 = Completed
        /// </summary>
        public short? Status { get; set; }

        /// <summary>
        /// Gets the status as a readable string
        /// </summary>
        public string StatusText
        {
            get
            {
                if (!Status.HasValue)
                    return "Unknown";

                return Status.Value switch
                {
                    1 => "Pending",
                    2 => "Processing",
                    3 => "Shipped",
                    4 => "Delivered",
                    5 => "Cancelled",
                    6 => "Completed",
                    _ => "Unknown"
                };
            }
        }

        /// <summary>
        /// Gets the status as the OrderStatus enum
        /// </summary>
        public OrderStatus OrderStatusEnum
        {
            get
            {
                if (!Status.HasValue)
                    return OrderStatus.Pending;

                return (OrderStatus)Status.Value;
            }
        }
    }
}
