using System;

namespace OnlineStore.Models
{
    public class ShippingDTO
    {
        public ShippingDTO(int? shippingid, int orderid, string carriername, string trackingnumber, short? shippingstatus, DateTime? estimateddeliverydate, DateTime? actualdeliverydate)
        {
            this.ShippingID = shippingid;
            this.OrderID = orderid;
            this.CarrierName = carriername;
            this.TrackingNumber = trackingnumber;
            this.ShippingStatus = shippingstatus;
            this.EstimatedDeliveryDate = estimateddeliverydate;
            this.ActualDeliveryDate = actualdeliverydate;
        }

        public int? ShippingID { get; set; }
        public int OrderID { get; set; }
        public string CarrierName { get; set; }
        public string TrackingNumber { get; set; }
        public short? ShippingStatus { get; set; }
        public DateTime? EstimatedDeliveryDate { get; set; }
        public DateTime? ActualDeliveryDate { get; set; }
    }
}
