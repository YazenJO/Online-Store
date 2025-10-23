using System;
using System.Data;
using Microsoft.Data.SqlClient;
using OnlineStore.Models;

namespace OnlineStore.DAL
{
    public class ProductData
    {
        public static ProductDTO GetProductByID(int? ProductID)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
                {
                    using (SqlCommand command = new SqlCommand("SP_GetProductByID", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@ProductID", ProductID);

                        connection.Open();

                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                return new ProductDTO
                                (
                            reader.GetInt32(reader.GetOrdinal("ProductID")),
                            reader.GetString(reader.GetOrdinal("ProductName")),
                            reader.IsDBNull(reader.GetOrdinal("Description")) ? null : (string)reader.GetString(reader.GetOrdinal("Description")),
                            reader.GetDecimal(reader.GetOrdinal("Price")),
                            reader.GetInt32(reader.GetOrdinal("QuantityInStock")),
                            reader.GetInt32(reader.GetOrdinal("CategoryID"))
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

        public static int AddProduct(ProductDTO ProductDTO)
        {
            using (var connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
            using (var command = new SqlCommand("SP_AddProduct", connection))
            {
                command.CommandType = CommandType.StoredProcedure;

                command.Parameters.AddWithValue("@ProductName", ProductDTO.ProductName);
                command.Parameters.AddWithValue("@Description", (object)ProductDTO.Description ?? DBNull.Value);
                command.Parameters.AddWithValue("@Price", ProductDTO.Price);
                command.Parameters.AddWithValue("@QuantityInStock", ProductDTO.QuantityInStock);
                command.Parameters.AddWithValue("@CategoryID", ProductDTO.CategoryID);
                var outputIdParam = new SqlParameter("@NewProductID", SqlDbType.Int)
                {
                    Direction = ParameterDirection.Output
                };
                command.Parameters.Add(outputIdParam);

                connection.Open();
                command.ExecuteNonQuery();

                return (int)outputIdParam.Value;
            }
        }

        public static bool UpdateProduct(ProductDTO dto)
        {
            int rowsAffected = 0;

            try
            {
                using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
                {
                    using (SqlCommand command = new SqlCommand("SP_UpdateProduct", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.AddWithValue("@ProductID", dto.ProductID);
                        command.Parameters.AddWithValue("@ProductName", dto.ProductName);
                        command.Parameters.AddWithValue("@Description", (object)dto.Description ?? DBNull.Value);
                        command.Parameters.AddWithValue("@Price", dto.Price);
                        command.Parameters.AddWithValue("@QuantityInStock", dto.QuantityInStock);
                        command.Parameters.AddWithValue("@CategoryID", dto.CategoryID);

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

        public static bool DeleteProduct(int? ProductID)
        {
            int rowsAffected = 0;

            try
            {
                using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
                {
                    using (SqlCommand command = new SqlCommand("SP_DeleteProduct", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
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

        public static bool DoesProductExist(int? ProductID)
        {
            bool isFound = false;

            try
            {
                using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
                {
                    using (SqlCommand command = new SqlCommand("SP_DoesProductExist", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
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

        public static DataTable GetAllProductCatalog()
        {
            DataTable dt = new DataTable();

            try
            {
                using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
                {
                    using (SqlCommand command = new SqlCommand("SP_GetAllProductCatalog", connection))
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

        public static DataTable GetProductsByCategoryId(int categoryId)
        {
            DataTable dt = new DataTable();

            try
            {
                using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
                {
                    using (SqlCommand command = new SqlCommand("SP_GetProductsByCategoryID", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@CategoryID", categoryId);

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

        public static DataTable SearchProducts(string searchTerm)
        {
            DataTable dt = new DataTable();

            try
            {
                using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
                {
                    using (SqlCommand command = new SqlCommand("SP_SearchProducts", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@SearchTerm", searchTerm);

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
