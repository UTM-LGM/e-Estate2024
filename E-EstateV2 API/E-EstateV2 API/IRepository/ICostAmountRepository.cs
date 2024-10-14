using E_EstateV2_API.Models;
using E_EstateV2_API.ViewModel;

namespace E_EstateV2_API.IRepository
{
    public interface ICostAmountRepository
    {
        //used if got foreach 
        Task<IEnumerable<CostAmount>> AddCostAmount(CostAmount[] costAmount);
        Task<List<DTO_CostAmount>> GetCostAmounts(); 
        Task<IEnumerable<CostAmount>> UpdateCostAmount(CostAmount[] costAmount);
    }
}
