using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace E_EstateV2_API.Models
{
    public class ProductionComparison
    {
        [Key]
        public int Id { get; set; }
        public int createdYear { get; set; }
        public string currentYear { get; set; }
        public string previousYear { get; set; }
        public string productionComparison { get; set; }
        public string reason { get; set; }
        public string createdBy { get; set; }
        public DateTime createdDate { get; set; }
        public string updatedBy { get; set; }
        public DateTime updatedDate { get; set; }

        [ForeignKey("EstateId")]
        public int estateId { get; set; }
        public Estate Estate { get; set; }

    }
}
