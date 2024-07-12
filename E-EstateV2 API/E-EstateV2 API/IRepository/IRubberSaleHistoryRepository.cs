using E_EstateV2_API.Models;

namespace E_EstateV2_API.IRepository
{
    public interface IRubberSaleHistoryRepository
    {
        Task<RubberSaleHistory> AddRubberSaleHistory(RubberSaleHistory history);
    }
}
