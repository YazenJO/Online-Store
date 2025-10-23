using System;
using System.Data;
using Microsoft.Data.SqlClient;

using OnlineStore.Models;

namespace OnlineStore.DAL
{
    public class ShippingData
    {
        public static ShippingDTO GetShippingByID(int? ShippingID)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
                {
                    using (SqlCommand command = new SqlCommand("SP_GetShippingByID", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@ShippingID", ShippingID);

                        connection.Open();

                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                return new ShippingDTO
                                (
                            reader.GetInt32(reader.GetOrdinal("ShippingID")),
                            reader.GetInt32(reader.GetOrdinal("OrderID")),
                            reader.IsDBNull(reader.GetOrdinal("CarrierName")) ? null : (string)reader.GetString(reader.GetOrdinal("CarrierName")),
                            reader.IsDBNull(reader.GetOrdinal("TrackingNumber")) ? null : (string)reader.GetString(reader.GetOrdinal("TrackingNumber")),
                            reader.IsDBNull(reader.GetOrdinal("ShippingStatus")) ? null : (short?)reader.GetInt16(reader.GetOrdinal("ShippingStatus")),
                            reader.IsDBNull(reader.GetOrdinal("EstimatedDeliveryDate")) ? null : (DateTime?)reader.GetDateTime(reader.GetOrdinal("EstimatedDeliveryDate")),
                            reader.IsDBNull(reader.GetOrdinal("ActualDeliveryDate")) ? null : (DateTime?)reader.GetDateTime(reader.GetOrdinal("ActualDeliveryDate"))
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

        public static int AddShipping(ShippingDTO ShippingDTO)
        {
            using (var connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
            using (var command = new SqlCommand("SP_AddShipping", connection))
            {
                command.CommandType = CommandType.StoredProcedure;

                command.Parameters.AddWithValue("@OrderID", ShippingDTO.OrderID);
                command.Parameters.AddWithValue("@CarrierName", (object)ShippingDTO.CarrierName ?? DBNull.Value);
                command.Parameters.AddWithValue("@TrackingNumber", (object)ShippingDTO.TrackingNumber ?? DBNull.Value);
                command.Parameters.AddWithValue("@ShippingStatus", (object)ShippingDTO.ShippingStatus ?? DBNull.Value);
                command.Parameters.AddWithValue("@EstimatedDeliveryDate", (object)ShippingDTO.EstimatedDeliveryDate ?? DBNull.Value);
                command.Parameters.AddWithValue("@ActualDeliveryDate", (object)ShippingDTO.ActualDeliveryDate ?? DBNull.Value);
                var outputIdParam = new SqlParameter("@NewShippingID", SqlDbType.Int)
                {
                    Direction = ParameterDirection.Output
                };
                command.Parameters.Add(outputIdParam);

                connection.Open();
                command.ExecuteNonQuery();

                return (int)outputIdParam.Value;
            }
        }

        public static bool UpdateShipping(ShippingDTO dto)
        {
            int rowsAffected = 0;

            try
            {
                using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
                {
                    using (SqlCommand command = new SqlCommand("SP_UpdateShipping", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.AddWithValue("@ShippingID", dto.ShippingID);
                        command.Parameters.AddWithValue("@OrderID", dto.OrderID);
                        command.Parameters.AddWithValue("@CarrierName", (object)dto.CarrierName ?? DBNull.Value);
                        command.Parameters.AddWithValue("@TrackingNumber", (object)dto.TrackingNumber ?? DBNull.Value);
                        command.Parameters.AddWithValue("@ShippingStatus", (object)dto.ShippingStatus ?? DBNull.Value);
                        command.Parameters.AddWithValue("@EstimatedDeliveryDate", (object)dto.EstimatedDeliveryDate ?? DBNull.Value);
                        command.Parameters.AddWithValue("@ActualDeliveryDate", (object)dto.ActualDeliveryDate ?? DBNull.Value);

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

        public static bool DeleteShipping(int? ShippingID)
        {
            int rowsAffected = 0;

            try
            {
                using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
                {
                    using (SqlCommand command = new SqlCommand("SP_DeleteShipping", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@ShippingID", ShippingID);

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

        public static bool DoesShippingExist(int? ShippingID)
        {
            bool isFound = false;

            try
            {
                using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
                {
                    using (SqlCommand command = new SqlCommand("SP_DoesShippingExist", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@ShippingID", ShippingID);

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

        public static DataTable GetAllShippings()
        {
            DataTable dt = new DataTable();

            try
            {
                using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
                {
                    using (SqlCommand command = new SqlCommand("SP_GetAllShippings", connection))
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
    }
}
