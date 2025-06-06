using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace E_EstateV2_API.Models
{
    public class SellerCompany
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("CompanyId")]
        public int companyId { get; set; }
        public Company company { get; set; }

        [ForeignKey("SellerId")]
        public int sellerId { get; set; }
        public Seller seller { get; set; }
    }
}
