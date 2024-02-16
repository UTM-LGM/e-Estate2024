namespace E_EstateV2_API.Models
{
    public class HistoryLog
    {
        public int Id { get; set; }
        public string entityType { get; set; }
        public int entityId { get; set; }
        public string method { get; set; }
        public string url { get; set; }
        public string userId { get; set; }
        public string body { get; set; }
        public DateTime dateTime { get; set; }

    }
}
