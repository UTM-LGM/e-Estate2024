using E_EstateV2_API.DTO;
using E_EstateV2_API.Models;

namespace E_EstateV2_API.IRepository
{
    public interface IFieldInfectedRepository:IGenericRepository<FieldInfected>
    {
        Task<List<DTO_FieldInfected>> GetFieldInfectedByEstateId(int estateId);
        Task<FieldInfected> UpdateFieldInfectedRemark(FieldInfected fieldInfected);
        Task<List<DTO_FieldInfected>> GetFieldInfectedById(int id);
    }
}
