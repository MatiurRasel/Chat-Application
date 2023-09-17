
using System.Security.Cryptography.X509Certificates;
using API.Data;
using API.DTOS;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Implementations
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public UserRepository(DataContext context,IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<MemberDTO> GetMemberByIdAsync(int id)
        {
            return await _context.Users
                 .Where(x => x.Id == id)
                 .ProjectTo<MemberDTO>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync();
        }

        public async Task<MemberDTO> GetMemberByUserNameAsync(string userName)
        {
            return await _context.Users
                .Where(x => x.UserName == userName)
                .ProjectTo<MemberDTO>(_mapper.ConfigurationProvider)
               .FirstOrDefaultAsync();
        }

        public async Task<PagedList<MemberDTO>> GetMembersAsync(UserParams userParams)
        {
            var query =   _context.Users.AsQueryable();
            query =query.Where(u=>u.UserName != userParams.CurrentUserName);
            query = query.Where(u=>u.Gender == userParams.Gender);

            var minDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-userParams.MaxAge-1));
            var maxDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-userParams.MinAge));
            
            query = query.Where(u=>u.DateOfBirth >= minDob && u.DateOfBirth <= maxDob);

                return await PagedList<MemberDTO>.CreateAsync(
                    query.AsNoTracking().ProjectTo<MemberDTO>(_mapper.ConfigurationProvider),
                    userParams.PageNumber,userParams.PageSize);

        }

        public async Task<AppUser> GetUserByIdAsync(int id)
        {
            return await _context.Users
            .Include(p=>p.Photos)
            .FirstOrDefaultAsync(x=>x.Id ==id);
        }

        public async Task<AppUser> GetUserByUserNameAsync(string userName)
        {
             return await _context.Users
             .Include(p=>p.Photos)
             .FirstOrDefaultAsync(x=>x.UserName ==userName);
        }

        public async Task<IEnumerable<AppUser>> GetUsersAsync()
        {
             return await _context.Users
             .Include(p=>p.Photos)
             .ToListAsync();
        }

        public async Task<bool> SaveAllAsync()
        {
           return await _context.SaveChangesAsync() > 0;
        }

        public void Update(AppUser user)
        {
            _context.Entry(user).State = EntityState.Modified;

        }
    }
}