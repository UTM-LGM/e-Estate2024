namespace E_EstateV2_API.DTO
{
    public class DTO_FieldClone
    {
        public int Id { get; set; }
        public string createdBy { get; set; }
        public DateTime createdDate { get; set; }
        public string updatedBy { get; set; }
        public DateTime updatedDate { get; set; }
        public bool isActive { get; set; }
        public string cloneName { get; set; }  
        public int cloneId { get; set; }
    }
}
