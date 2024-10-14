using E_EstateV2_API.Models;
using E_EstateV2_API.ViewModel;

namespace E_EstateV2_API.IRepository
{
    public interface ICostRepository
    {
        Task<List<DTO_Cost>> GetCostItems();
        Task<List<DTO_Cost>> GetCostIndirectByCostTypeId(int costTypeId);
        Task<List<DTO_Cost>> GetCostCategoryM();
        Task<List<DTO_Cost>> GetCostSubCategoryM();
        Task<List<DTO_Cost>> GetCostSubCategoryIM();
        Task<Cost> AddCostItem(Cost cost);
        Task<Cost> UpdateCostItems(Cost cost);

    }
}
