using Microsoft.AspNetCore.Routing.Constraints;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace E_EstateV2_API.Models
{
    public class RubberSales
    {
        [Key]
        public int Id { get; set; }
        public DateTime saleDateTime { get; set; }
        public string rubberType { get; set; }
        public string letterOfConsentNo { get; set; }
        public string receiptNo { get; set; }
        public DateTime receiptNoDate { get; set; }
        public float wetWeight { get; set; }
        public float buyerWetWeight { get; set; }
        public float DRC { get; set; }
        public float buyerDRC { get; set; }
        public float unitPrice { get; set; }
        public float total { get; set; }
        public string weightSlipNo { get; set; }
        public DateTime weightSlipNoDate { get; set; }
        public string transportPlateNo { get; set; }
        public string driverName { get; set; }
        public string driverIc { get; set; }
        public string remark { get; set; }
        public string deliveryAgent { get; set; }
        public int estateId { get; set; }
        public bool isActive { get; set; }
        public string createdBy { get; set; }
        public DateTime createdDate { get; set; }
        public string updatedBy { get; set; }
        public DateTime updatedDate { get; set; }

        public string licenseNoTrace { get; set; }

        [ForeignKey("BuyerId")]
        public int? buyerId { get; set; }
        public Buyer buyer { get; set; }

        [ForeignKey("PaymentStatusId")]
        public int paymentStatusId { get; set; }
        public PaymentStatus paymentStatus { get; set; }

        public bool MSNRStatus { get; set; }
        public float polygonArea { get; set; }

    }
}
