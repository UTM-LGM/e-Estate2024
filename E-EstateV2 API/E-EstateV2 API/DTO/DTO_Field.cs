using System.Security.Policy;

namespace E_EstateV2_API.ViewModel
{
    public class DTO_Field
    {
        public int id { get; set; }
        public string fieldName { get; set; }
        public float area { get; set; }
        public bool isMature { get; set; }
        public bool isActive { get; set; }
        public DateTime? dateOpenTapping { get; set; }
        public DateTime createdDate { get; set; }
        public string? dateOpenTappingFormatted { get; set; }
        public int yearPlanted { get; set; }
        public int fieldStatusId { get; set; }
        public int initialTreeStand { get; set; }
        public float rubberArea { get; set; }
        public int currentTreeStand { get; set; }
        public string tappingSystem { get; set; }
        public int totalTask { get; set; }
        public string fieldStatus { get; set; }
        public string conversionCropName { get; set; }
        public int otherCropId { get; set; }
        public int sinceYear { get; set; }
        public int conversionId { get; set; }
        public int infectedPercentage { get; set; }
        public int? fieldDiseaseId { get; set; }
        public int estateId { get; set; }
        public string remark { get; set; }

        public List<DTO_FieldStatus> fieldStatuses { get; set; }
        public List<DTO_Clone> clones { get; set; }


    }
}
