
using API.DTOS;
using API.Entities;
using API.Helpers;

namespace API.Interfaces
{
    public interface IUserRepository
    {
        void Update(AppUser user);
        Task<IEnumerable<AppUser>> GetUsersAsync();
        Task<AppUser> GetUserByIdAsync(int id);
        Task<AppUser> GetUserByUserNameAsync(string userName);

        Task<PagedList<MemberDTO>> GetMembersAsync(UserParams userParams);
        Task<MemberDTO> GetMemberAsync(string userName, bool isCurrentUser);
        Task<MemberDTO> GetMemberByIdAsync(int id);
        Task<MemberDTO> GetMemberByUserNameAsync(string userName);
        Task<string> GetUserGender(string userName);
        Task<AppUser> GetUserByPhotoId(int photoId);

    }
}