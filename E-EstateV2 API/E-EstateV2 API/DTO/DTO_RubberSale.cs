namespace E_EstateV2_API.ViewModel
{
    public class DTO_RubberSale
    {
        public int id { get; set; }
        public string date { get; set; }
        public string buyerName { get; set; }
        public string rubberType { get; set; }
        public string authorizationLetter { get; set; }
        public string receiptNo { get; set; }
        public float weight { get; set; }
        public float DRC { get; set; }
        public float amountPaid { get; set; }
        public bool isActive { get; set; }
        public int buyerId { get; set; }
        public int companyId { get; set; }
        public int estateId { get; set; }
    }
}
