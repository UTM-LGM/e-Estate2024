using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace E_EstateV2_API.Models
{
    public class FieldInfoYearly
    {
        [Key]
        public int Id { get; set; }
        public int year { get; set; }
        public int currentTreeStand { get; set; }
        public string createdBy { get; set; }
        public DateTime createdDate { get; set; }
        public string updatedBy { get; set; }
        public DateTime updatedDate { get; set; }

        [ForeignKey("FieldId")]
        public int fieldId { get; set; }
        public Field Field { get; set; }

        [ForeignKey("TappingSystemId")]
        public int tappingSystemId { get; set; }
        public TappingSystem tappingSystem { get; set; }
    }
}
