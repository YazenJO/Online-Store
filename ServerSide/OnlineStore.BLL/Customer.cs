using System;
using System.Data;
using OnlineStore.Models;
using OnlineStore.DAL;

namespace OnlineStore.BLL
{
    public class Customer
    {
        public enum enMode { AddNew = 0, Update = 1 };
        public enMode Mode = enMode.AddNew;

        public CustomerDTO CustomerDTO
        {
            get { return new CustomerDTO(CustomerID = this.CustomerID, Name = this.Name, Email = this.Email, Phone = this.Phone, Address = this.Address, Username = this.Username, Password = this.Password, Role = this.Role); }
        }

        public int? CustomerID { set; get; }
        public string Name { set; get; }
        public string Email { set; get; }
        public string Phone { set; get; }
        public string Address { set; get; }
        public string Username { set; get; }
        public string Password { set; get; }
        public string Role { set; get; }

        public Customer(CustomerDTO CustomerDTO, enMode cMode = enMode.AddNew)
        {
            this.CustomerID = CustomerDTO.CustomerID;
            this.Name = CustomerDTO.Name;
            this.Email = CustomerDTO.Email;
            this.Phone = CustomerDTO.Phone;
            this.Address = CustomerDTO.Address;
            this.Username = CustomerDTO.Username;
            this.Password = CustomerDTO.Password;
            this.Role = CustomerDTO.Role ?? "Customer";
            Mode = cMode;
        }

        private bool _AddNewCustomer()
        {
            this.CustomerID = (int?)CustomerData.AddCustomer(CustomerDTO);
            return (this.CustomerID != -1);
        }

        private bool _UpdateCustomer()
        {
            return CustomerData.UpdateCustomer(CustomerDTO);
        }

        public static Customer Find(int? CustomerID)
        {
            CustomerDTO CustomerDTO = CustomerData.GetCustomerByID(CustomerID);

            if (CustomerDTO != null)
                return new Customer(CustomerDTO, enMode.Update);
            else
                return null;
        }

        public static Customer FindByUsername(string username)
        {
            CustomerDTO CustomerDTO = CustomerData.GetCustomerByUsername(username);

            if (CustomerDTO != null)
                return new Customer(CustomerDTO, enMode.Update);
            else
                return null;
        }

        public bool Save()
        {
            switch (Mode)
            {
                case enMode.AddNew:
                    if (_AddNewCustomer())
                    {
                        Mode = enMode.Update;
                        return true;
                    }
                    else
                    {
                        return false;
                    }

                case enMode.Update:
                    return _UpdateCustomer();
            }
            return false;
        }
        public static bool DeleteCustomer(int? CustomerID)
            => CustomerData.DeleteCustomer(CustomerID);
        public static bool DoesCustomerExist(int? CustomerID)
            => CustomerData.DoesCustomerExist(CustomerID);
        public static DataTable GetAllCustomers()
            => CustomerData.GetAllCustomers();
    }
}
