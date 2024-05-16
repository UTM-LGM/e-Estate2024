using E_EstateV2_API.ViewModel;
using Microsoft.AspNetCore.Mvc;

namespace E_EstateV2_API.IRepository
{
    public interface IReportRepository
    {
        Task<object> GetProductionYearlyByField(int year);
        List<DTO_FieldProduction> GetProductionYearly(int year);
        Task<object> GetProductionYearlyByClone(int year);
        Task<object> GetProductivityYearlyByClone(int year);

        Task<Object> GetLaborInformationCategory();

        Task<Object> GetProductivity();
        Task<Object> GetCurrentProduction();

        Task<object> GetFieldArea(int year);
        Task<object> GetLatestMonthWorker();
        Task<object> GetTapperAndFieldWorker();
        Task<object> GetWorkerShortageEstate();

        Task<object> GetCostInformation(int year);
        Task<object> GetAreaByClone(int year);

        Task<object> GetCurrentField(int year);



        //Task<List<DTO_FieldProduction>> GetProductionByYear(int year);
    }
}
