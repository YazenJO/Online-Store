using System;
using System.Data;
using OnlineStore.Models;
using OnlineStore.DAL;

namespace OnlineStore.BLL
{
    public class Review
    {
        public enum enMode { AddNew = 0, Update = 1 };
        public enMode Mode = enMode.AddNew;

        public ReviewDTO ReviewDTO
        {
            get { return new ReviewDTO(ReviewID = this.ReviewID, ProductID = this.ProductID, CustomerID = this.CustomerID, ReviewText = this.ReviewText, Rating = this.Rating, ReviewDate = this.ReviewDate); }
        }

        public int? ReviewID { set; get; }
        public int ProductID { set; get; }
        public int CustomerID { set; get; }
        public string ReviewText { set; get; }
        public decimal? Rating { set; get; }
        public DateTime? ReviewDate { set; get; }

        public Review(ReviewDTO ReviewDTO, enMode cMode = enMode.AddNew)
        {
            this.ReviewID = ReviewDTO.ReviewID;
            this.ProductID = ReviewDTO.ProductID;
            this.CustomerID = ReviewDTO.CustomerID;
            this.ReviewText = ReviewDTO.ReviewText;
            this.Rating = ReviewDTO.Rating;
            this.ReviewDate = ReviewDTO.ReviewDate;
            Mode = cMode;
        }

        private bool _AddNewReview()
        {
            this.ReviewID = (int?)ReviewData.AddReview(ReviewDTO);
            return (this.ReviewID != -1);
        }

        private bool _UpdateReview()
        {
            return ReviewData.UpdateReview(ReviewDTO);
        }

        public static Review Find(int? ReviewID)
        {
            ReviewDTO ReviewDTO = ReviewData.GetReviewByID(ReviewID);

            if (ReviewDTO != null)
                return new Review(ReviewDTO, enMode.Update);
            else
                return null;
        }

        public bool Save()
        {
            switch (Mode)
            {
                case enMode.AddNew:
                    if (_AddNewReview())
                    {
                        Mode = enMode.Update;
                        return true;
                    }
                    else
                    {
                        return false;
                    }

                case enMode.Update:
                    return _UpdateReview();
            }
            return false;
        }
        public static bool DeleteReview(int? ReviewID)
            => ReviewData.DeleteReview(ReviewID);
        public static bool DoesReviewExist(int? ReviewID)
            => ReviewData.DoesReviewExist(ReviewID);
        public static DataTable GetAllReviews()
            => ReviewData.GetAllReviews();
        public static DataTable GetReviewsByProductId(int productId)
            => ReviewData.GetReviewsByProductId(productId);
    }
}
