namespace E_EstateV2_API.Models
{
    public class User
    {
        public string userName { get; set; }
        public string password { get; set; }
        public string email { get; set; }
        public string roleId { get; set; }
        public int companyId { get; set; }
        public int estateId { get; set; }
        public string fullName { get; set; }
        public string licenseNo { get; set; }
        public string position { get; set; }
    }
}
