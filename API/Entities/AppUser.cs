using System.ComponentModel.DataAnnotations;
using API.Extensions;
using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    public class AppUser : IdentityUser<int>
    {
        // public int Id { get; set; }
        // [Required]
        // public string UserName { get; set; }
        // public byte[] PasswordHash { get; set; }
        // public byte[] PasswordSalt { get; set; }
        public DateOnly DateOfBirth {get;set;}
        public string KnownAs {get;set;}
        public DateTime Created {get;set;} = DateTime.Now;
        public DateTime LastActive {get;set;} = DateTime.Now;
        public string Gender {get;set;}
        public string Introduction {get;set;}
        public string LookingFor {get;set;}
        public string Interests {get;set;}
        public string City {get;set;}
        public string Country {get;set;}
        public List<Photo> Photos {get;set;} = new();
        public List<UserLike> LikedByUsers {get;set;} //many to one
        public List<UserLike> LikedUsers {get;set;} //one to many

        public List<Message>  MessagesSent {get;set;}
        public List<Message>  MessagesReceived {get;set;}

        public ICollection<AppUserRole>  UserRoles { get; set; }
    }

}