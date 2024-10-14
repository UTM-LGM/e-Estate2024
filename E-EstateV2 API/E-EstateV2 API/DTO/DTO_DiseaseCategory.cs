namespace E_EstateV2_API.DTO
{
    public class DTO_DiseaseCategory
    {
        public int id { get; set; }
        public string category { get; set; }
        public string diseaseName { get; set; }
        public bool isActive { get; set; }
        public int diseaseCategoryId { get; set; }
    }
}
