using System.ComponentModel.DataAnnotations;

namespace E_EstateV2_API.Models
{
    public class License
    {
        [Key]
        public int Id { get; set; }
        public int estateId { get; set; }
        public string? licenseNo { get; set; }
        public string? updatedBy { get; set; }
        public string? updatedDate { get; set; }
    }
}
