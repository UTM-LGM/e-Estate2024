using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace E_EstateV2_API.Models
{
    public class FieldClone
    {
        [Key]
        public int Id { get; set; }
        public string createdBy { get; set; }
        public DateTime createdDate { get; set; }
        public string updatedBy { get; set; }
        public DateTime updatedDate { get; set; }
        public bool isActive { get; set; }

        [ForeignKey("FieldId")]
        public int fieldId { get; set; }
        //Navigation properties
        public Field Field { get; set; }

        [ForeignKey("CloneId")]
        public int cloneId { get; set; }
        public Clone Clone { get; set; }
        
    }
}
