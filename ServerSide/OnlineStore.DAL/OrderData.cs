using System;
using System.Data;
using Microsoft.Data.SqlClient;

using OnlineStore.Models;

namespace OnlineStore.DAL
{
    public class OrderData
    {
        public static OrderDTO GetOrderByID(int? OrderID)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
                {
                    using (SqlCommand command = new SqlCommand("SP_GetOrderByID", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@OrderID", OrderID);

                        connection.Open();

                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                return new OrderDTO
                                (
                            reader.GetInt32(reader.GetOrdinal("OrderID")),
                            reader.GetInt32(reader.GetOrdinal("CustomerID")),
                            reader.IsDBNull(reader.GetOrdinal("OrderDate")) ? null : (DateTime?)reader.GetDateTime(reader.GetOrdinal("OrderDate")),
                            reader.GetDecimal(reader.GetOrdinal("TotalAmount")),
                            reader.IsDBNull(reader.GetOrdinal("Status")) ? null : (short?)reader.GetInt16(reader.GetOrdinal("Status"))
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

        public static int AddOrder(OrderDTO OrderDTO)
        {
            using (var connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
            using (var command = new SqlCommand("SP_AddOrder", connection))
            {
                command.CommandType = CommandType.StoredProcedure;

                command.Parameters.AddWithValue("@CustomerID", OrderDTO.CustomerID);
                command.Parameters.AddWithValue("@OrderDate", (object)OrderDTO.OrderDate ?? DBNull.Value);
                command.Parameters.AddWithValue("@TotalAmount", OrderDTO.TotalAmount);
                command.Parameters.AddWithValue("@Status", (object)OrderDTO.Status ?? DBNull.Value);
                var outputIdParam = new SqlParameter("@NewOrderID", SqlDbType.Int)
                {
                    Direction = ParameterDirection.Output
                };
                command.Parameters.Add(outputIdParam);

                connection.Open();
                command.ExecuteNonQuery();

                return (int)outputIdParam.Value;
            }
        }

        public static bool UpdateOrder(OrderDTO dto)
        {
            int rowsAffected = 0;

            try
            {
                using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
                {
                    using (SqlCommand command = new SqlCommand("SP_UpdateOrder", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.AddWithValue("@OrderID", dto.OrderID);
                        command.Parameters.AddWithValue("@CustomerID", dto.CustomerID);
                        command.Parameters.AddWithValue("@OrderDate", (object)dto.OrderDate ?? DBNull.Value);
                        command.Parameters.AddWithValue("@TotalAmount", dto.TotalAmount);
                        command.Parameters.AddWithValue("@Status", (object)dto.Status ?? DBNull.Value);

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

        public static bool DeleteOrder(int? OrderID)
        {
            int rowsAffected = 0;

            try
            {
                using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
                {
                    using (SqlCommand command = new SqlCommand("SP_DeleteOrder", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@OrderID", OrderID);

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

        public static bool DoesOrderExist(int? OrderID)
        {
            bool isFound = false;

            try
            {
                using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
                {
                    using (SqlCommand command = new SqlCommand("SP_DoesOrderExist", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@OrderID", OrderID);

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

        public static DataTable GetAllOrders()
        {
            DataTable dt = new DataTable();

            try
            {
                using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
                {
                    using (SqlCommand command = new SqlCommand("SP_GetAllOrders", connection))
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

        public static DataTable GetOrdersByCustomerID(int CustmerID)
        {
            DataTable dt = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
                {
                    using (SqlCommand command = new SqlCommand("SP_GetOrdersByCustomerID", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@CustomerID", CustmerID);
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
