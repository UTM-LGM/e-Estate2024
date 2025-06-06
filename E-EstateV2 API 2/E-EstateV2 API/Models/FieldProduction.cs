using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace E_EstateV2_API.Models
{
    public class FieldProduction
    {
        [Key]
        public int Id { get; set; }
        public string monthYear { get; set; }
        public float cuplump { get; set; }
        public float cuplumpDRC { get; set; }
        public float latex { get; set; }
        public float latexDRC { get; set; }
        public int noTaskTap { get; set; }
        public int noTaskUntap { get; set; }
        public string remarkUntap { get; set; }
        public string createdBy { get; set; }
        public DateTime createdDate { get; set; }
        public string updatedBy { get; set; }
        public DateTime updatedDate { get; set; }
        public string status { get; set; }


        [ForeignKey("FieldId")]
        public int fieldId { get; set; }
        public Field Field { get; set; }
    }
}
