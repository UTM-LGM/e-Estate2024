using E_EstateV2_API.DTO;
using E_EstateV2_API.Models;

namespace E_EstateV2_API.IRepository
{
    public interface IOtherFieldRepository
    {
        Task<List<DTO_OtherField>> GetOtherFields();
        Task<DTO_OtherField> GetOtherFieldById(int id);
        Task<OtherField> AddOtherField(OtherField otherField);
        Task<OtherField> UpdateOtherField(OtherField otherField);
        Task<Object> CheckOtherFieldName(string fieldName);
    }
}
