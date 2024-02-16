using System.ComponentModel.DataAnnotations;

namespace E_EstateV2_API.Models
{
    public class UserActivityLog
    {
        [Key]
        public int Id { get; set; }
        public string userId { get; set; }
        public string userName { get; set; }
        public string role { get; set; }
        public DateTime dateTime { get; set; }
        public string method { get; set; }
        public string body { get; set; }
        public string url { get; set; }
    }
}
