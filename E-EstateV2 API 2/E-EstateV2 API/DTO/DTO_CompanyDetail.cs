namespace E_EstateV2_API.DTO
{
    public class DTO_CompanyDetail
    {
        public int id { get; set; }
        public int companyId { get; set; }
        public int membershipTypeId { get; set; }
        public string membershipType { get; set; } 
        public string startFinancialYear { get; set; }
        public string endFinancialYear { get; set; }
    }
}
