using Microsoft.AspNetCore.Mvc;
using OnlineStore.BLL;
using OnlineStore.DAL;
using OnlineStore.Models;
using System.Collections.Generic;

namespace OnlineStoreAPI.Controllers
{
    [ApiController]
    [Route("api/Payments")]
    public class PaymentsController : ControllerBase
    {

        [HttpGet("All", Name = "GetAllPayments")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<IEnumerable<PaymentDTO>> GetAllPayments()
        {
            var paymentsList = Payment.GetAllPayments();

            if (paymentsList == null || paymentsList.Rows.Count == 0)
            {
                return NotFound("No Payments Found!");
            }

            var dtoList = new List<PaymentDTO>();

            foreach (System.Data.DataRow row in paymentsList.Rows)
            {
                dtoList.Add(new PaymentDTO
                (
                    (int?)row["PaymentID"],
                    (int)row["OrderID"],
                    (decimal)row["Amount"],
                    (string)row["PaymentMethod"],
                    (DateTime?)row["TransactionDate"]
                ));
            }

            return Ok(dtoList);
        }

        [HttpGet("{id}", Name = "GetPaymentById")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<PaymentDTO> GetPaymentById(int id)
        {
            if (id < 1)
            {
                return BadRequest($"Not accepted ID {id}");
            }

            Payment payment = Payment.Find(id);

            if (payment == null)
            {
                return NotFound($"Payment with ID {id} not found.");
            }

            PaymentDTO dto = payment.PaymentDTO;

            return Ok(dto);
        }

        [HttpPost(Name = "AddPayment")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<PaymentDTO> AddPayment(PaymentDTO newPaymentDTO)
        {
            if (newPaymentDTO == null || newPaymentDTO.OrderID < 0 || newPaymentDTO.Amount < 0)
            {
                return BadRequest("Invalid Payment data.");
            }

            Payment payment = new Payment(new PaymentDTO
            (
                    newPaymentDTO.PaymentID,
                    newPaymentDTO.OrderID,
                    newPaymentDTO.Amount,
                    newPaymentDTO.PaymentMethod,
                    newPaymentDTO.TransactionDate
            ));

            if (!payment.Save())
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error adding Payment");
            }

            newPaymentDTO.PaymentID = payment.PaymentID;

            return CreatedAtRoute("GetPaymentById", new { id = newPaymentDTO.PaymentID }, newPaymentDTO);
        }

        [HttpPut("{id}", Name = "UpdatePayment")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<PaymentDTO> UpdatePayment(int id, PaymentDTO updatedPayment)
        {
            if (id < 1 || updatedPayment == null || updatedPayment.OrderID < 0 || updatedPayment.Amount < 0)
            {
                return BadRequest("Invalid Payment data.");
            }

            Payment payment = Payment.Find(id);

            if (payment == null)
            {
                return NotFound($"Payment with ID {id} not found.");
            }

            payment.OrderID = updatedPayment.OrderID;
            payment.Amount = updatedPayment.Amount;
            payment.PaymentMethod = updatedPayment.PaymentMethod;
            payment.TransactionDate = updatedPayment.TransactionDate;

            if (!payment.Save())
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error updating Payment");
            }

            return Ok(payment.PaymentDTO);
        }

        [HttpDelete("{id}", Name = "DeletePayment")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult DeletePayment(int id)
        {
            if (id < 1)
            {
                return BadRequest($"Not accepted ID {id}");
            }

            if (Payment.DeletePayment(id))
            {
                return Ok($"Payment with ID {id} has been deleted.");
            }
            else
            {
                return NotFound($"Payment with ID {id} not found. No rows deleted!");
            }
        }

        [HttpGet("Exists/{id}", Name = "DoesPaymentExist")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<bool> DoesPaymentExist(int id)
        {
            if (id < 1)
            {
                return BadRequest($"Not accepted ID {id}");
            }

            bool exists = Payment.DoesPaymentExist(id);

            return Ok(exists);
        }
    }
}
