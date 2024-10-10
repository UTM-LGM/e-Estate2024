using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace E_EstateV2_API.Models
{
    public class FieldGrantAttachment
    {
        [Key]
        public int Id { get; set; }
        public string fileName { get; set; }
        public bool isActive { get; set; }
        public string createdBy { get; set; }
        public DateTime createdDate { get; set; }
        public string updatedBy { get; set; }
        public DateTime updatedDate { get; set; }

        [ForeignKey("FieldGrantId")]
        public int fieldGrantId { get; set; }
        public FieldGrant FieldGrant { get; set; }
    }
}
