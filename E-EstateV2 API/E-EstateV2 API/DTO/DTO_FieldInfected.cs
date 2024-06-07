namespace E_EstateV2_API.DTO
{
    public class DTO_FieldInfected
    {
        public int id { get; set; }
        public int? fieldId { get; set; }
        public int? fieldDiseaseId { get; set; }
        public string diseaseName { get; set; }
        public int areaInfected { get; set; }
        public string remark { get; set; }
        public bool isActive { get; set; }
        public string fieldName { get; set; }
        public DateTime dateScreening { get; set; }
        public DateTime? dateRecovered { get; set; }
        public string severityLevel { get; set; }
        public float area { get; set; }
    }
}
