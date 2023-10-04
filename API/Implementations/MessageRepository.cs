using API.Data;
using API.DTOS;
using API.Entities;
using API.Helpers;
using API.Interfaces;

namespace API.Implementations
{
    public class MessageRepository : IMessageRepository
    {
        public MessageRepository(DataContext context)
        {
            
        }
        public void AddMessage(Message message)
        {
            throw new NotImplementedException();
        }

        public void DeleteMessage(Message message)
        {
            throw new NotImplementedException();
        }

        public Task<Message> GetMessage(int id)
        {
            throw new NotImplementedException();
        }

        public Task<PagedList<MessageDTO>> GetMessagesForUser()
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<MessageDTO>> GetMessageThread(int currentUserId, int recipientId)
        {
            throw new NotImplementedException();
        }

        public Task<bool> SaveAllAsync()
        {
            throw new NotImplementedException();
        }
    }
}