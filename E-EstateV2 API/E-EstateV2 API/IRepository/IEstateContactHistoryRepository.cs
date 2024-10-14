using E_EstateV2_API.Models;

namespace E_EstateV2_API.IRepository
{
    public interface IEstateContactHistoryRepository
    {
        Task<EstateContactHistory> AddEstateContactHistory(EstateContactHistory history);
    }
}
