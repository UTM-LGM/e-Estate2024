namespace E_EstateV2_API.ViewModel
{
    public class DTO_RubberPurchase
    {
        public int id { get; set; }
        public string date { get; set; }
        public string sellerName { get; set; }
        public string rubberType { get; set; }
        public string authorizationLetter { get; set; }
        public string project { get; set; }
        public float weight { get; set; }
        public float DRC { get; set; }
        public decimal price { get; set; }
        public decimal totalPrice { get; set; }
        public bool isActive { get; set; }
        public int sellerId { get; set; }
        public int companyId { get; set; }
        public int estateId { get; set; }

    }
}
