using System;
using System.Data;
using Microsoft.Data.SqlClient;

using OnlineStore.Models;

namespace OnlineStore.DAL
{
    public class ReviewData
    {
        public static ReviewDTO GetReviewByID(int? ReviewID)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
                {
                    using (SqlCommand command = new SqlCommand("SP_GetReviewByID", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@ReviewID", ReviewID);

                        connection.Open();

                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                return new ReviewDTO
                                (
                            reader.GetInt32(reader.GetOrdinal("ReviewID")),
                            reader.GetInt32(reader.GetOrdinal("ProductID")),
                            reader.GetInt32(reader.GetOrdinal("CustomerID")),
                            reader.IsDBNull(reader.GetOrdinal("ReviewText")) ? null : (string)reader.GetString(reader.GetOrdinal("ReviewText")),
                            reader.IsDBNull(reader.GetOrdinal("Rating")) ? null : (decimal?)reader.GetDecimal(reader.GetOrdinal("Rating")),
                            reader.IsDBNull(reader.GetOrdinal("ReviewDate")) ? null : (DateTime?)reader.GetDateTime(reader.GetOrdinal("ReviewDate"))
                                );
                            }
                            else
                            {
                                return null;
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                // Log exception
                return null;
            }
        }

        public static int AddReview(ReviewDTO ReviewDTO)
        {
            using (var connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
            using (var command = new SqlCommand("SP_AddReview", connection))
            {
                command.CommandType = CommandType.StoredProcedure;

                command.Parameters.AddWithValue("@ProductID", ReviewDTO.ProductID);
                command.Parameters.AddWithValue("@CustomerID", ReviewDTO.CustomerID);
                command.Parameters.AddWithValue("@ReviewText", (object)ReviewDTO.ReviewText ?? DBNull.Value);
                command.Parameters.AddWithValue("@Rating", (object)ReviewDTO.Rating ?? DBNull.Value);
                command.Parameters.AddWithValue("@ReviewDate", (object)ReviewDTO.ReviewDate ?? DBNull.Value);
                var outputIdParam = new SqlParameter("@NewReviewID", SqlDbType.Int)
                {
                    Direction = ParameterDirection.Output
                };
                command.Parameters.Add(outputIdParam);

                connection.Open();
                command.ExecuteNonQuery();

                return (int)outputIdParam.Value;
            }
        }

        public static bool UpdateReview(ReviewDTO dto)
        {
            int rowsAffected = 0;

            try
            {
                using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
                {
                    using (SqlCommand command = new SqlCommand("SP_UpdateReview", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.AddWithValue("@ReviewID", dto.ReviewID);
                        command.Parameters.AddWithValue("@ProductID", dto.ProductID);
                        command.Parameters.AddWithValue("@CustomerID", dto.CustomerID);
                        command.Parameters.AddWithValue("@ReviewText", (object)dto.ReviewText ?? DBNull.Value);
                        command.Parameters.AddWithValue("@Rating", (object)dto.Rating ?? DBNull.Value);
                        command.Parameters.AddWithValue("@ReviewDate", (object)dto.ReviewDate ?? DBNull.Value);

                        connection.Open();
                        rowsAffected = (int)command.ExecuteScalar();
                    }
                }
            }
            catch (Exception ex)
            {
                // Log exception
                return false;
            }

            return (rowsAffected > 0);
        }

        public static bool DeleteReview(int? ReviewID)
        {
            int rowsAffected = 0;

            try
            {
                using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
                {
                    using (SqlCommand command = new SqlCommand("SP_DeleteReview", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@ReviewID", ReviewID);

                        connection.Open();
                        rowsAffected = (int)command.ExecuteScalar();
                    }
                }
            }
            catch (Exception ex)
            {
                // Log exception
            }

            return (rowsAffected > 0);
        }

        public static bool DoesReviewExist(int? ReviewID)
        {
            bool isFound = false;

            try
            {
                using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
                {
                    using (SqlCommand command = new SqlCommand("SP_DoesReviewExist", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@ReviewID", ReviewID);

                        connection.Open();

                        object result = command.ExecuteScalar();
                        if (result != null && result != DBNull.Value)
                            isFound = (bool)result;
                    }
                }
            }
            catch (Exception ex)
            {
                // Log exception
                isFound = false;
            }

            return isFound;
        }

        public static DataTable GetAllReviews()
        {
            DataTable dt = new DataTable();

            try
            {
                using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
                {
                    using (SqlCommand command = new SqlCommand("SP_GetAllReviews", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        connection.Open();

                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            if (reader.HasRows)
                                dt.Load(reader);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                // Log exception
            }

            return dt;
        }

        public static DataTable GetReviewsByProductId(int productId)
        {
            DataTable dt = new DataTable();

            try
            {
                using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
                {
                    using (SqlCommand command = new SqlCommand("SP_GetReviewsByProductID", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@ProductID", productId);

                        connection.Open();

                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            if (reader.HasRows)
                                dt.Load(reader);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                // Log exception
            }

            return dt;
        }
    }
}
