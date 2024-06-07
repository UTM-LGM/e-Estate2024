using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace E_EstateV2_API.Models
{
    public class Field
    {
        [Key]
        public int Id { get; set; }
        public string fieldName { get; set; }
        public float area { get; set; }
        public bool isMature { get; set; }
        public bool isActive { get; set; }
        public DateTime? dateOpenTapping { get; set; }
        public int yearPlanted { get; set; }
        public int totalTask { get; set; }
        public int initialTreeStand { get; set; }
        public string createdBy { get; set; }
        public DateTime createdDate { get; set; }
        public string updatedBy { get; set; }
        public DateTime updatedDate { get; set; }

        [ForeignKey("FieldStatusId")]
        public int? fieldStatusId { get; set; }
        public FieldStatus FieldStatus { get; set; }
        public int estateId { get; set; }

    }
}
