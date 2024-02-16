using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace E_EstateV2_API.Models
{
    public class Buyer
    {
        [Key]
        public int Id { get; set; }
        public string buyerName { get; set; }
        public string licenseNo { get; set; }
        public bool isActive { get; set; }
        public string createdBy { get; set; }
        public DateTime createdDate { get; set; } 
        public string updatedBy { get; set; }
        public DateTime updatedDate { get; set; }

        [ForeignKey("EstateId")]
        public int? estateId { get; set; }
        public Estate Estate { get; set; }

        //many to many relation
        public ICollection <BuyerCompany> BuyerCompanies { get; set; }
    }
}
