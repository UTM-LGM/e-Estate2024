using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace E_EstateV2_API.Models
{
    public class EstateContact
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
        [ForeignKey("EstateId")]
        public int EstateId { get; set; }
        public Estate Estate { get; set; }
    }
}
