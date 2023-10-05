using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOS
{
    public class CreateMessageDTO
    {
        public string RecipientUserName { get; set; }
        public string Content { get; set; }
    }
}