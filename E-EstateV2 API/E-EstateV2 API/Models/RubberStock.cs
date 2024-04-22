using System.ComponentModel.DataAnnotations;

namespace E_EstateV2_API.Models
{
    public class RubberStock
    {
        [Key]
        public int Id { get; set; }
        public string monthYear { get; set; }
        public float totalProduction { get; set; }
        public float totalSale { get; set; }
        public float currentStock { get; set; }
        public float waterLoss { get; set; }
        public float previousStock { get; set; }
        public int estateId { get; set; }
        public bool isActive { get; set; }

        public string createdBy { get; set; }
        public DateTime createdDate { get; set; }
        public string updatedBy { get; set; }
        public DateTime updatedDate { get; set; }

    }
}
