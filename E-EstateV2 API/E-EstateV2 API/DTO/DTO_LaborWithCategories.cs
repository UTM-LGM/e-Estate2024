using E_EstateV2_API.Models;

namespace E_EstateV2_API.DTO
{
    public class DTO_LaborWithCategories
    {
        public LaborInfo LaborInfo { get; set; }
        public List<LaborByCategory> LaborByCategories { get; set; }
    }
}
