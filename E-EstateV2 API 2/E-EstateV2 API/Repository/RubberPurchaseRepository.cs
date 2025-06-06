using E_EstateV2_API.Data;
using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using E_EstateV2_API.ViewModel;
using Microsoft.EntityFrameworkCore;

namespace E_EstateV2_API.Repository
{
    public class RubberPurchaseRepository : IRubberPurchaseRepository
    {
        private readonly ApplicationDbContext _context;

        public RubberPurchaseRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<RubberPurchase> AddPurchase(RubberPurchase purchase)
        {
            purchase.createdDate = DateTime.Now;
            await _context.rubberPurchases.AddAsync(purchase);
            await _context.SaveChangesAsync();

            var sellerCompany = new SellerCompany
            {
                sellerId = purchase.sellerId,
                companyId = purchase.companyId,
            };


            await _context.sellerCompanies.AddAsync(sellerCompany);
            await _context.SaveChangesAsync();

            return purchase;
        }

        public async Task<List<DTO_RubberPurchase>> GetRubberPurchases()
        {
            var purchases = await _context.rubberPurchases.Select(x => new DTO_RubberPurchase
            {
                id = x.Id,
                date = x.date,
                sellerName = _context.sellers.Where(y => y.Id == x.sellerId).Select(y => y.sellerName).FirstOrDefault(),
                rubberType = x.rubberType,
                authorizationLetter = x.authorizationLetter,
                project = x.project,
                weight = x.weight,
                DRC = x.DRC,
                price = x.price,
                totalPrice = x.totalPrice,
                isActive = x.isActive,
                sellerId = x.sellerId,
                companyId = x.companyId,
                estateId = x.estateId
            }).OrderBy(x => x.date).ToListAsync();
            return purchases;
        }

        public async Task<RubberPurchase> UpdateRubberPurchase(RubberPurchase purchase)
        {
            var existingPurchase = await _context.rubberPurchases.FirstOrDefaultAsync(x => x.Id == purchase.Id);
            if (existingPurchase != null)
            {
                existingPurchase.date = purchase.date;
                existingPurchase.sellerId = purchase.sellerId;
                existingPurchase.rubberType = purchase.rubberType;
                existingPurchase.authorizationLetter = purchase.authorizationLetter;
                existingPurchase.project = purchase.project;
                existingPurchase.weight = purchase.weight;
                existingPurchase.DRC = purchase.DRC;
                existingPurchase.price = purchase.price;
                existingPurchase.totalPrice = purchase.totalPrice;
                existingPurchase.updatedBy = purchase.updatedBy;
                existingPurchase.updatedDate = DateTime.Now;
                existingPurchase.isActive = purchase.isActive;
                await _context.SaveChangesAsync();
                return existingPurchase;
            }
            return null;
        }
    }
}
