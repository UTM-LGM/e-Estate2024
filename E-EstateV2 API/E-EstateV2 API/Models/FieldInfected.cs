using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace E_EstateV2_API.Models
{
    public class FieldInfected
    {
        [Key]
        public int Id { get; set; }
        public int areaInfected { get; set; }
        public DateTime dateScreening { get; set; }
        public DateTime? dateRecovered { get; set; }
        public string severityLevel { get; set; }
        public string remark { get; set; }
        public bool isActive { get; set; }
        public string createdBy { get; set; }
        public DateTime createdDate { get; set; }
        public string updatedBy { get; set; }
        public DateTime updatedDate { get; set; }

        [ForeignKey("FieldDiseaseId")]
        public int? fieldDiseaseId { get; set; }
        public FieldDisease FieldDisease { get; set; }

        [ForeignKey("FieldId")]
        public int? fieldId { get; set; }
        public Field Field { get; set; }
    }
}
