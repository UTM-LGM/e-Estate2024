using E_EstateV2_API.Data;
using E_EstateV2_API.DTO;
using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using E_EstateV2_API.ViewModel;
using Microsoft.EntityFrameworkCore;

namespace E_EstateV2_API.Repository
{
    public class CompanyRepository: ICompanyRepository
    {
        private readonly ApplicationDbContext _context;

        public CompanyRepository(ApplicationDbContext context)
        {
           _context = context;
        }

        public async Task<List<DTO_Company>> GetCompanies()
        {
             var company = await _context.companies.Select(x => new DTO_Company
            {
                id = x.Id,
                companyName = x.companyName,
                address1 = x.address1,
                address2 = x.address2,
                address3 = x.address3,
                postcode = x.postcode,
                phone = x.phone,
                email = x.email,
                fax = x.fax,
                contactNo = x.contactNo,
                managerName = x.managerName,
                isActive = x.isActive,
                state = _context.states.Where(y => y.Id == _context.towns.Where(z => z.Id == x.townId).Select(x => x.stateId).FirstOrDefault()).Select(y => y.state).FirstOrDefault(),
                towns = _context.towns.Where(y => y.Id == x.townId).Select(t => new DTO_Town
                {
                    id = t.Id,
                    town = t.town
                }).ToList(),
            }).ToListAsync();
            return company;
        }

        public async Task<DTO_Company> GetCompanyById (int id)
        {
            var company = await _context.companies.Where(x => x.Id == id).Select(x => new DTO_Company
            {
                id = x.Id,
                companyName = x.companyName,
                address1 = x.address1,
                address2 = x.address2,
                address3 = x.address3,
                postcode = x.postcode,
                phone = x.phone,
                email = x.email,
                fax = x.fax,
                contactNo = x.contactNo,
                managerName = x.managerName,
                isActive = x.isActive,
                townId = x.townId,
                ownershipId = x.ownershipId,
                ownerships = _context.ownerships.Where(y => y.Id == x.ownershipId).Select(t => new DTO_Ownership
                {
                    id = t.Id,
                    ownership = t.ownership,
                }).ToList(),
                stateId = _context.towns.Where(y => y.Id == x.townId).Select(y => y.stateId).FirstOrDefault(),
                state = _context.states.Where(y => y.Id == _context.towns.Where(z => z.Id == x.townId).Select(x => x.stateId).FirstOrDefault()).Select(y => y.state).FirstOrDefault(),
                towns = _context.towns.Where(y => y.Id == x.townId).Select(t => new DTO_Town
                {
                    id = t.Id,
                    town = t.town
                }).ToList(),
                estates = _context.estates.Where(y => y.companyId == id).Select(e => new DTO_Estate
                {
                    id = e.Id,
                    estateName = e.estateName,
                    email = e.email,
                    licenseNo = e.licenseNo,
                    totalArea = e.totalArea,
                    isActive = e.isActive,
                    establishmentId = e.establishmentId,
                    financialYearId = e.financialYearId,
                    membershipTypeId = e.membershipTypeId,
                    townId = e.townId,
                    town1 = _context.towns.Where(y => y.Id == e.townId).Select(y => y.town).FirstOrDefault(),
                    membership = _context.membershipTypes.Where(y => y.Id == e.membershipTypeId).Select(y => y.membershipType).FirstOrDefault(),
                    state = _context.states.Where(y => y.Id == _context.towns.Where(z => z.Id == e.townId).Select(x => x.stateId).FirstOrDefault()).Select(y => y.state).FirstOrDefault(),
                    //plantingMaterial = _context.plantingMaterials.Where(y=>y.Id == e.plantingMaterialId).Select(x=>x.plantingMaterial).FirstOrDefault(),
                    grantNo = e.grantNo,
                    fields = _context.fields.Where(y => y.estateId == e.Id).Select(f => new DTO_Field
                    {
                        id = f.Id,
                        fieldName = f.fieldName,
                        area = f.area,
                        isMature = f.isMature,
                        isActive = f.isActive,
                        dateOpenTapping = f.dateOpenTapping,
                        initialTreeStand = f.initialTreeStand,
                        totalTask = f.totalTask,
                        yearPlanted = f.yearPlanted,
                        fieldStatusId = _context.fieldStatus.Where(y => y.Id == f.fieldStatusId).Select(y => y.Id).FirstOrDefault(),
                        fieldStatuses = _context.fieldStatus.Where(y => y.Id == f.fieldStatusId).Select(c => new DTO_FieldStatus
                        {
                            id = c.Id,
                            fieldStatus = c.fieldStatus
                        }).ToList(),
                    }).ToList()
                }).ToList(),
            }).FirstOrDefaultAsync();
            return company;
        }

        public async Task<Company> UpdateCompany(Company company)
        {
            var existingCompany = await _context.companies.FirstOrDefaultAsync(x => x.Id == company.Id);
            if (existingCompany != null)
            {
                existingCompany.address1 = company.address1;
                existingCompany.address2 = company.address2;
                existingCompany.address3 = company.address3;
                existingCompany.postcode = company.postcode;
                existingCompany.townId = company.townId;
                existingCompany.phone = company.phone;
                existingCompany.fax = company.fax;
                existingCompany.email = company.email;
                existingCompany.managerName = company.managerName;
                existingCompany.ownershipId = company.ownershipId;
                existingCompany.contactNo = company.contactNo;
                existingCompany.updatedBy = company.updatedBy;
                existingCompany.updatedDate = DateTime.Now;
                existingCompany.isActive = company.isActive;
                await _context.SaveChangesAsync();
                return existingCompany;
            }
            return null;
        }
    }
}
