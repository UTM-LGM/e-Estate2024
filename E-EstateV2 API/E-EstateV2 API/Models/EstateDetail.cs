using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace E_EstateV2_API.Models
{
    public class EstateDetail
    {
        [Key]
        public int Id { get; set; }
        public int estateId { get; set; }
        public string createdBy { get; set; }
        public DateTime createdDate { get; set; }
        public string updatedBy { get; set; }
        public DateTime updatedDate { get; set; }
        [ForeignKey("PlantingMaterialId")]
        public int plantingMaterialId { get; set; }
        public PlantingMaterial PlantingMaterial { get; set; }

        public int estateIdOld { get; set; }
        public string licenseNo { get; set; }

        public float polygonArea { get; set; }
        public bool MSNRStatus { get; set; }
        public bool isPDPA { get; set; }
        
    }
}
