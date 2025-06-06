using System.ComponentModel.DataAnnotations;

namespace E_EstateV2_API.Models
{
    public class Announcement
    {
        [Key]
        public int Id { get; set; }
        public string tittle { get; set; }
        public bool isActive { get; set; }
        public string createdBy { get; set; }
        public DateTime createdDate { get; set; }
        public string updatedBy { get; set; }
        public DateTime updatedDate { get; set; }
        public string filePath { get; set; }
        public int hierarchy { get; set; }
    }
}
