using E_EstateV2_API.Data;
using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using E_EstateV2_API.ViewModel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace E_EstateV2_API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class RubberSalesController : ControllerBase
    {
        private readonly IRubberSaleRepository _rubberSalesRepository;
        public RubberSalesController(IRubberSaleRepository rubberSalesRepository)
        {
            _rubberSalesRepository = rubberSalesRepository;
        }

        [HttpPost]
        public async Task<IActionResult> AddSales([FromBody] RubberSales sales)
        {
            var result = await _rubberSalesRepository.AddSale(sales);
            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetRubberSales()
        {
            var sales = await _rubberSalesRepository.GetRubberSales();
            var sortedSales = sales.OrderByDescending(sale => sale.saleDateTime).ToList();

            return Ok(sortedSales);
        }


        [HttpPut]
        public async Task<IActionResult> UpdateRubberSales([FromBody] RubberSales rubberSales)
        {
            var result = await _rubberSalesRepository.UpdateRubberSale(rubberSales);
            return Ok(result);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetRubberSaleById([FromRoute] int id)
        {
            var rubberSale = await _rubberSalesRepository.GetRubberSaleById(id);
            return Ok(rubberSale);
        }
    }
}
