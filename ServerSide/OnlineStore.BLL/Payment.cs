using System;
using System.Data;
using OnlineStore.Models;
using OnlineStore.DAL;

namespace OnlineStore.BLL
{
    public class Payment
    {
        public enum enMode { AddNew = 0, Update = 1 };
        public enMode Mode = enMode.AddNew;

        public PaymentDTO PaymentDTO
        {
            get { return new PaymentDTO(PaymentID = this.PaymentID, OrderID = this.OrderID, Amount = this.Amount, PaymentMethod = this.PaymentMethod, TransactionDate = this.TransactionDate); }
        }

        public int? PaymentID { set; get; }
        public int OrderID { set; get; }
        public decimal Amount { set; get; }
        public string PaymentMethod { set; get; }
        public DateTime? TransactionDate { set; get; }

        public Payment(PaymentDTO PaymentDTO, enMode cMode = enMode.AddNew)
        {
            this.PaymentID = PaymentDTO.PaymentID;
            this.OrderID = PaymentDTO.OrderID;
            this.Amount = PaymentDTO.Amount;
            this.PaymentMethod = PaymentDTO.PaymentMethod;
            this.TransactionDate = PaymentDTO.TransactionDate;
            Mode = cMode;
        }

        private bool _AddNewPayment()
        {
            this.PaymentID = (int?)PaymentData.AddPayment(PaymentDTO);
            return (this.PaymentID != -1);
        }

        private bool _UpdatePayment()
        {
            return PaymentData.UpdatePayment(PaymentDTO);
        }

        public static Payment Find(int? PaymentID)
        {
            PaymentDTO PaymentDTO = PaymentData.GetPaymentByID(PaymentID);

            if (PaymentDTO != null)
                return new Payment(PaymentDTO, enMode.Update);
            else
                return null;
        }

        public bool Save()
        {
            switch (Mode)
            {
                case enMode.AddNew:
                    if (_AddNewPayment())
                    {
                        Mode = enMode.Update;
                        return true;
                    }
                    else
                    {
                        return false;
                    }

                case enMode.Update:
                    return _UpdatePayment();
            }
            return false;
        }
        public static bool DeletePayment(int? PaymentID)
            => PaymentData.DeletePayment(PaymentID);
        public static bool DoesPaymentExist(int? PaymentID)
            => PaymentData.DoesPaymentExist(PaymentID);
        public static DataTable GetAllPayments()
            => PaymentData.GetAllPayments();
    }
}
