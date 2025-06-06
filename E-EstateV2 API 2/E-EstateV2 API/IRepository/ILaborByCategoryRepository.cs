using E_EstateV2_API.DTO;
using E_EstateV2_API.Models;

namespace E_EstateV2_API.IRepository
{
    public interface ILaborByCategoryRepository
    {
        Task<IEnumerable<LaborByCategory>> AddLaborByCategory(LaborByCategory[] laborByCategory);
        Task<List<DTO_LaborByCategory>> GetLaborByCategories();
        Task<IEnumerable<LaborByCategory>> UpdateLaborCategory(LaborByCategory[] laborByCategory);
        Task<DTO_LaborByCategory> GetLaborByCategoriesByLaborInfoId(int id);
        Task<IEnumerable<LaborByCategory>> DeleteLaborCategory(int laborInfoId);
    }
}
