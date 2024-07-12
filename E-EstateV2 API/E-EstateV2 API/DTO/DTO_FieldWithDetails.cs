using E_EstateV2_API.Models;

namespace E_EstateV2_API.DTO
{
    public class DTO_FieldWithDetails
    {
        public Field Field { get; set; }
        public FieldClone[] FieldClones { get; set; }
        public FieldGrant[] FieldGrants { get; set; }
    }
}
