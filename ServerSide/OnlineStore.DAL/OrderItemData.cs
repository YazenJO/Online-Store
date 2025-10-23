using System;
using System.Data;
using Microsoft.Data.SqlClient;
using OnlineStore.Models;

namespace OnlineStore.DAL
{
    public class OrderItemData
    {
        /// <summary>
        /// Gets a single order item by composite key (OrderID + ProductID)
        /// </summary>
        public static OrderItemDTO GetOrderItemByID(int OrderID, int ProductID)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
                {
                    using (SqlCommand command = new SqlCommand("SP_GetOrderItemByID", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@OrderID", OrderID);
                        command.Parameters.AddWithValue("@ProductID", ProductID);

                        connection.Open();

                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                return new OrderItemDTO
                                (
                                    reader.GetInt32(reader.GetOrdinal("OrderID")),
                                    reader.GetInt32(reader.GetOrdinal("ProductID")),
                                    reader.GetInt32(reader.GetOrdinal("Quantity")),
                                    reader.GetDecimal(reader.GetOrdinal("Price")),
                                    reader.GetDecimal(reader.GetOrdinal("TotalItemsPrice"))
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

        /// <summary>
        /// Gets all order items for a specific order
        /// </summary>
        public static DataTable GetOrderItemsByOrderID(int OrderID)
        {
            DataTable dt = new DataTable();

            try
            {
                using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
                {
                    using (SqlCommand command = new SqlCommand("SP_GetOrderItemsByOrderID", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@OrderID", OrderID);

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

        /// <summary>
        /// Adds a new order item - returns true if successful
        /// </summary>
        public static bool AddOrderItem(OrderItemDTO OrderItemDTO)
        {
            try
            {
                using (var connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
                using (var command = new SqlCommand("SP_AddOrderItem", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.AddWithValue("@OrderID", OrderItemDTO.OrderID);
                    command.Parameters.AddWithValue("@ProductID", OrderItemDTO.ProductID);
                    command.Parameters.AddWithValue("@Quantity", OrderItemDTO.Quantity);
                    command.Parameters.AddWithValue("@Price", OrderItemDTO.Price);
                    command.Parameters.AddWithValue("@TotalItemsPrice", OrderItemDTO.TotalItemsPrice);

                    connection.Open();
                    object result = command.ExecuteScalar();

                    // Returns 1 for success
                    return result != null && Convert.ToInt32(result) == 1;
                }
            }
            catch (Exception ex)
            {
                // Log exception
                return false;
            }
        }

        /// <summary>
        /// Updates an existing order item
        /// </summary>
        public static bool UpdateOrderItem(OrderItemDTO dto)
        {
            int rowsAffected = 0;

            try
            {
                using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
                {
                    using (SqlCommand command = new SqlCommand("SP_UpdateOrderItem", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.AddWithValue("@OrderID", dto.OrderID);
                        command.Parameters.AddWithValue("@ProductID", dto.ProductID);
                        command.Parameters.AddWithValue("@Quantity", dto.Quantity);
                        command.Parameters.AddWithValue("@Price", dto.Price);
                        command.Parameters.AddWithValue("@TotalItemsPrice", dto.TotalItemsPrice);

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

        /// <summary>
        /// Deletes a single order item by composite key
        /// </summary>
        public static bool DeleteOrderItem(int OrderID, int ProductID)
        {
            int rowsAffected = 0;

            try
            {
                using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
                {
                    using (SqlCommand command = new SqlCommand("SP_DeleteOrderItem", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@OrderID", OrderID);
                        command.Parameters.AddWithValue("@ProductID", ProductID);

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

        /// <summary>
        /// Deletes all order items for a specific order (used in rollback)
        /// </summary>
        public static bool DeleteOrderItemsByOrderID(int OrderID)
        {
            int rowsAffected = 0;

            try
            {
                using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
                {
                    using (SqlCommand command = new SqlCommand("SP_DeleteOrderItemsByOrderID", connection))
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

        /// <summary>
        /// Checks if an order item exists by composite key
        /// </summary>
        public static bool DoesOrderItemExist(int OrderID, int ProductID)
        {
            bool isFound = false;

            try
            {
                using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
                {
                    using (SqlCommand command = new SqlCommand("SP_DoesOrderItemExist", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@OrderID", OrderID);
                        command.Parameters.AddWithValue("@ProductID", ProductID);

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

        /// <summary>
        /// Gets all order items (admin use)
        /// </summary>
        public static DataTable GetAllOrderItems()
        {
            DataTable dt = new DataTable();

            try
            {
                using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
                {
                    using (SqlCommand command = new SqlCommand("SP_GetAllOrderItems", connection))
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

        /// <summary>
        /// Updates product stock (reduces or increases)
        /// </summary>
        public static bool UpdateProductStock(int ProductID, int QuantityChange)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
                {
                    using (SqlCommand command = new SqlCommand("SP_UpdateProductStock", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@ProductID", ProductID);
                        command.Parameters.AddWithValue("@QuantityChange", QuantityChange);

                        connection.Open();
                        
                        object result = command.ExecuteScalar();
                        return result != null; // Returns true if stock was updated
                    }
                }
            }
            catch (Exception ex)
            {
                // Log exception
                return false;
            }
        }
    }
}
