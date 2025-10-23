namespace OnlineStore.Models
{
    public class CategoryDTO
    {
        public CategoryDTO(int? categoryid, string categoryname)
        {
            this.CategoryID = categoryid;
            this.CategoryName = categoryname;
        }

        public int? CategoryID { get; set; }
        public string CategoryName { get; set; }
    }

}

