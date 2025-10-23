using System;

namespace OnlineStore.Models
{
    public class PaymentDTO
    {
        public PaymentDTO(int? paymentid, int orderid, decimal amount, string paymentmethod, DateTime? transactiondate)
        {
            this.PaymentID = paymentid;
            this.OrderID = orderid;
            this.Amount = amount;
            this.PaymentMethod = paymentmethod;
            this.TransactionDate = transactiondate;
        }

        public int? PaymentID { get; set; }
        public int OrderID { get; set; }
        public decimal Amount { get; set; }
        public string PaymentMethod { get; set; }
        public DateTime? TransactionDate { get; set; }
    }
}
