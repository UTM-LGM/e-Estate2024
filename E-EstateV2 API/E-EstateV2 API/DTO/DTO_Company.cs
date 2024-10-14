using E_EstateV2_API.DTO;

namespace E_EstateV2_API.ViewModel
{
    public class DTO_Company
    {
        public int id { get; set; }
        public string companyName { get; set; }
        public string address1 { get; set; }
        public string address2 { get; set; }
        public string address3 { get; set; }
        public string postcode { get; set; }
        public string phone { get; set; }
        public string email { get; set; }
        public string fax { get; set; }
        public string contactNo { get; set; }
        public string managerName { get; set; }
        public bool isActive { get; set; }
        public string state { get; set; }
        public int townId { get; set; }
        public int stateId { get; set; }
        public int ownershipId { get; set; }

        public List<DTO_Town> towns { get; set; }
        public List<DTO_Estate> estates { get; set; }
        public List<DTO_Ownership> ownerships { get; set; }
    }
}
