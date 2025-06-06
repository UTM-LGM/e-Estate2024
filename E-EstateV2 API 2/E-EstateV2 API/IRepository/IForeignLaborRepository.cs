using E_EstateV2_API.Models;
using E_EstateV2_API.ViewModel;

namespace E_EstateV2_API.IRepository
{
    public interface IForeignLaborRepository
    {
        Task<LaborInfo> AddForeignLabor(LaborInfo foreignLabor);  
        Task<List<DTO_LaborInfo>> GetForeignLabors();
        Task<LaborInfo> UpdateForeignLabor(LaborInfo foreignLabor);
        Task<LaborInfo> DeleteForeignLabor(int id);
    }
}
