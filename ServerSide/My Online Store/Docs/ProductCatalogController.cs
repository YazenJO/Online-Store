using Microsoft.AspNetCore.Mvc;
using OnlineStore.BLL;
using OnlineStore.DAL;
using OnlineStore.Models;
using System.Collections.Generic;

namespace My_Online_Store.Docs
{
    [ApiController]
    [Route("api/ProductCatalog")]
    public class ProductCatalogController : ControllerBase
    {

        [HttpGet("All", Name = "GetAllProductCatalog")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<IEnumerable<ProductDTO>> GetAllProductCatalog()
        {
            var productcatalogList = Product.GetAllProductCatalog();

            if (productcatalogList == null || productcatalogList.Rows.Count == 0)
            {
                return NotFound("No ProductCatalog Found!");
            }

            var dtoList = new List<ProductDTO>();

            foreach (System.Data.DataRow row in productcatalogList.Rows)
            {
                dtoList.Add(new ProductDTO
                (
                    (int?)row["ProductID"],
                    (string)row["ProductName"],
                    (string)row["Description"],
                    (decimal)row["Price"],
                    (int)row["QuantityInStock"],
                    (int)row["CategoryID"]
                ));
            }

            return Ok(dtoList);
        }

        [HttpGet("{id}", Name = "GetProductById")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<ProductDTO> GetProductById(int id)
        {
            if (id < 1)
            {
                return BadRequest($"Not accepted ID {id}");
            }

            Product product = Product.Find(id);

            if (product == null)
            {
                return NotFound($"Product with ID {id} not found.");
            }

            ProductDTO dto = product.ProductDTO;

            return Ok(dto);
        }

        [HttpPost(Name = "AddProduct")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<ProductDTO> AddProduct(ProductDTO newProductDTO)
        {
            if (newProductDTO == null || string.IsNullOrEmpty(newProductDTO.ProductName) || newProductDTO.Price < 0 || newProductDTO.QuantityInStock < 0 || newProductDTO.CategoryID < 0)
            {
                return BadRequest("Invalid Product data.");
            }

            Product product = new Product(new ProductDTO
            (
                    newProductDTO.ProductID,
                    newProductDTO.ProductName,
                    newProductDTO.Description,
                    newProductDTO.Price,
                    newProductDTO.QuantityInStock,
                    newProductDTO.CategoryID
            ));

            if (!product.Save())
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error adding Product");
            }

            newProductDTO.ProductID = product.ProductID;

            return CreatedAtRoute("GetProductById", new { id = newProductDTO.ProductID }, newProductDTO);
        }

        [HttpPut("{id}", Name = "UpdateProduct")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<ProductDTO> UpdateProduct(int id, ProductDTO updatedProduct)
        {
            if (id < 1 || updatedProduct == null || string.IsNullOrEmpty(updatedProduct.ProductName) || updatedProduct.Price < 0 || updatedProduct.QuantityInStock < 0 || updatedProduct.CategoryID < 0)
            {
                return BadRequest("Invalid Product data.");
            }

            Product product = Product.Find(id);

            if (product == null)
            {
                return NotFound($"Product with ID {id} not found.");
            }

            product.ProductName = updatedProduct.ProductName;
            product.Description = updatedProduct.Description;
            product.Price = updatedProduct.Price;
            product.QuantityInStock = updatedProduct.QuantityInStock;
            product.CategoryID = updatedProduct.CategoryID;

            if (!product.Save())
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error updating Product");
            }

            return Ok(product.ProductDTO);
        }

        [HttpDelete("{id}", Name = "DeleteProduct")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult DeleteProduct(int id)
        {
            if (id < 1)
            {
                return BadRequest($"Not accepted ID {id}");
            }

            if (Product.DeleteProduct(id))
            {
                return Ok($"Product with ID {id} has been deleted.");
            }
            else
            {
                return NotFound($"Product with ID {id} not found. No rows deleted!");
            }
        }

        [HttpGet("Exists/{id}", Name = "DoesProductExist")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<bool> DoesProductExist(int id)
        {
            if (id < 1)
            {
                return BadRequest($"Not accepted ID {id}");
            }

            bool exists = Product.DoesProductExist(id);

            return Ok(exists);
        }
    }
}
