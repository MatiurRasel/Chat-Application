using API.DTOS;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class MessagesController : BaseApiController
    {
        private readonly IMapper _mapper;
        private readonly IUserRepository _userRepository;
        private readonly IMessageRepository _messageRepository;
        public MessagesController(IUserRepository userRepository,
        IMessageRepository messageRepository,IMapper mapper)
        {
            _messageRepository = messageRepository;
            _userRepository = userRepository;
            _mapper = mapper;
            
        }

        [HttpPost]
        public async Task<ActionResult<MessageDTO>> CreateMessage(CreateMessageDTO createMessageDTO)
        {
            var userName = User.GetUserName();

            if(userName.ToLower() == createMessageDTO.RecipientUserName.ToLower())
                return BadRequest("You cannot send messages to yourself");

            var sender = await _userRepository.GetUserByUserNameAsync(userName);
            var recipient = await _userRepository.GetUserByUserNameAsync(createMessageDTO.RecipientUserName);

            if(recipient == null) return NotFound();

            var message = new Message
            {
                Sender  = sender,
                Recipient = recipient,
                SenderUserName = sender.UserName,
                RecipientUserName = recipient.UserName,
                Content = createMessageDTO.Content 
            };

            _messageRepository.AddMessage(message);

            if(await _messageRepository.SaveAllAsync()) 
                return Ok(_mapper.Map<MessageDTO>(message));

            return BadRequest("Failed to send messages");
                
        }

        [HttpGet]
        public async Task<ActionResult<PagedList<MessageDTO>>> GetMessagesForUser(
            [FromQuery] MessageParams messageParams
        )
        {
            messageParams.UserName = User.GetUserName();
            var messages = await _messageRepository.GetMessagesForUser(messageParams);
            Response.AddPaginationHeader(new PaginationHeader(
                messages.CurrentPage,messages.PageSize,messages.TotalCount,messages.TotalPages));

            return messages;    
        }

        [HttpGet("thread/{userName}")]
        public async Task<ActionResult<IEnumerable<MessageDTO>>> GetMessageThread(string userName)
        {
            var currentUserName = User.GetUserName();
            return Ok(await _messageRepository.GetMessageThread(currentUserName,userName));
        }
    }
}