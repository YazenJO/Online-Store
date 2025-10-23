using Microsoft.AspNetCore.Mvc;
using OnlineStore.BLL;
using OnlineStore.DAL;
using OnlineStore.Models;
using System.Collections.Generic;

namespace OnlineStoreAPI.Controllers
{
    [ApiController]
    [Route("api/categories")]  // Changed from api/ProductCategory to api/categories
    public class CategoriesController : ControllerBase  // Renamed from ProductCategoryController
    {
        [HttpGet(Name = "GetAllCategories")]  // Removed "All" from route
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<IEnumerable<CategoryDTO>> GetAllCategories()  // Renamed method
        {
            var categoryList = Category.GetAllProductCategory();

            if (categoryList == null || categoryList.Rows.Count == 0)
            {
                return NotFound(new { message = "No categories found" });
            }

            var dtoList = new List<CategoryDTO>();

            foreach (System.Data.DataRow row in categoryList.Rows)
            {
                dtoList.Add(new CategoryDTO
                (
                    (int?)row["CategoryID"],
                    (string)row["CategoryName"]
                ));
            }

            return Ok(dtoList);
        }

        [HttpGet("{id}", Name = "GetCategoryById")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<CategoryDTO> GetCategoryById(int id)
        {
            if (id < 1)
            {
                return BadRequest(new { message = $"Invalid ID {id}" });
            }

            Category category = Category.Find(id);

            if (category == null)
            {
                return NotFound(new { message = $"Category with ID {id} not found" });
            }

            CategoryDTO dto = category.CategoryDTO;

            return Ok(dto);
        }

        [HttpPost(Name = "AddCategory")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<CategoryDTO> AddCategory(CategoryDTO newCategoryDTO)
        {
            if (newCategoryDTO == null || string.IsNullOrEmpty(newCategoryDTO.CategoryName))
            {
                return BadRequest(new { message = "Invalid category data" });
            }

            Category category = new Category(new CategoryDTO
            (
                newCategoryDTO.CategoryID,
                newCategoryDTO.CategoryName
            ));

            if (!category.Save())
            {
                return StatusCode(StatusCodes.Status500InternalServerError, 
                    new { message = "Error adding category" });
            }

            newCategoryDTO.CategoryID = category.CategoryID;

            return CreatedAtRoute("GetCategoryById", new { id = newCategoryDTO.CategoryID }, newCategoryDTO);
        }

        [HttpPut("{id}", Name = "UpdateCategory")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<CategoryDTO> UpdateCategory(int id, CategoryDTO updatedCategory)
        {
            if (id < 1 || updatedCategory == null || string.IsNullOrEmpty(updatedCategory.CategoryName))
            {
                return BadRequest(new { message = "Invalid category data" });
            }

            Category category = Category.Find(id);

            if (category == null)
            {
                return NotFound(new { message = $"Category with ID {id} not found" });
            }

            category.CategoryName = updatedCategory.CategoryName;

            if (!category.Save())
            {
                return StatusCode(StatusCodes.Status500InternalServerError, 
                    new { message = "Error updating category" });
            }

            return Ok(category.CategoryDTO);
        }

        [HttpDelete("{id}", Name = "DeleteCategory")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult DeleteCategory(int id)
        {
            if (id < 1)
            {
                return BadRequest(new { message = $"Invalid ID {id}" });
            }

            if (Category.DeleteCategory(id))
            {
                return Ok(new { message = $"Category with ID {id} has been deleted" });
            }
            else
            {
                return NotFound(new { message = $"Category with ID {id} not found" });
            }
        }

        [HttpGet("exists/{id}", Name = "DoesCategoryExist")]  // Changed route to lowercase
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<bool> DoesCategoryExist(int id)
        {
            if (id < 1)
            {
                return BadRequest(new { message = $"Invalid ID {id}" });
            }

            bool exists = Category.DoesCategoryExist(id);

            return Ok(exists);
        }
    }
}
