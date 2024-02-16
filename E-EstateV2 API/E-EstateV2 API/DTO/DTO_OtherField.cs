namespace E_EstateV2_API.DTO
{
    public class DTO_OtherField
    {
        public int id {  get; set; }
        public string fieldName { get; set; }
        public int area { get; set; }
        public int estateId { get; set; }
        public int cropTypeId { get; set; }
        public bool isActive { get; set; }
        public string cropType { get; set; }
    }
}
