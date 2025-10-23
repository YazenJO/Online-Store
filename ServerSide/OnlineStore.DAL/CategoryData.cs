using System;
using System.Data;
using Microsoft.Data.SqlClient;

using OnlineStore.Models;

namespace OnlineStore.DAL
{
    public class CategoryData
    {
        public static CategoryDTO GetCategoryByID(int? CategoryID)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
                {
                    using (SqlCommand command = new SqlCommand("SP_GetCategoryByID", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@CategoryID", CategoryID);

                        connection.Open();

                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                return new CategoryDTO
                                (
                            reader.GetInt32(reader.GetOrdinal("CategoryID")),
                            reader.GetString(reader.GetOrdinal("CategoryName"))
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

        public static int AddCategory(CategoryDTO CategoryDTO)
        {
            using (var connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
            using (var command = new SqlCommand("SP_AddCategory", connection))
            {
                command.CommandType = CommandType.StoredProcedure;

                command.Parameters.AddWithValue("@CategoryName", CategoryDTO.CategoryName);
                var outputIdParam = new SqlParameter("@NewCategoryID", SqlDbType.Int)
                {
                    Direction = ParameterDirection.Output
                };
                command.Parameters.Add(outputIdParam);

                connection.Open();
                command.ExecuteNonQuery();

                return (int)outputIdParam.Value;
            }
        }

        public static bool UpdateCategory(CategoryDTO dto)
        {
            int rowsAffected = 0;

            try
            {
                using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
                {
                    using (SqlCommand command = new SqlCommand("SP_UpdateCategory", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.AddWithValue("@CategoryID", dto.CategoryID);
                        command.Parameters.AddWithValue("@CategoryName", dto.CategoryName);

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

        public static bool DeleteCategory(int? CategoryID)
        {
            int rowsAffected = 0;

            try
            {
                using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
                {
                    using (SqlCommand command = new SqlCommand("SP_DeleteCategory", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@CategoryID", CategoryID);

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

        public static bool DoesCategoryExist(int? CategoryID)
        {
            bool isFound = false;

            try
            {
                using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
                {
                    using (SqlCommand command = new SqlCommand("SP_DoesCategoryExist", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@CategoryID", CategoryID);

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

        public static DataTable GetAllProductCategory()
        {
            DataTable dt = new DataTable();

            try
            {
                using (SqlConnection connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
                {
                    using (SqlCommand command = new SqlCommand("SP_GetAllProductCategory", connection))
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
