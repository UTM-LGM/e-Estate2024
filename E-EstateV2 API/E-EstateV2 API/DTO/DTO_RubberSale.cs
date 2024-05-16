namespace E_EstateV2_API.ViewModel
{
    public class DTO_RubberSale
    {
        public int id { get; set; }
        public DateTime saleDateTime { get; set; }
        public string buyerName { get; set; }
        public string rubberType { get; set; }
        public string letterOfConsentNo { get; set; }
        public string receiptNo { get; set; }
        public string transportPlateNo { get; set; }
        public string driverName { get; set; }
        public string remark { get; set; }
        public float wetWeight { get; set; }
        public float buyerWetWeight { get; set; }

        public float DRC { get; set; }
        public float buyerDRC { get; set; }

        public float unitPrice { get; set; }
        public float total { get; set; }
        public string weightSlipNo { get; set; }
        public int estateId { get; set; }

        public bool isActive { get; set; }
        public int buyerId { get; set; }
        public string buyerLicenseNo { get; set; }
        public int companyId { get; set; }
        public int paymentStatusId { get; set; }
        public string paymentStatus { get; set; }
        public string deliveryAgent { get; set; }
    }
}
