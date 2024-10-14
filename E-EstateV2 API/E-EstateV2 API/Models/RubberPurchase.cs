using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace E_EstateV2_API.Models
{
    public class RubberPurchase
    {
        [Key]
        public int Id { get; set; }
        public string date { get; set; }
        public string project { get; set; }
        public string rubberType { get; set; }
        public string authorizationLetter { get; set; }
        public float weight { get; set; }
        public float DRC { get; set; }
        public decimal price { get; set; }
        public decimal totalPrice { get; set; }
        public bool isActive { get; set; }
        public string createdBy { get; set; }
        public DateTime createdDate { get; set; }
        public string updatedBy { get; set; }
        public DateTime updatedDate { get; set; }

        [ForeignKey("SellerId")]
        public int sellerId { get; set; }
        public Seller seller { get; set; }

        [ForeignKey("CompanyId")]
        public int companyId { get; set; }
        public Company company { get; set; }

        [ForeignKey("EstateId")]
        public int estateId { get; set; }
        public Estate Estate { get; set; }
    }
}
