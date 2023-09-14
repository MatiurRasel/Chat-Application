
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
            var query =   _context.Users
                .ProjectTo<MemberDTO>(_mapper.ConfigurationProvider)
                .AsNoTracking();

                return await PagedList<MemberDTO>.CreateAsync(query,userParams.PageNumber,userParams.PageSize);

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