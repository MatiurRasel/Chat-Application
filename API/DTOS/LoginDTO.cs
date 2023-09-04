using System.ComponentModel.DataAnnotations;

namespace API.DTOS
{
    public class LoginDTO
    {
        public string UserName { get; set; }
        public string Password { get; set; }
    }
}
