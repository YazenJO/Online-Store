using System;

namespace OnlineStore.Models
{
    public class ImageDTO
    {
        public ImageDTO(int? imageid, string imageurl, int productid, short? imageorder)
        {
            this.ImageID = imageid;
            this.ImageURL = imageurl;
            this.ProductID = productid;
            this.ImageOrder = imageorder;
        }

        public int? ImageID { get; set; }
        public string ImageURL { get; set; }
        public int ProductID { get; set; }
        public short? ImageOrder { get; set; }
    }
}
