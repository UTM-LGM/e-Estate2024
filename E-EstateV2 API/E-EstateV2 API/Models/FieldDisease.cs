using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace E_EstateV2_API.Models
{
    public class FieldDisease
    {
        [Key]
        public int Id { get; set; }
        public string diseaseName { get; set; }
        public bool isActive { get; set; }
        public string createdBy { get; set; }
        public DateTime createdDate { get; set; }
        public string updatedBy { get; set; }
        public DateTime updatedDate { get; set; }
        [ForeignKey("diseaseCategory")]
        public int diseaseCategoryId { get; set; }
        public DiseaseCategory DiseaseCategory { get; set; }

    }
}
