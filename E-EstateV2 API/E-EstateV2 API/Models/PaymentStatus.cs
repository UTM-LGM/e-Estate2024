using System.ComponentModel.DataAnnotations;

namespace E_EstateV2_API.Models
{
    public class PaymentStatus
    {
        [Key]
        public int id { get; set; }
        public string status { get; set; }
    }
}
