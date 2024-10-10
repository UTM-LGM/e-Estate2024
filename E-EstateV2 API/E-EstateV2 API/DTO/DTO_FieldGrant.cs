using E_EstateV2_API.Models;

namespace E_EstateV2_API.DTO
{
    public class DTO_FieldGrant
    {
        public int Id { get; set; }
        public string grantTitle { get; set; }
        public float grantArea { get; set; }
        public float grantRubberArea { get; set; }
        public bool isActive { get; set; }

        public List<FieldGrantAttachment> files { get; set; }
    }
}
