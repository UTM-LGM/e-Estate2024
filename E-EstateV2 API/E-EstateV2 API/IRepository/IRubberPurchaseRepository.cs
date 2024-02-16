using E_EstateV2_API.Models;
using E_EstateV2_API.ViewModel;

namespace E_EstateV2_API.IRepository
{
    public interface IRubberPurchaseRepository
    {
        Task<RubberPurchase> AddPurchase(RubberPurchase purchase);
        Task<List<DTO_RubberPurchase>> GetRubberPurchases();
        Task<RubberPurchase> UpdateRubberPurchase(RubberPurchase purchase);
    }
}
