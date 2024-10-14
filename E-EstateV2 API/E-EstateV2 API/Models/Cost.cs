using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace E_EstateV2_API.Models
{
    public class Cost
    {
        [Key]
        public int Id { get; set; }
        public bool? isMature { get; set; }
        public bool isActive { get; set; }
        public string createdBy { get; set; }
        public DateTime createdDate { get; set; }
        public string updatedBy { get; set; }
        public DateTime updatedDate { get; set; }

        [ForeignKey("CostTypeId")]
        public int costTypeId { get; set; }
        public CostType CostType { get; set; }

        [ForeignKey("CostCategoryId")]
        public int costCategoryId { get; set; }
        public CostCategory CostCategory { get; set; }

        [ForeignKey("CostSubcategory1Id")]
        public int costSubcategory1Id { get; set; }
        public CostSubcategory1 CostSubcategory1 { get; set; }

        [ForeignKey("CostSubcategory2Id")]
        public int costSubcategory2Id { get;set; }
        public CostSubcategory2 CostSubcategory2 { get; set; }
    }
}
