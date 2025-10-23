using System;
using System.Data;
using OnlineStore.Models;
using OnlineStore.DAL;

namespace OnlineStore.BLL
{
    public class Shipping
    {
        public enum enMode { AddNew = 0, Update = 1 };
        public enMode Mode = enMode.AddNew;

        public ShippingDTO ShippingDTO
        {
            get { return new ShippingDTO(ShippingID = this.ShippingID, OrderID = this.OrderID, CarrierName = this.CarrierName, TrackingNumber = this.TrackingNumber, ShippingStatus = this.ShippingStatus, EstimatedDeliveryDate = this.EstimatedDeliveryDate, ActualDeliveryDate = this.ActualDeliveryDate); }
        }

        public int? ShippingID { set; get; }
        public int OrderID { set; get; }
        public string CarrierName { set; get; }
        public string TrackingNumber { set; get; }
        public short? ShippingStatus { set; get; }
        public DateTime? EstimatedDeliveryDate { set; get; }
        public DateTime? ActualDeliveryDate { set; get; }

        public Shipping(ShippingDTO ShippingDTO, enMode cMode = enMode.AddNew)
        {
            this.ShippingID = ShippingDTO.ShippingID;
            this.OrderID = ShippingDTO.OrderID;
            this.CarrierName = ShippingDTO.CarrierName;
            this.TrackingNumber = ShippingDTO.TrackingNumber;
            this.ShippingStatus = ShippingDTO.ShippingStatus;
            this.EstimatedDeliveryDate = ShippingDTO.EstimatedDeliveryDate;
            this.ActualDeliveryDate = ShippingDTO.ActualDeliveryDate;
            Mode = cMode;
        }

        private bool _AddNewShipping()
        {
            this.ShippingID = (int?)ShippingData.AddShipping(ShippingDTO);
            return (this.ShippingID != -1);
        }

        private bool _UpdateShipping()
        {
            return ShippingData.UpdateShipping(ShippingDTO);
        }

        public static Shipping Find(int? ShippingID)
        {
            ShippingDTO ShippingDTO = ShippingData.GetShippingByID(ShippingID);

            if (ShippingDTO != null)
                return new Shipping(ShippingDTO, enMode.Update);
            else
                return null;
        }

        public bool Save()
        {
            switch (Mode)
            {
                case enMode.AddNew:
                    if (_AddNewShipping())
                    {
                        Mode = enMode.Update;
                        return true;
                    }
                    else
                    {
                        return false;
                    }

                case enMode.Update:
                    return _UpdateShipping();
            }
            return false;
        }
        public static bool DeleteShipping(int? ShippingID)
            => ShippingData.DeleteShipping(ShippingID);
        public static bool DoesShippingExist(int? ShippingID)
            => ShippingData.DoesShippingExist(ShippingID);
        public static DataTable GetAllShippings()
            => ShippingData.GetAllShippings();
    }
}
