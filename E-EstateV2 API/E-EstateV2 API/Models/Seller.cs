using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace E_EstateV2_API.Models
{
    public class Seller
    {
        [Key]
        public int Id { get; set; }
        public string sellerName { get; set; }
        public string licenseNo { get; set; }
        public bool isActive { get; set; }
        public string createdBy { get; set; }
        public DateTime createdDate { get; set; }
        public string updatedBy { get; set; }
        public DateTime updatedDate { get; set; }

        [ForeignKey("EstateId")]
        public int estateId { get; set; }
        public Estate Estate { get; set; }
        public ICollection<SellerCompany> SellerCompanies { get; set; }

    }
}
