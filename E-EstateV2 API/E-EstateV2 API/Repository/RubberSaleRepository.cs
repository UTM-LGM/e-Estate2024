using E_EstateV2_API.Data;
using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using E_EstateV2_API.ViewModel;
using Microsoft.EntityFrameworkCore;

namespace E_EstateV2_API.Repository
{
    public class RubberSaleRepository:IRubberSaleRepository
    {
        private readonly ApplicationDbContext _context;

        public RubberSaleRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<RubberSales> AddSale(RubberSales sales)
        {
            sales.createdDate = DateTime.Now;
            await _context.rubberSales.AddAsync(sales);
            await _context.SaveChangesAsync();

            var buyerCompany = new BuyerCompany
            {
                buyerId = sales.buyerId,
                companyId = sales.companyId,
            };

            await _context.buyerCompanies.AddAsync(buyerCompany);
            await _context.SaveChangesAsync();

            return sales;
        }
        public async Task<List<DTO_RubberSale>> GetRubberSales()
        {
            var sales = await _context.rubberSales.Select(x => new DTO_RubberSale
            {
                id = x.Id,
                date = x.date,
                buyerName = _context.buyers.Where(y => y.Id == x.buyerId).Select(y => y.buyerName).FirstOrDefault(),
                rubberType = x.rubberType,
                authorizationLetter = x.authorizationLetter,
                receiptNo = x.receiptNo,
                weight = x.weight,
                DRC = x.DRC,
                amountPaid = x.amountPaid,
                isActive = x.isActive,
                buyerId = x.buyerId,
                companyId = x.companyId,
                estateId = x.estateId
            }).OrderBy(x => x.date).ToListAsync();
            return sales;
        }
        public async Task<RubberSales> UpdateRubberSale(RubberSales rubberSales)
        {
            var existingSale = await _context.rubberSales.FirstOrDefaultAsync(x => x.Id == rubberSales.Id);
            if (existingSale != null)
            {
                existingSale.date = rubberSales.date;
                existingSale.buyerId = rubberSales.buyerId;
                existingSale.rubberType = rubberSales.rubberType;
                existingSale.authorizationLetter = rubberSales.authorizationLetter;
                existingSale.receiptNo = rubberSales.receiptNo;
                existingSale.weight = rubberSales.weight;
                existingSale.DRC = rubberSales.DRC;
                existingSale.amountPaid = rubberSales.amountPaid;
                existingSale.updatedBy = rubberSales.updatedBy;
                existingSale.updatedDate = DateTime.Now;
                existingSale.isActive = rubberSales.isActive;
                await _context.SaveChangesAsync();
                return existingSale;
            }
            return null;
        }
    }
}
