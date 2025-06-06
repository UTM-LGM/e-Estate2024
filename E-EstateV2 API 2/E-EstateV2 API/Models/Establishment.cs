using System.ComponentModel.DataAnnotations;

namespace E_EstateV2_API.Models
{
    public class Establishment
    {
        [Key]
        public int Id { get; set; }
        public string establishment { get; set; }
        public bool isActive { get; set; }
        public string createdBy { get; set; }
        public DateTime createdDate { get; set; }
        public string updatedBy { get; set; }
        public DateTime updatedDate { get; set; }
    }
}
