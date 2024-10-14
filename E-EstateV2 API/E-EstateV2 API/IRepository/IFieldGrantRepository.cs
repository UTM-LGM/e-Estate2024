using E_EstateV2_API.DTO;
using E_EstateV2_API.Models;

namespace E_EstateV2_API.IRepository
{
    public interface IFieldGrantRepository
    {
        Task<IEnumerable<FieldGrant>> AddFieldGrant(FieldGrant[] fieldGrant);
        Task<List<FieldGrant>> UpdateFieldGrant(int fieldId);
        Task<List<DTO_FieldGrant>> GetFieldGrantByFieldId(int fieldId);
        Task DeleteFieldGrant(FieldGrant fieldGrant);
        Task<FieldGrant> GetFieldGrantById(int grantId);
        Task<FieldGrant> AddGrant(FieldGrant grant);
        Task<List<FieldGrant>> UpdateFieldGrants(int fieldId, FieldGrant[] updatedFieldGrants);
        Task AddFieldGrantAttachment(FieldGrantAttachment attachment);
        Task<IEnumerable<FieldGrantAttachment>> GetAttachmentsByFieldGrantId(int fieldGrantId);
        Task UpdateFieldGrantAttachment(FieldGrantAttachment updatedAttachment);


    }
}
