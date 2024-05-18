using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace E_EstateV2_API.Models
{
    public class FieldConversion
    {
        //[Key]
        public int Id { get; set; }
        [ForeignKey("FieldId")]
        public int fieldId { get; set; }
        public Field Field { get; set; }
        public int otherCropId { get; set; }
        public int sinceYear { get; set; }
        public string createdBy { get; set; }
        public DateTime createdDate { get; set; }
        public string updatedBy { get; set; }
        public DateTime updatedDate { get; set; }
    }
}
