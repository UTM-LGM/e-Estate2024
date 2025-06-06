using E_EstateV2_API.Models;
using E_EstateV2_API.ViewModel;

namespace E_EstateV2_API.IRepository
{
    public interface ILaborInformationRepository
    {
        Task<LaborInfo> AddLaborInfo(LaborInfo laborInfo);
        Task<List<DTO_LaborInfo>> GetLaborInfo();
        Task<LaborInfo> UpdateLaborInfo(LaborInfo laborInfo);
        Task<LaborInfo> DeleteLaborInfo(int id);
        Task<List<DTO_LaborInfo>> GetLaborInfoByEstateId(int id);
    }
}
