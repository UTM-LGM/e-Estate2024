using E_EstateV2_API.DTO;

namespace E_EstateV2_API.IRepository
{
    public interface IFieldDiseaseRepository
    {
        Task<List<DTO_DiseaseCategory>> GetFieldDisease();
    }
}
