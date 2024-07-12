using E_EstateV2_API.Models;

namespace E_EstateV2_API.IRepository
{
    public interface IFieldInfectedHistoryRepository
    {
        Task<FieldInfectedHistory> AddFieldInfectedHistory(FieldInfectedHistory history);
    }
}
