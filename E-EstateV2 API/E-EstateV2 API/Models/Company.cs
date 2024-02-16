using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace E_EstateV2_API.Models
{
    public class Company
    {
        [Key]
        public int Id { get; set; }
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
        public string createdBy { get; set; }
        public DateTime createdDate { get; set; }
        public string updatedBy { get; set; }
        public DateTime updatedDate { get; set; }

        [ForeignKey("TownId")]
        public int townId { get; set; }
        public Town Town { get; set; }

        [ForeignKey("OwnershipId")]
        public int ownershipId { get; set; }
        public Ownership Ownership { get; set; }

        //many to many relation
        public ICollection<BuyerCompany> BuyerCompanies { get; set; }
        public ICollection<SellerCompany> SellerCompanies { get; set; }

    }
}
