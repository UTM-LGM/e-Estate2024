using E_EstateV2_API.Models;
using E_EstateV2_API.ViewModel;

namespace E_EstateV2_API.IRepository
{
    public interface IFieldConversionRepository
    {
        Task<FieldConversion> AddFieldClone(FieldConversion fieldConversion);
        Task<List<DTO_FieldConversion>> GetFieldClones();
        Task<FieldConversion> UpdateFieldCLone (FieldConversion fieldConversion);
    }
}
