using E_EstateV2_API.Models;

namespace E_EstateV2_API.IRepository
{
    public interface IRubberSaleIntegrationRepository
    {
        Task<RubberSales> UpdateWeightSlipNo(string LOC, RubberSales rubberSales);
        Task<RubberSales> UpdateReceiptNo(string LOC, RubberSales rubberSales);
        Task<object> GetRubberSaleByLOC(string LOC, string buyerLicenseNo);
        Task<RubberSales> UpdateReceiptNoRimNiaga(string LOC, RubberSales rubberSales);
        Task<object> GetRubberSaleByLOCUIP(string LOC);
    }
}
