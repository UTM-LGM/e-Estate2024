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

        Task<object> GetAllProductivityYearlyByClone(string start, string end);

        Task<object> GetLaborInformationCategory(int year);
        Task<object> GetAllLaborInformationCategory(string start, string end);

        Task<object> GetProductivity();
        Task<object> GetCurrentProduction(int year);

        Task<object> GetFieldArea(int year);
        Task<object> GetStateFieldArea(string start, string end, int estateId);
        Task<object> GetFieldsByEstateId(int estateId);
        Task<object> GetLatestMonthWorker(int year);
        Task<object> GetTapperAndFieldWorker(int year);
        Task<object> GetAllTapperAndFieldWorker(string start, string end);
        Task<object> GetWorkerShortageEstate(int year);
        Task<object> GetAllWorkerShortageEstate(string start, string end);

        Task<object> GetCostInformation(int year);
        Task<object> GetAllCostInformation(string start, string end);
        Task<object> GetAreaByClone(int year);
        Task<object> GetAreaByAllClone(string start, string end);


        Task<object> GetCurrentField();

        Task<object> GetAllRubberSale(string start, string end);
        Task<object> GetProduction();
        Task<object> GetSales();
        Task<object> GetStocks();

        Task<object> GetFieldAreaByDate(string start, string end, int estateId);


        //Task<List<DTO_FieldProduction>> GetProductionByYear(int year);
    }
}
