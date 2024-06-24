using E_EstateV2_API.Models;

namespace E_EstateV2_API.IRepository
{
    public interface IFieldGrantRepository
    {
        Task<IEnumerable<FieldGrant>> AddFieldGrant(FieldGrant[] fieldGrant);
        Task<List<FieldGrant>> UpdateFieldGrant(int fieldId);
        Task<List<FieldGrant>> GetFieldGrantByFieldId(int fieldId);
        Task DeleteFieldGrant(FieldGrant fieldGrant);
        Task<FieldGrant> GetFieldGrantById(int grantId);
        Task<FieldGrant> AddGrant(FieldGrant grant);
    }
}
