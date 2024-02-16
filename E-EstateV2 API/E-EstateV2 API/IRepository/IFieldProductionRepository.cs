using E_EstateV2_API.Models;
using E_EstateV2_API.ViewModel;

namespace E_EstateV2_API.IRepository
{
    public interface IFieldProductionRepository
    {
        Task<List<DTO_FieldProduction>> GetFieldProductions();
        Task<IEnumerable<FieldProduction>> AddFieldProduction (FieldProduction[] fieldProduction);
        Task<FieldProduction> UpdateFieldProduction (FieldProduction fieldProduction);
    }
}
