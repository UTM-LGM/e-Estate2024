using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace E_EstateV2_API.Models
{
    public class CompanyDetail
    {
        [Key]
        public int Id { get; set; }
        public int companyId { get; set; }
        public string createdBy { get; set; }
        public DateTime createdDate { get; set; }
        public string updatedBy { get; set; }
        public DateTime updatedDate { get; set; }

        [ForeignKey("MembershipTypeId")]
        public int membershipTypeId { get; set; }

    }
}
