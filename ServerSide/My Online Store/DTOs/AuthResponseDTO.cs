using OnlineStore.Models;

namespace OnlineStoreAPI.DTOs
{
    public class AuthResponseDTO
    {
        public CustomerDTO Customer { get; set; } = null!;
        public string Token { get; set; } = string.Empty;
    }
}
