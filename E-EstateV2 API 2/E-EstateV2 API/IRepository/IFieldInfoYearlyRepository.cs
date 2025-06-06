using E_EstateV2_API.DTO;
using E_EstateV2_API.Models;

namespace E_EstateV2_API.IRepository
{
    public interface IFieldInfoYearlyRepository
    {
        Task<IEnumerable<FieldInfoYearly>> AddFieldInfo(FieldInfoYearly[] fieldInfoYearly);
        Task<List<DTO_FieldInfoYearly>> GetFieldInfo(int year);
    }
}
