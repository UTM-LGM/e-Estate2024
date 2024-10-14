using E_EstateV2_API.Models;
using E_EstateV2_API.ViewModel;
using System.Threading.Tasks;

namespace E_EstateV2_API.IRepository
{
    public interface ITownRepository
    {
        Task<List<DTO_Town>> GetTowns();
        Task<Town> AddTown(Town town);
        Task<Town> UpdateTown(Town town);
    }
}
