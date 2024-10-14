namespace E_EstateV2_API.Models
{
    public class Email
    {
        //for email country
        public string from { get; set; }
        public string userName { get; set; }
        public string country { get; set; }
        public string userId { get; set; }
        //for email verification
        public string to { get; set; }
    }
}
