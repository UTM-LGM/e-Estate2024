using E_EstateV2_API.Models;
using E_EstateV2_API.ViewModel;

namespace E_EstateV2_API.IRepository
{
    public interface ILocalLaborRepository
    {
        Task<IEnumerable<LocalLabor>> AddLocalLabor(LocalLabor[] localLabor);
        Task<List<DTO_LocalLabor>> GetLocalLabors();
        Task<LocalLabor> UpdateLocalLabor(LocalLabor localLabor);
    }
}
