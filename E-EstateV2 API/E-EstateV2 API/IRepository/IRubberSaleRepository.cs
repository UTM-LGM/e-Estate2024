using E_EstateV2_API.Models;
using E_EstateV2_API.ViewModel;

namespace E_EstateV2_API.IRepository
{
    public interface IRubberSaleRepository
    {
        Task<RubberSales> AddSale(RubberSales sales);
        Task<List<DTO_RubberSale>> GetRubberSales();
        Task<RubberSales> UpdateRubberSale(RubberSales sales);
        Task<DTO_RubberSale> GetRubberSaleById(int id);
    }
}
