using Microsoft.AspNetCore.Mvc;
using OnlineStore.BLL;
using OnlineStore.DAL;
using OnlineStore.Models;
using System.Collections.Generic;

namespace OnlineStoreAPI.Controllers
{
    [ApiController]
    [Route("api/Shippings")]
    public class ShippingsController : ControllerBase
    {

        [HttpGet("All", Name = "GetAllShippings")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<IEnumerable<ShippingDTO>> GetAllShippings()
        {
            var shippingsList = Shipping.GetAllShippings();

            if (shippingsList == null || shippingsList.Rows.Count == 0)
            {
                return NotFound("No Shippings Found!");
            }

            var dtoList = new List<ShippingDTO>();

            foreach (System.Data.DataRow row in shippingsList.Rows)
            {
                dtoList.Add(new ShippingDTO
                (
                    (int?)row["ShippingID"],
                    (int)row["OrderID"],
                    (string)row["CarrierName"],
                    (string)row["TrackingNumber"],
                    (short?)row["ShippingStatus"],
                    (DateTime?)row["EstimatedDeliveryDate"],
                    (DateTime?)row["ActualDeliveryDate"]
                ));
            }

            return Ok(dtoList);
        }

        [HttpGet("{id}", Name = "GetShippingById")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<ShippingDTO> GetShippingById(int id)
        {
            if (id < 1)
            {
                return BadRequest($"Not accepted ID {id}");
            }

            Shipping shipping = Shipping.Find(id);

            if (shipping == null)
            {
                return NotFound($"Shipping with ID {id} not found.");
            }

            ShippingDTO dto = shipping.ShippingDTO;

            return Ok(dto);
        }

        [HttpPost(Name = "AddShipping")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<ShippingDTO> AddShipping(ShippingDTO newShippingDTO)
        {
            if (newShippingDTO == null || newShippingDTO.OrderID < 0)
            {
                return BadRequest("Invalid Shipping data.");
            }

            Shipping shipping = new Shipping(new ShippingDTO
            (
                    newShippingDTO.ShippingID,
                    newShippingDTO.OrderID,
                    newShippingDTO.CarrierName,
                    newShippingDTO.TrackingNumber,
                    newShippingDTO.ShippingStatus,
                    newShippingDTO.EstimatedDeliveryDate,
                    newShippingDTO.ActualDeliveryDate
            ));

            if (!shipping.Save())
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error adding Shipping");
            }

            newShippingDTO.ShippingID = shipping.ShippingID;

            return CreatedAtRoute("GetShippingById", new { id = newShippingDTO.ShippingID }, newShippingDTO);
        }

        [HttpPut("{id}", Name = "UpdateShipping")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<ShippingDTO> UpdateShipping(int id, ShippingDTO updatedShipping)
        {
            if (id < 1 || updatedShipping == null || updatedShipping.OrderID < 0)
            {
                return BadRequest("Invalid Shipping data.");
            }

            Shipping shipping = Shipping.Find(id);

            if (shipping == null)
            {
                return NotFound($"Shipping with ID {id} not found.");
            }

            shipping.OrderID = updatedShipping.OrderID;
            shipping.CarrierName = updatedShipping.CarrierName;
            shipping.TrackingNumber = updatedShipping.TrackingNumber;
            shipping.ShippingStatus = updatedShipping.ShippingStatus;
            shipping.EstimatedDeliveryDate = updatedShipping.EstimatedDeliveryDate;
            shipping.ActualDeliveryDate = updatedShipping.ActualDeliveryDate;

            if (!shipping.Save())
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error updating Shipping");
            }

            return Ok(shipping.ShippingDTO);
        }

        [HttpDelete("{id}", Name = "DeleteShipping")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult DeleteShipping(int id)
        {
            if (id < 1)
            {
                return BadRequest($"Not accepted ID {id}");
            }

            if (Shipping.DeleteShipping(id))
            {
                return Ok($"Shipping with ID {id} has been deleted.");
            }
            else
            {
                return NotFound($"Shipping with ID {id} not found. No rows deleted!");
            }
        }

        [HttpGet("Exists/{id}", Name = "DoesShippingExist")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<bool> DoesShippingExist(int id)
        {
            if (id < 1)
            {
                return BadRequest($"Not accepted ID {id}");
            }

            bool exists = Shipping.DoesShippingExist(id);

            return Ok(exists);
        }
    }
}
