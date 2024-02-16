using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace E_EstateV2_API.Models
{
    public class BuyerCompany
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("CompanyId")]
        public int companyId { get; set; }
        public Company company { get; set; }

        [ForeignKey("BuyerId")]
        public int buyerId { get; set; }
        public Buyer buyer { get; set; }

    }
}
