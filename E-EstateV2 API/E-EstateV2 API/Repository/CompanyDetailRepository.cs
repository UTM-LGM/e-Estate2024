using E_EstateV2_API.Data;
using E_EstateV2_API.DTO;
using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using E_EstateV2_API.ViewModel;
using Microsoft.EntityFrameworkCore;

namespace E_EstateV2_API.Repository
{
    public class CompanyDetailRepository:ICompanyDetailRepository
    {
        private readonly ApplicationDbContext _context;
        public CompanyDetailRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<DTO_CompanyDetail> GetCompanyDetailByCompanyId(int companyId)
        {
            var company = await _context.companyDetails.Where(x => x.companyId == companyId).Select(x => new DTO_CompanyDetail
            {
                id = x.Id,
                companyId = x.companyId,
                membershipTypeId = x.membershipTypeId,
                membershipType = _context.membershipTypes.Where(y=>y.Id == x.membershipTypeId).Select(y=>y.membershipType).FirstOrDefault(),
                startFinancialYear = x.startFinancialYear,
                endFinancialYear = x.endFinancialYear,
            }).FirstOrDefaultAsync();
            return company;
        }

        public async Task<CompanyDetail> AddCompanyDetail(CompanyDetail companyDetail)
        {
            companyDetail.createdDate = DateTime.Now;
            await _context.companyDetails.AddAsync(companyDetail);
            await _context.SaveChangesAsync();
            return companyDetail;
        }

        public async Task<CompanyDetail> UpdateCompanyDetail(CompanyDetail company)
        {
            var existingCompanyDetail = await _context.companyDetails.Where(x => x.Id == company.Id).FirstOrDefaultAsync();
            if (existingCompanyDetail != null)
            {
                existingCompanyDetail.updatedBy = company.updatedBy;
                existingCompanyDetail.updatedDate = DateTime.Now;
                existingCompanyDetail.membershipTypeId = company.membershipTypeId;
                existingCompanyDetail.startFinancialYear = company.startFinancialYear;
                existingCompanyDetail.endFinancialYear = company.endFinancialYear;
                await _context.SaveChangesAsync();
                return existingCompanyDetail;
            }
            return null;
        }
    }
}
