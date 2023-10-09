using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using API.Data;
using API.DTOS;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;

        public AccountController(
            UserManager<AppUser> userManager,
            ITokenService tokenService,
            IMapper mapper
        )
        {
            _userManager = userManager;
            _tokenService = tokenService;
            _mapper = mapper;
        }

        [HttpPost("register")]//POST: api/account/register
        public async Task<ActionResult<UserDTO>> Register(RegisterDTO registerDTO)
        {

            if (await UserExists(registerDTO.UserName))
            {
                return BadRequest("User Name is exists.");
            }

            var user = _mapper.Map<AppUser>(registerDTO);

            //using var hmac = new HMACSHA512();

            user.UserName = registerDTO.UserName;
            //user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDTO.Password));
            //user.PasswordSalt = hmac.Key;

            var result = await _userManager.CreateAsync(user,registerDTO.Password);

            if(!result.Succeeded) return BadRequest(result.Errors); 
            // _context.Users.Add(user);
            // await _context.SaveChangesAsync();


            var roleResult = await _userManager.AddToRoleAsync(user,"Member");
            if(!roleResult.Succeeded) return BadRequest(result.Errors);
            return new UserDTO
            {
                UserName = user.UserName,
                Token = await _tokenService.CreateToken(user),
                KnownAs = user.KnownAs,
                Gender = user.Gender
            };

        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDTO>> Login(LoginDTO loginDTO)
        {
            var user = await _userManager.Users
                .Include(p => p.Photos)
                .FirstOrDefaultAsync(x => x.UserName.ToUpper() == loginDTO.UserName.ToUpper());
            if (user == null)
            {
                return Unauthorized("Invalid User Name.");
            }

            var result = await _userManager.CheckPasswordAsync(user,loginDTO.Password);

            if(!result) return Unauthorized("Invalid Password.");

            //using var hmac = new HMACSHA512(user.PasswordSalt);

            //var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDTO.Password));

            // for (int i = 0; i < computedHash.Length; i++)
            // {
            //     if (computedHash[i] != user.PasswordHash[i])
            //     {
            //         return Unauthorized("Invalid Password.");
            //     }
            // }

            return new UserDTO
            {
                UserName = user.UserName,
                Token = await _tokenService.CreateToken(user),
                PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
                KnownAs = user.KnownAs,
                Gender = user.Gender
            };
        }


        private async Task<bool> UserExists(string username)
        {
            return await _userManager.Users.AnyAsync(x => x.UserName.ToUpper() == username.ToUpper());
        }
    }
}