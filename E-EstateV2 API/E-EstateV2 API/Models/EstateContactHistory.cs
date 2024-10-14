using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace E_EstateV2_API.Models
{
    public class EstateContactHistory
    {

        [Key]
        public int Id { get; set; }
        public string name { get; set; }
        public string position { get; set; }
        public string phoneNo { get; set; }
        public string email { get; set; }
        public bool isActive { get; set; }
        public string createdBy { get; set; }
        public DateTime createdDate { get; set; }
        public string updatedBy { get; set; }
        public DateTime updatedDate { get; set; }
        public int estateId { get; set; }

        [ForeignKey("EstateContactId")]
        public int estateContactId { get; set; }
        public EstateContact EstateContact { get; set; }
    }
}
