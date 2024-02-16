namespace E_EstateV2_API.ViewModel
{
    public class DTO_User
    {
        public string id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string CompanyId { get; set; }
        public string EstateId { get; set; }
        public string FullName { get; set; }
        public string Position { get; set; }
        public string RoleName { get; set; }
        public string RoleId { get; set; }
        public string CompanyPhoneNo { get; set; }
        public string EstateName { get; set; }
        public string CompanyName { get; set; }
        public string NewPassword { get; set; }
        public string Token { get; set; }
        public string OldPassword { get; set; }
        public bool isEmailVerified { get; set; }
    }
}
