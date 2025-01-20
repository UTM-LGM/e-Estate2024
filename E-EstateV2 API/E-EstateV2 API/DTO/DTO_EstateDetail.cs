namespace E_EstateV2_API.DTO
{
    public class DTO_EstateDetail
    {
        public int id { get; set; }
        public int estateId { get; set; }
        public string grantNo { get; set; }
        public int plantingMaterialId { get; set; }
        public string plantingMaterial { get;set; }
        public bool MSNRStatus { get; set; }
        public float polygonArea { get; set; }

    }
}
