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
    public class MessageRepository : IMessageRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public MessageRepository(DataContext context,IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }

        public void AddGroup(Group group)
        {
           _context.Groups.Add(group);
        }

        public void AddMessage(Message message)
        {
            _context.Messages.Add(message);
        }

        public void DeleteMessage(Message message)
        {
             _context.Messages.Remove(message);
        }

        public async Task<Connection> GetConnection(string connectionId)
        {
            return await _context.Connections.FindAsync(connectionId);
        }

        public async Task<Group> GetGroupForConnection(string connectionId)
        {
           return await _context.Groups
            .Include(x=>x.Connections)
            .Where(x=>x.Connections.Any(c=>c.ConnectionId == connectionId))
            .FirstOrDefaultAsync();
        }

        public async Task<Message> GetMessage(int id)
        {
            return await _context.Messages.FindAsync(id);
        }

        public async Task<Group> GetMessageGroup(string groupName)
        {
            return await _context.Groups
            .Include(x=>x.Connections)
            .FirstOrDefaultAsync(x=>x.Name == groupName);
        }

        public async Task<PagedList<MessageDTO>> GetMessagesForUser(MessageParams messageParams)
        {
            var userName = messageParams.UserName;

            var query = _context.Messages
            .OrderByDescending(x => x.MessageSent)
            .AsQueryable();
            
            query = messageParams.Container switch
            {
                "Inbox" => query.Where(u => u.RecipientUserName == userName 
                && u.RecipientDeleted == false),
                "Outbox" => query.Where(u => u.SenderUserName == userName
                && u.SenderDeleted == false),
                _ => query.Where(u => u.RecipientUserName == userName
                && u.RecipientDeleted == false
                && u.DateRead == null)
            };

            var messages  = query.ProjectTo<MessageDTO>(_mapper.ConfigurationProvider);

            return await PagedList<MessageDTO>
            .CreateAsync(messages,messageParams.PageNumber,messageParams.PageSize);
        }

        public async Task<IEnumerable<MessageDTO>> GetMessageThread(string currentUserName,string recipientUserName)
        {
           var query  =  _context.Messages
            .Where(
                m=>m.RecipientUserName == currentUserName &&
                m.RecipientDeleted == false &&
                m.SenderUserName == recipientUserName || 
                m.RecipientUserName == recipientUserName &&
                m.SenderDeleted == false &&
                m.SenderUserName == currentUserName
            )
            .OrderBy(m=>m.MessageSent)
            .AsQueryable();

            var unreadMessages = query.Where(m=>m.DateRead == null
                && m.RecipientUserName == currentUserName).ToList();

            if(unreadMessages.Any())
            {
                foreach (var message in unreadMessages)
                {
                    message.DateRead = DateTime.UtcNow;
                }
            }    

            return await query.ProjectTo<MessageDTO>(_mapper.ConfigurationProvider).ToListAsync();
        }

        public void RemoveConnection(Connection connection)
        {
            _context.Connections.Remove(connection);
        }

    }
}