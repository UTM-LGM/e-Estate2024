using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Globalization;

namespace E_EstateV2_API.Models
{
    public class FieldGrant
    {
        [Key]
        public int Id { get; set; }
        public string grantTitle { get; set; }
        public float grantArea { get; set; }
        public float grantRubberArea { get; set; }
        public bool isActive { get; set; }
        public string createdBy { get; set; }
        public DateTime createdDate { get; set; }
        public string updatedBy { get; set; }
        public DateTime updatedDate { get; set; }

        [ForeignKey("FieldId")]
        public int fieldId { get; set; }
    }
}
