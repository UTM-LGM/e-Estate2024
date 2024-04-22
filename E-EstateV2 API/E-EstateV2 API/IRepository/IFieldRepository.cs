using E_EstateV2_API.Models;
using E_EstateV2_API.ViewModel;

namespace E_EstateV2_API.IRepository
{
    public interface IFieldRepository
    {
        Task<Field> AddField(Field field);
        Task<List<DTO_Field>> GetFields();
        Task<List<DTO_Field>> GetFieldDescStatus();
        Task<DTO_Field> GetFieldById(int id);
        Task<Field> UpdateField(Field field);
        Task<FieldClone> AddFieldClone(FieldClone clone);
        Task<FieldClone> GetFieldCloneById(int cloneId, int fieldId);
        Task DeleteFieldClone(FieldClone fieldClone);
        Task<Field> UpdateFieldInfected(Field field);
    }
}
