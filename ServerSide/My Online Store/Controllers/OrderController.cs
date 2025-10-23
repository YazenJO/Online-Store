using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OnlineStore.BLL;
using OnlineStore.DAL;
using OnlineStore.Models;
using OnlineStoreAPI.DTOs;
using System.Collections.Generic;

namespace OnlineStoreAPI.Controllers
{
    [ApiController]
    [Route("api/Orders")]
    public class OrdersController : ControllerBase
    {
        [Authorize(Roles = "Admin")]
        [HttpGet("All", Name = "GetAllOrders")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<IEnumerable<OrderDTO>> GetAllOrders()
        {
            var ordersList = Order.GetAllOrders();

            if (ordersList == null || ordersList.Rows.Count == 0)
            {
                return NotFound("No Orders Found!");
            }

            var dtoList = new List<OrderDTO>();

            foreach (System.Data.DataRow row in ordersList.Rows)
            {
                dtoList.Add(new OrderDTO
                (
                    (int?)row["OrderID"],
                    (int)row["CustomerID"],
                    (DateTime?)row["OrderDate"],
                    (decimal)row["TotalAmount"],
                    (short?)row["Status"]
                ));
            }

            return Ok(dtoList);
        }

        [Authorize]
        [HttpGet("{id}", Name = "GetOrderById")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<OrderDTO> GetOrderById(int id)
        {
            if (id < 1)
            {
                return BadRequest($"Not accepted ID {id}");
            }

            Order order = Order.Find(id);

            if (order == null)
            {
                return NotFound($"Order with ID {id} not found.");
            }

            var userRole = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            if (userRole != "Admin" && order.CustomerID.ToString() != userId)
            {
                return Forbid();
            }

            return Ok(order.OrderDTO);
        }

        [Authorize]
        [HttpGet("customer/{customerId}", Name = "GetOrdersByCustomerID")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<IEnumerable<OrderDTO>> GetOrdersByCustomerID(int customerId)
        {
            if (customerId < 1)
            {
                return BadRequest(new { message = $"Invalid customer ID {customerId}" });
            }

            var userRole = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            if (userRole != "Admin" && customerId.ToString() != userId)
            {
                return Forbid();
            }

            var ordersList = Order.GetOrdersByCustomerID(customerId);

            if (ordersList == null || ordersList.Rows.Count == 0)
            {
                return Ok(new List<OrderDTO>());
            }

            var dtoList = new List<OrderDTO>();

            foreach (System.Data.DataRow row in ordersList.Rows)
            {
                dtoList.Add(new OrderDTO
                (
                    (int?)row["OrderID"],
                    (int)row["CustomerID"],
                    (DateTime?)row["OrderDate"],
                    (decimal)row["TotalAmount"],
                    (short?)row["Status"]
                ));
            }

            return Ok(dtoList);
        }

        [Authorize]
        [HttpPost("complete", Name = "CreateCompleteOrder")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<CompleteOrderResponseDTO> CreateCompleteOrder([FromBody] CreateCompleteOrderRequestDTO orderRequest)
        {
            if (orderRequest == null)
            {
                return BadRequest(new { message = "Order request cannot be null" });
            }

            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            var userRole = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;

            var authResult = AuthorizeOrderCreation(orderRequest.CustomerID, userId, userRole);
            if (authResult != null) return authResult;

            var validationResult = ValidateOrderRequest(orderRequest);
            if (validationResult != null) return validationResult;

            var itemsValidation = ValidateAndCalculateOrderItems(orderRequest.Items);
            if (itemsValidation.ErrorResult != null) return itemsValidation.ErrorResult;

            try
            {
                var orderResult = CreateOrderRecord(orderRequest, itemsValidation.OrderTotal);
                if (orderResult.ErrorResult != null) return orderResult.ErrorResult;

                int createdOrderID = orderResult.Order.OrderID.Value;

                var orderItemsResult = CreateOrderItemsRecords(createdOrderID, itemsValidation.ValidatedItems);
                if (orderItemsResult.ErrorResult != null)
                {
                    RollbackOrder(createdOrderID);
                    return orderItemsResult.ErrorResult;
                }

                var paymentResult = CreatePaymentRecord(createdOrderID, itemsValidation.OrderTotal, orderRequest.PaymentMethod);
                if (paymentResult.ErrorResult != null)
                {
                    RollbackOrderAndItems(createdOrderID);
                    return paymentResult.ErrorResult;
                }

                var shippingResult = CreateShippingRecord(createdOrderID, orderRequest);
                if (shippingResult.ErrorResult != null)
                {
                    RollbackOrderItemsAndPayment(createdOrderID, paymentResult.Payment.PaymentID);
                    return shippingResult.ErrorResult;
                }

                var stockUpdateResult = UpdateProductStock(itemsValidation.ValidatedItems);
                if (stockUpdateResult != null)
                {
                    RollbackCompleteOrder(createdOrderID, paymentResult.Payment.PaymentID, shippingResult.Shipping.ShippingID);
                    return stockUpdateResult;
                }

                return CreateSuccessResponse(
                    orderResult.Order,
                    orderItemsResult.CreatedItems,
                    paymentResult.Payment,
                    shippingResult.Shipping
                );
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { message = "An error occurred while creating the order", details = ex.Message });
            }
        }

        [Authorize]
        [HttpPost(Name = "AddOrder")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<OrderDTO> AddOrder(OrderDTO newOrderDTO)
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            var userRole = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;

            if (userRole != "Admin" && newOrderDTO.CustomerID.ToString() != userId)
            {
                return Forbid();
            }

            if (newOrderDTO == null || newOrderDTO.CustomerID < 0 || newOrderDTO.TotalAmount < 0)
            {
                return BadRequest("Invalid Order data.");
            }

            if (newOrderDTO.Status.HasValue)
            {
                if (newOrderDTO.Status.Value < 1 || newOrderDTO.Status.Value > 6)
                {
                    return BadRequest("Invalid order status. Must be between 1 (Pending) and 6 (Completed).");
                }
            }
            else
            {
                newOrderDTO.Status = (short)OrderStatus.Pending;
            }

            Order order = new Order(new OrderDTO
            (
                    newOrderDTO.OrderID,
                    newOrderDTO.CustomerID,
                    newOrderDTO.OrderDate,
                    newOrderDTO.TotalAmount,
                    newOrderDTO.Status
            ));

            if (!order.Save())
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error adding Order");
            }

            newOrderDTO.OrderID = order.OrderID;

            return CreatedAtRoute("GetOrderById", new { id = newOrderDTO.OrderID }, newOrderDTO);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}", Name = "UpdateOrder")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<OrderDTO> UpdateOrder(int id, OrderDTO updatedOrder)
        {
            if (id < 1 || updatedOrder == null || updatedOrder.CustomerID < 0 || updatedOrder.TotalAmount < 0)
            {
                return BadRequest("Invalid Order data.");
            }

            if (updatedOrder.Status.HasValue)
            {
                if (updatedOrder.Status.Value < 1 || updatedOrder.Status.Value > 6)
                {
                    return BadRequest("Invalid order status. Must be between 1 (Pending) and 6 (Completed).");
                }
            }

            Order order = Order.Find(id);

            if (order == null)
            {
                return NotFound($"Order with ID {id} not found.");
            }

            order.CustomerID = updatedOrder.CustomerID;
            order.OrderDate = updatedOrder.OrderDate;
            order.TotalAmount = updatedOrder.TotalAmount;
            order.Status = updatedOrder.Status;

            if (!order.Save())
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error updating Order");
            }

            return Ok(order.OrderDTO);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}", Name = "DeleteOrder")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult DeleteOrder(int id)
        {
            if (id < 1)
            {
                return BadRequest($"Not accepted ID {id}");
            }

            if (Order.DeleteOrder(id))
            {
                return Ok($"Order with ID {id} has been deleted.");
            }
            else
            {
                return NotFound($"Order with ID {id} not found. No rows deleted!");
            }
        }

        [Authorize]
        [HttpGet("Exists/{id}", Name = "DoesOrderExist")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<bool> DoesOrderExist(int id)
        {
            if (id < 1)
            {
                return BadRequest($"Not accepted ID {id}");
            }

            return Ok(Order.DoesOrderExist(id));
        }

        #region Private Methods

        private ActionResult? AuthorizeOrderCreation(int customerID, string userId, string userRole)
        {
            if (userRole != "Admin" && customerID.ToString() != userId)
            {
                return Forbid();
            }
            return null;
        }

        private ActionResult? ValidateOrderRequest(CreateCompleteOrderRequestDTO orderRequest)
        {
            if (orderRequest.CustomerID < 1)
            {
                return BadRequest(new { message = "Invalid customer ID" });
            }

            if (orderRequest.Items == null || orderRequest.Items.Count == 0)
            {
                return BadRequest(new { message = "Order must contain at least one item" });
            }

            if (string.IsNullOrWhiteSpace(orderRequest.PaymentMethod))
            {
                return BadRequest(new { message = "Payment method is required" });
            }

            if (string.IsNullOrWhiteSpace(orderRequest.ShippingAddress))
            {
                return BadRequest(new { message = "Shipping address is required" });
            }

            if (string.IsNullOrWhiteSpace(orderRequest.CarrierName))
            {
                return BadRequest(new { message = "Carrier name is required" });
            }

            if (!Customer.DoesCustomerExist(orderRequest.CustomerID))
            {
                return BadRequest(new { message = $"Customer with ID {orderRequest.CustomerID} does not exist" });
            }

            return null;
        }

        private (ActionResult? ErrorResult, decimal OrderTotal, List<(int ProductID, int Quantity, decimal Price, decimal ItemTotal)> ValidatedItems) 
            ValidateAndCalculateOrderItems(List<OrderItemRequestDTO> items)
        {
            decimal orderTotal = 0;
            var validatedItems = new List<(int ProductID, int Quantity, decimal Price, decimal ItemTotal)>();

            foreach (var item in items)
            {
                if (item.ProductID < 1)
                {
                    return (BadRequest(new { message = $"Invalid product ID: {item.ProductID}" }), 0, null);
                }

                if (item.Quantity < 1)
                {
                    return (BadRequest(new { message = $"Invalid quantity for product {item.ProductID}" }), 0, null);
                }

                var product = Product.Find(item.ProductID);
                if (product == null)
                {
                    return (BadRequest(new { message = $"Product with ID {item.ProductID} does not exist" }), 0, null);
                }

                if (product.QuantityInStock < item.Quantity)
                {
                    return (BadRequest(new { message = $"Insufficient stock for product '{product.ProductName}'. Available: {product.QuantityInStock}, Requested: {item.Quantity}" }), 0, null);
                }

                decimal itemTotal = product.Price * item.Quantity;
                orderTotal += itemTotal;

                validatedItems.Add((item.ProductID, item.Quantity, product.Price, itemTotal));
            }

            return (null, orderTotal, validatedItems);
        }

        private (ActionResult? ErrorResult, Order Order) CreateOrderRecord(CreateCompleteOrderRequestDTO orderRequest, decimal orderTotal)
        {
            short orderStatus = (short)OrderStatus.Pending;

            if (orderRequest.OrderStatus.HasValue)
            {
                if (orderRequest.OrderStatus.Value >= 1 && orderRequest.OrderStatus.Value <= 6)
                {
                    orderStatus = orderRequest.OrderStatus.Value;
                }
            }

            var order = new Order(new OrderDTO(
                null,
                orderRequest.CustomerID,
                DateTime.UtcNow,
                orderTotal,
                orderStatus
            ));

            if (!order.Save())
            {
                return (StatusCode(StatusCodes.Status500InternalServerError,
                    new { message = "Failed to create order" }), null);
            }

            return (null, order);
        }

        private (ActionResult? ErrorResult, List<OrderItemDTO> CreatedItems) CreateOrderItemsRecords(
            int orderID,
            List<(int ProductID, int Quantity, decimal Price, decimal ItemTotal)> validatedItems)
        {
            var createdOrderItems = new List<OrderItemDTO>();

            foreach (var validatedItem in validatedItems)
            {
                var orderItem = new OrderItem(new OrderItemDTO(
                    orderID,
                    validatedItem.ProductID,
                    validatedItem.Quantity,
                    validatedItem.Price,
                    validatedItem.ItemTotal
                ));

                if (!orderItem.Save())
                {
                    return (StatusCode(StatusCodes.Status500InternalServerError,
                        new { message = "Failed to create order items. Order has been rolled back." }), null);
                }

                createdOrderItems.Add(orderItem.OrderItemDTO);
            }

            return (null, createdOrderItems);
        }

        private (ActionResult? ErrorResult, Payment Payment) CreatePaymentRecord(
            int orderID,
            decimal amount,
            string paymentMethod)
        {
            var payment = new Payment(new PaymentDTO(
                null,
                orderID,
                amount,
                paymentMethod,
                DateTime.UtcNow
            ));

            if (!payment.Save())
            {
                return (StatusCode(StatusCodes.Status500InternalServerError,
                    new { message = "Failed to create payment. Order has been rolled back." }), null);
            }

            return (null, payment);
        }

        private (ActionResult? ErrorResult, Shipping Shipping) CreateShippingRecord(
            int orderID,
            CreateCompleteOrderRequestDTO orderRequest)
        {
            var shipping = new Shipping(new ShippingDTO(
                null,
                orderID,
                orderRequest.CarrierName,
                GenerateTrackingNumber(),
                1,
                orderRequest.EstimatedDeliveryDate ?? DateTime.UtcNow.AddDays(7),
                null
            ));

            if (!shipping.Save())
            {
                return (StatusCode(StatusCodes.Status500InternalServerError,
                    new { message = "Failed to create shipping information. Order and payment have been rolled back." }), null);
            }

            return (null, shipping);
        }

        private ActionResult? UpdateProductStock(List<(int ProductID, int Quantity, decimal Price, decimal ItemTotal)> validatedItems)
        {
            foreach (var validatedItem in validatedItems)
            {
                if (!OrderItem.ReduceProductStock(validatedItem.ProductID, validatedItem.Quantity))
                {
                    return StatusCode(StatusCodes.Status500InternalServerError,
                        new { message = "Failed to update product stock. Order has been rolled back." });
                }
            }

            return null;
        }

        private ActionResult<CompleteOrderResponseDTO> CreateSuccessResponse(
            Order order,
            List<OrderItemDTO> orderItems,
            Payment payment,
            Shipping shipping)
        {
            var response = new CompleteOrderResponseDTO
            {
                Success = true,
                Message = $"Order created successfully with {orderItems.Count} item(s)",
                Order = order.OrderDTO,
                OrderItems = orderItems,
                Payment = payment.PaymentDTO,
                Shipping = shipping.ShippingDTO
            };

            return CreatedAtRoute("GetOrderById", new { id = order.OrderID }, response);
        }

        private void RollbackOrder(int orderID)
        {
            Order.DeleteOrder(orderID);
        }

        private void RollbackOrderAndItems(int orderID)
        {
            OrderItem.DeleteOrderItemsByOrderID(orderID);
            Order.DeleteOrder(orderID);
        }

        private void RollbackOrderItemsAndPayment(int orderID, int? paymentID)
        {
            Payment.DeletePayment(paymentID);
            OrderItem.DeleteOrderItemsByOrderID(orderID);
            Order.DeleteOrder(orderID);
        }

        private void RollbackCompleteOrder(int orderID, int? paymentID, int? shippingID)
        {
            Shipping.DeleteShipping(shippingID);
            Payment.DeletePayment(paymentID);
            OrderItem.DeleteOrderItemsByOrderID(orderID);
            Order.DeleteOrder(orderID);
        }

        private string GenerateTrackingNumber()
        {
            var datePart = DateTime.UtcNow.ToString("yyyyMMdd");
            var randomPart = new Random().Next(100000, 999999);
            return $"TRACK-{datePart}-{randomPart}";
        }

        #endregion
    }
}
