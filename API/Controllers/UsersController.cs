
using System.Security.Claims;
using API.Data;
using API.DTOS;
using API.Entities;
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

        public UsersController(IUserRepository user, IMapper mapper)
        {
            _user = user;
            _mapper = mapper;
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
            var userName=  User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = await _user.GetUserByUserNameAsync(userName);

            if(user == null) return NotFound();

            _mapper.Map(memberUpdateDTO,user);

            if(await _user.SaveAllAsync()) return NoContent();

            return BadRequest("Failed to update user");
        }

    }
}