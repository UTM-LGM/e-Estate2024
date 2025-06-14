﻿using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace E_EstateV2_API.Models
{
    public class RubberSaleHistory
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

        public string? transactionLicenseNo { get; set; }
        public bool isActive { get; set; }
        public string createdBy { get; set; }
        public DateTime createdDate { get; set; }
        public string updatedBy { get; set; }
        public DateTime updatedDate { get; set; }

        [ForeignKey("BuyerId")]
        public int buyerId { get; set; }
        public Buyer buyer { get; set; }

        [ForeignKey("PaymentStatusId")]
        public int paymentStatusId { get; set; }
        public PaymentStatus paymentStatus { get; set; }

        public bool MSNRStatus { get; set; }

        [ForeignKey("RubberSalesId")]
        public int rubberSalesId { get; set; }
        public RubberSales RubberSales { get; set; }
    }
}
