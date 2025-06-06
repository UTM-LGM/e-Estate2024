using System.ComponentModel.DataAnnotations;

namespace E_EstateV2_API.Models
{
    public class GrantTitle
    {
        [Key]
        public int Id { get; set; }
        public string licenseNo { get; set; }
        public int estateId { get; set; }
        public string grantTitle { get; set; }
    }
}
