
using System.Security.Claims;
using API.Data;
using API.DTOS;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class UsersController : BaseApiController
    {
        private readonly IUserRepository _user;
        private readonly IMapper _mapper;

        private readonly IPhotoService _photoService;

        public UsersController(IUserRepository user, IMapper mapper
        ,IPhotoService photoService)
        {
            _user = user;
            _mapper = mapper;
            _photoService = photoService;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDTO>>> GetUsers()
        {
            var users = await _user.GetMembersAsync();
            //var usersToReturn = _mapper.Map<IEnumerable<MemberDTO>>(users);
            return Ok(users);
        }

        [HttpGet("{userName}")]
        public async Task<ActionResult<MemberDTO>> GetUser(string userName)
        {
            return  await _user.GetMemberByUserNameAsync(userName);
            
        }

        [HttpPut]
        public async Task<ActionResult> UpdateUser(MemberUpdateDTO memberUpdateDTO)
        {
            var user = await _user.GetUserByUserNameAsync(User.GetUserName());

            if(user == null) return NotFound();

            _mapper.Map(memberUpdateDTO,user);

            if(await _user.SaveAllAsync()) return NoContent();

            return BadRequest("Failed to update user");
        }

        [HttpPost("add-photo")]
        public async Task<ActionResult<PhotoDTO>> AddPhoto(IFormFile file)
        {
            var user = await _user.GetUserByUserNameAsync(User.GetUserName());

            if(user == null) return NotFound();

            var result = await _photoService.AddPhotoAsync(file);

            if (result.Error != null) return BadRequest(result.Error.Message);

            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId
            };

            if (user.Photos.Count == 0) photo.IsMain = true;

            user.Photos.Add(photo);

            if (await _user.SaveAllAsync())
            {
                return CreatedAtAction(nameof(GetUser),
                    new { useName = user.UserName },_mapper.Map<PhotoDTO>(photo));
            }

            return BadRequest("Problem on adding photo/s");
            
        }

    }
}