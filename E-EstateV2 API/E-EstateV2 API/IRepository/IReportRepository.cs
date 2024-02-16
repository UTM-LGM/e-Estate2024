using E_EstateV2_API.ViewModel;
using Microsoft.AspNetCore.Mvc;

namespace E_EstateV2_API.IRepository
{
    public interface IReportRepository
    {
        Task<object> GetProductionYearlyByField(int year);
        Task<List<DTO_FieldProduction>> GetCurrentProduction();
        List<DTO_FieldProduction> GetProductionYearly(int year);
        Task<object> GetCurrentLocalLabor();
        Task<object> GetCurrentForeignLabor();
        Task<object> GetProductionYearlyByClone(int year);
    }
}
