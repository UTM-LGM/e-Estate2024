using E_EstateV2_API.Models;

namespace E_EstateV2_API.IRepository
{
    public interface IFieldCloneRepository
    {

        Task<IEnumerable<FieldClone>> AddFieldClone(FieldClone[] fieldClone);
        Task<List<FieldClone>> UpdateFieldCloneStatus(int fieldId);
    }
}
