using E_EstateV2_API.Data;
using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using Microsoft.EntityFrameworkCore;
using System.Web;

namespace E_EstateV2_API.Repository
{
    public class RubberSaleIntegrationRepository : IRubberSaleIntegrationRepository
    {
        private readonly ApplicationDbContext _context;
        public RubberSaleIntegrationRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public string ConvertEncodedRouteToNormal(string encodedRoute)
        {
            // Decode the URL encoding
            string decodedRoute = HttpUtility.UrlDecode(encodedRoute);
            return decodedRoute;
        }

        public async Task<object> GetRubberSaleByLOC(string LOC, string buyerLicenseNo)
        {
            //string decodedRoute = ConvertEncodedRouteToNormal(buyerLicenseNo);
            var buyer = await _context.buyers.FirstOrDefaultAsync(y => y.licenseNo == buyerLicenseNo);
            var rubberSale = await _context.rubberSales.Where(x => x.letterOfConsentNo == LOC && x.buyer.licenseNo == buyerLicenseNo).Select(x => new
            {
                id = x.Id,
                saleDateTime = x.saleDateTime,
                rubberType = x.rubberType,
                letterOfConsentNo = x.letterOfConsentNo,
                wetWeight = x.wetWeight,
                DRC = x.DRC,
                unitPrice = x.unitPrice,
                totalPrice = x.total,
                transportPlateNo = x.transportPlateNo,
                driverName = x.driverName,
                driverIC = x.driverIc,
                estateId = x.estateId,
                buyerId = x.buyerId,
                buyerName = _context.buyers.Where(y => y.Id == x.buyerId).Select(y => y.buyerName).FirstOrDefault(),
                licensceNo = buyerLicenseNo,
                receiptNo = x.receiptNo,
                weightSlipNo = x.weightSlipNo,
                buyerWetWeight = x.buyerWetWeight,
                buyerDRC = x.buyerDRC,
                paymentStatusId = x.paymentStatusId,
                paymentStatus = _context.paymentStatuses.Where(y => y.id == x.paymentStatusId).Select(y => y.status).FirstOrDefault(),
                remark = x.remark,
                weightSlipNoDate = x.weightSlipNoDate,
                receiptNoDate = x.receiptNoDate,
                deliveryAgent = x.deliveryAgent,
                msnrStatus = x.MSNRStatus
            }).FirstOrDefaultAsync();
            return rubberSale;
        }

        public async Task<RubberSales> UpdateWeightSlipNo(string LOC, RubberSales rubberSales)
        {
            var currentDateTime = DateTime.Now;
            var existingSale = await _context.rubberSales.Where(x => x.letterOfConsentNo == LOC).FirstOrDefaultAsync();
            if (existingSale != null)
            {
                existingSale.weightSlipNo = rubberSales.weightSlipNo;
                existingSale.buyerWetWeight = rubberSales.buyerWetWeight;
                existingSale.buyerDRC = rubberSales.buyerDRC;
                existingSale.weightSlipNoDate = currentDateTime;
                existingSale.paymentStatusId = 2;
                await _context.SaveChangesAsync();
                return existingSale;
            }
            return null;
        }

        public async Task<RubberSales> UpdateReceiptNo(string LOC, RubberSales rubberSales)
        {
            var currentDateTime = DateTime.Now;
            var existingSale = await _context.rubberSales.Where(x => x.letterOfConsentNo == LOC && x.paymentStatusId != 3).FirstOrDefaultAsync();
            if (existingSale != null)
            {
                existingSale.receiptNo = rubberSales.receiptNo;
                existingSale.buyerDRC = rubberSales.buyerDRC;
                existingSale.receiptNoDate = currentDateTime;
                existingSale.unitPrice = rubberSales.unitPrice;
                existingSale.total = rubberSales.total;
                existingSale.paymentStatusId = 3;
                await _context.SaveChangesAsync();
                return existingSale;
            }
            return null;
        }

        public async Task<RubberSales> UpdateReceiptNoRimNiaga(string LOC, RubberSales rubberSales)
        {
            var currentDateTime = DateTime.Now;
            var existingSale = await _context.rubberSales.Where(x => x.letterOfConsentNo == LOC && x.paymentStatusId != 3).FirstOrDefaultAsync();
            if (existingSale != null)
            {
                existingSale.receiptNo = rubberSales.receiptNo;
                existingSale.buyerWetWeight = rubberSales.buyerWetWeight;
                existingSale.buyerDRC = rubberSales.buyerDRC;
                existingSale.receiptNoDate = currentDateTime;
                existingSale.unitPrice = rubberSales.unitPrice;
                existingSale.total = rubberSales.total;
                existingSale.paymentStatusId = 3;
                await _context.SaveChangesAsync();
                return existingSale;
            }
            return null;
        }
    }
}
