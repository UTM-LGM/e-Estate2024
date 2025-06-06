using E_EstateV2_API.Models;

namespace E_EstateV2_API.IRepository
{
    public interface IFieldHistoryRepository
    {
        Task<FieldHistory>AddFieldHistory(FieldHistory history);
    }
}
