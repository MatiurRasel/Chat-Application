using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class LikesController : BaseApiController
    {
        private readonly ILikesRepository _likesRepository;
        private readonly IUserRepository _userRepository;

        public LikesController(
            IUserRepository userRepository,
            ILikesRepository likesRepository
        )
        {
            _likesRepository = likesRepository;
            _userRepository = userRepository;
            
        }

        //[HttpPost("")]
    }
}