namespace API.DTOS
{
    public class PhotoForApprovalDTO
    {
        public int Id { get; set; } 
        public string Url { get; set; } 
        public string UserName { get; set; } 
        public bool IsApproved { get; set; }
    }
}