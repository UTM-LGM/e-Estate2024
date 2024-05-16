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

            //var buyerCompany = new BuyerCompany
            //{
            //    buyerId = sales.buyerId,
            //};

            //await _context.buyerCompanies.AddAsync(buyerCompany);
            //await _context.SaveChangesAsync();

            return sales;
        }

        public async Task<List<DTO_RubberSale>> GetRubberSales()
        {
            var sales = await _context.rubberSales.Select(x => new DTO_RubberSale
            {
                id = x.Id,
                saleDateTime = x.saleDateTime,
                buyerName = _context.buyers.Where(y => y.Id == x.buyerId).Select(y => y.buyerName).FirstOrDefault(),
                rubberType = x.rubberType,
                letterOfConsentNo = x.letterOfConsentNo,
                receiptNo = x.receiptNo,
                wetWeight = x.wetWeight,
                buyerWetWeight = x.buyerWetWeight,
                DRC = x.DRC,
                buyerDRC = x.buyerDRC,
                unitPrice = x.unitPrice,
                total = x.total,
                weightSlipNo = x.weightSlipNo,
                isActive = x.isActive,
                buyerId = x.buyerId,
                buyerLicenseNo = _context.buyers.Where(y => y.Id == x.buyerId).Select(y=>y.licenseNo).FirstOrDefault(),
                paymentStatusId = x.paymentStatusId,
                paymentStatus = _context.paymentStatuses.Where(y=>y.id ==  x.paymentStatusId).Select(y=>y.status).FirstOrDefault(),
                estateId = x.estateId,
                transportPlateNo = x.transportPlateNo,
                driverName = x.driverName,
                remark = x.remark,
                deliveryAgent = x.deliveryAgent,
            }).OrderBy(x => x.saleDateTime).ToListAsync();
            return sales;
        }

        public async Task<DTO_RubberSale> GetRubberSaleById(int id)
        {
            var rubberSale = await _context.rubberSales.Where(x => x.Id == id).Select(x => new DTO_RubberSale
            {
                id = x.Id,
                saleDateTime = x.saleDateTime,
                buyerName = _context.buyers.Where(y => y.Id == x.buyerId).Select(y => y.buyerName).FirstOrDefault(),
                rubberType = x.rubberType,
                letterOfConsentNo = x.letterOfConsentNo,
                receiptNo = x.receiptNo,
                wetWeight = x.wetWeight,
                buyerWetWeight = x.buyerWetWeight,
                DRC = x.DRC,
                buyerDRC = x.buyerDRC,
                unitPrice = x.unitPrice,
                total = x.total,
                weightSlipNo = x.weightSlipNo,
                isActive = x.isActive,
                buyerId = x.buyerId,
                buyerLicenseNo = _context.buyers.Where(y => y.Id == x.buyerId).Select(y => y.licenseNo).FirstOrDefault(),
                paymentStatusId = x.paymentStatusId,
                estateId = x.estateId,
                transportPlateNo = x.transportPlateNo,
                driverName = x.driverName,
                remark = x.remark,
                deliveryAgent = x.deliveryAgent,

            }).FirstOrDefaultAsync();
            return rubberSale;
        }

        public async Task<RubberSales> UpdateRubberSale(RubberSales rubberSales)
        {
            var existingSale = await _context.rubberSales.FirstOrDefaultAsync(x => x.Id == rubberSales.Id);
            if (existingSale != null)
            {
                existingSale.saleDateTime = rubberSales.saleDateTime;
                //existingSale.buyerId = rubberSales.buyerId;
                existingSale.rubberType = rubberSales.rubberType;
                //existingSale.letterOfConsentNo = rubberSales.letterOfConsentNo;
                //existingSale.receiptNo = rubberSales.receiptNo;
                existingSale.wetWeight = rubberSales.wetWeight;
                //existingSale.buyerWetWeight = rubberSales.buyerWetWeight;
                existingSale.DRC = rubberSales.DRC;
                //existingSale.buyerDRC = rubberSales.buyerDRC;
                existingSale.unitPrice = rubberSales.unitPrice;
                existingSale.total = rubberSales.total;
                //existingSale.weightSlipNo = rubberSales.weightSlipNo;
                //existingSale.paymentStatusId = rubberSales.paymentStatusId;
                existingSale.transportPlateNo = rubberSales.transportPlateNo;
                existingSale.driverName = rubberSales.driverName;
                existingSale.remark = rubberSales.remark;
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
