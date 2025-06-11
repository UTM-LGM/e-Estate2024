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
        private readonly IRubberSaleHistoryRepository _rubberSaleHistoryRepository;

        public RubberSaleRepository(ApplicationDbContext context, IRubberSaleHistoryRepository rubberSaleHistoryRepository )
        {
            _context = context;
            _rubberSaleHistoryRepository = rubberSaleHistoryRepository;
        }

        public async Task<RubberSales> AddSale(RubberSales sales)
        {
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                bool exists = await _context.rubberSales
                    .AnyAsync(rubberSale => rubberSale.saleDateTime == sales.saleDateTime && rubberSale.buyerId == sales.buyerId &&
                    rubberSale.rubberType == sales.rubberType && rubberSale.wetWeight == sales.wetWeight && rubberSale.DRC == sales.DRC && rubberSale.letterOfConsentNo == sales.letterOfConsentNo);
                if (!exists)
                {
                    sales.createdDate = DateTime.Now;
                    sales.saleDateTime = sales.saleDateTime.Date + DateTime.Now.TimeOfDay;
                    // Add the sales record
                    await _context.rubberSales.AddAsync(sales);
                }

                await _context.SaveChangesAsync();

                // Commit the transaction
                await transaction.CommitAsync();

                return sales;
            }
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
                receiptNoDate = x.receiptNoDate,
                wetWeight = x.wetWeight,
                buyerWetWeight = x.buyerWetWeight,
                DRC = x.DRC,
                buyerDRC = x.buyerDRC,
                unitPrice = x.unitPrice,
                total = x.total,
                weightSlipNo = x.weightSlipNo,
                weightSlipNoDate = x.weightSlipNoDate,
                isActive = x.isActive,
                buyerId = x.buyerId ?? 0,
                buyerLicenseNo = _context.buyers.Where(y => y.Id == x.buyerId).Select(y=>y.licenseNo).FirstOrDefault(),
                paymentStatusId = x.paymentStatusId,
                paymentStatus = _context.paymentStatuses.Where(y=>y.id ==  x.paymentStatusId).Select(y=>y.status).FirstOrDefault(),
                estateId = x.estateId,
                transportPlateNo = x.transportPlateNo,
                driverName = x.driverName,
                driverIc = x.driverIc,
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
                receiptNoDate = x.receiptNoDate,
                wetWeight = x.wetWeight,
                buyerWetWeight = x.buyerWetWeight,
                DRC = x.DRC,
                buyerDRC = x.buyerDRC,
                unitPrice = x.unitPrice,
                total = x.total,
                weightSlipNo = x.weightSlipNo,
                isActive = x.isActive,
                buyerId = x.buyerId ?? 0,
                buyerLicenseNo = _context.buyers.Where(y => y.Id == x.buyerId).Select(y => y.licenseNo).FirstOrDefault(),
                paymentStatusId = x.paymentStatusId,
                estateId = x.estateId,
                transportPlateNo = x.transportPlateNo,
                driverName = x.driverName,
                driverIc = x.driverIc,
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

                var rubberSaleHistory = new RubberSaleHistory
                {
                    rubberSalesId = existingSale.Id,
                    saleDateTime = existingSale.saleDateTime,
                    rubberType = existingSale.rubberType,
                    letterOfConsentNo = existingSale.letterOfConsentNo,
                    receiptNo = existingSale.receiptNo,
                    receiptNoDate = existingSale.receiptNoDate,
                    wetWeight = existingSale.wetWeight,
                    buyerWetWeight = existingSale.buyerWetWeight,
                    DRC = existingSale.DRC,
                    buyerDRC = existingSale.buyerDRC,
                    unitPrice = existingSale.unitPrice,
                    total = existingSale.total,
                    weightSlipNo = existingSale.weightSlipNo,
                    weightSlipNoDate = existingSale.weightSlipNoDate,
                    transportPlateNo = existingSale.transportPlateNo,
                    driverName = existingSale.driverName,
                    driverIc = existingSale.driverIc,
                    remark = existingSale.remark,
                    deliveryAgent = existingSale.deliveryAgent,
                    estateId = existingSale.estateId,
                    isActive = existingSale.isActive,
                    createdBy = existingSale.createdBy,
                    createdDate = existingSale.createdDate,
                    updatedBy = existingSale.updatedBy,
                    updatedDate = existingSale.updatedDate,
                    buyerId = existingSale.buyerId ?? 0,
                    paymentStatusId = existingSale.paymentStatusId,
                    MSNRStatus = existingSale.MSNRStatus
                };

                await _rubberSaleHistoryRepository.AddRubberSaleHistory(rubberSaleHistory);

                existingSale.saleDateTime = rubberSales.saleDateTime;
                existingSale.buyerId = rubberSales.buyerId;
                existingSale.rubberType = rubberSales.rubberType;
                existingSale.wetWeight = rubberSales.wetWeight;
                existingSale.DRC = rubberSales.DRC;
                existingSale.unitPrice = rubberSales.unitPrice;
                existingSale.total = rubberSales.total;
                existingSale.transportPlateNo = rubberSales.transportPlateNo;
                existingSale.driverName = rubberSales.driverName;
                existingSale.driverIc = rubberSales.driverIc;
                existingSale.remark = rubberSales.remark;
                existingSale.updatedBy = rubberSales.updatedBy;
                existingSale.updatedDate = DateTime.Now;
                existingSale.isActive = rubberSales.isActive;
                existingSale.deliveryAgent = rubberSales.deliveryAgent;
                await _context.SaveChangesAsync();
                return existingSale;
            }
            return null;
        }
    }
}
