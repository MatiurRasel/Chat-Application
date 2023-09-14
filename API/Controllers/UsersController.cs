
using System.Security.Claims;
using API.Data;
using API.DTOS;
using API.Entities;
using API.Extensions;
using API.Helpers;
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
        public async Task<ActionResult<PagedList<MemberDTO>>> GetUsers([FromQuery]UserParams userParams)
        {
            var users = await _user.GetMembersAsync(userParams);
            //var usersToReturn = _mapper.Map<IEnumerable<MemberDTO>>(users);
            Response.AddPaginationHeader(new PaginationHeader(users.CurrentPage,
            users.PageSize,users.TotalCount,users.TotalPages));
            
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
                    new { userName = user.UserName },_mapper.Map<PhotoDTO>(photo));
            }

            return BadRequest("Problem on adding photo/s");
            
        }

        [HttpPut("set-main-photo/{photoId}")]
        public async Task<ActionResult> SetMainPhoto(int photoId)
        {
            var user = await _user.GetUserByUserNameAsync(User.GetUserName());
            if (user == null) return NotFound();
            var photo = user.Photos.FirstOrDefault(p => p.Id == photoId);
            if (photo == null) return NotFound();
            if (photo.IsMain) return BadRequest("this is already your main photo");

            var currentMain = user.Photos.FirstOrDefault(x => x.IsMain);
            if(currentMain != null) currentMain.IsMain = false;
            photo.IsMain = true;

            if (await _user.SaveAllAsync()) return NoContent();
            return BadRequest("Problem setting the main photo");
        }

        [HttpDelete("delete-Photo/{photoId}")]
        public async Task<ActionResult> DeletePhoto(int photoId)
        {
            var user = await _user.GetUserByUserNameAsync(User.GetUserName());
            if (user == null) return NotFound();
            var photo = user.Photos.FirstOrDefault(p => p.Id == photoId);
            if (photo == null) return NotFound();
            if (photo.IsMain) return BadRequest("you can't delete your main photo");
            if (photo.PublicId != null)
            {
                var result = await _photoService.DeletePhotoAsync(photo.PublicId);
                if(result.Error != null) return BadRequest(result.Error.Message);
            }
            user.Photos.Remove(photo);
            if(await _user.SaveAllAsync()) return Ok();
            return BadRequest("Problem on deleting photo.");
        }

    }
}