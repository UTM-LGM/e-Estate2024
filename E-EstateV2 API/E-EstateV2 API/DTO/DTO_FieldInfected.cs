namespace E_EstateV2_API.DTO
{
    public class DTO_FieldInfected
    {
        public int id { get; set; }
        public int? fieldId { get; set; }
        public int? fieldDiseaseId { get; set; }
        public string diseaseName { get; set; }
        public float areaInfected { get; set; }
        public int areaInfectedPercentage { get; set; }
        public string remark { get; set; }
        public bool isActive { get; set; }
        public string fieldName { get; set; }
        public DateTime dateScreening { get; set; }
        public DateTime? dateRecovered { get; set; }
        public string severityLevel { get; set; }
        public float area { get; set; }
        public string diseaseCategory { get; set; }
        public int diseaseCategoryId { get; set; }
    }
}
