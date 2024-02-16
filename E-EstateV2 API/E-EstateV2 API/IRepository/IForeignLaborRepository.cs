using E_EstateV2_API.Models;
using E_EstateV2_API.ViewModel;

namespace E_EstateV2_API.IRepository
{
    public interface IForeignLaborRepository
    {
        Task<ForeignLabor> AddForeignLabor(ForeignLabor foreignLabor);  
        Task<List<DTO_ForeignLabor>> GetForeignLabors();
        Task<ForeignLabor> UpdateForeignLabor(ForeignLabor foreignLabor);
        Task<ForeignLabor> DeleteForeignLabor(int id);
    }
}
