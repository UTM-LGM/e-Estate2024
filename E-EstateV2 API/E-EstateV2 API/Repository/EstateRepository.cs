using E_EstateV2_API.Data;
using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using E_EstateV2_API.ViewModel;
using Microsoft.EntityFrameworkCore;

namespace E_EstateV2_API.Repository
{
    public class EstateRepository:IEstateRepository
    {
        private readonly ApplicationDbContext _context;

        public EstateRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<DTO_Estate>> GetEstates()
        {
            var estate = await _context.estates.Select(x => new DTO_Estate
            {
                id = x.Id,
                estateName = x.estateName,
                address1 = x.address1,
                address2 = x.address2,
                address3 = x.address3,
                postcode = x.postcode,
                licenseNo = x.licenseNo,
                totalArea = x.totalArea,
                email = x.email,
                isActive = x.isActive,
                townId = x.townId,
                managerName = x.managerName,
                companyId = x.companyId,
                phone = x.phone,
                fax = x.fax,
                latitudeLongitude = x.latitudeLongitude,
                financialYear = _context.financialYears.Where(y => y.Id == x.financialYearId).Select(y => y.financialYear).FirstOrDefault(),
                establishment = _context.establishments.Where(y => y.Id == x.establishmentId).Select(x => x.establishment).FirstOrDefault(),
                companyName = _context.companies.Where(y=>y.Id == x.companyId).Select(y=>y.companyName).FirstOrDefault(),
                town = _context.towns.Where(y => y.Id == x.townId).Select(y => y.town).FirstOrDefault(),
                state = _context.states.Where(y => y.Id == _context.towns.Where(z => z.Id == x.townId).Select(x => x.stateId).FirstOrDefault()).Select(y => y.state).FirstOrDefault(),
                membership = _context.membershipTypes.Where(y => y.Id == x.membershipTypeId).Select(y => y.membershipType).FirstOrDefault(),
                plantingMaterial = _context.plantingMaterials.Where(y => y.Id == x.plantingMaterialId).Select(x => new PlantingMaterial
                {
                    Id = x.Id,
                    plantingMaterial = x.plantingMaterial
                }).ToList(),
                grantNo = x.grantNo,
            }).ToListAsync();
            return estate;
        }

        public async Task<DTO_Estate> GetEstateById(int id)
        {
            var estate = await _context.estates.Where(x => x.Id == id).Select(x => new DTO_Estate
            {
                id = x.Id,
                estateName = x.estateName,
                address1 = x.address1,
                address2 = x.address2,
                address3 = x.address3,
                postcode = x.postcode,
                phone = x.phone,
                fax = x.fax,
                licenseNo = x.licenseNo,
                totalArea = x.totalArea,
                email = x.email,
                isActive = x.isActive,
                latitudeLongitude = x.latitudeLongitude,
                managerName = x.managerName,
                townId = x.townId,
                companyName = _context.companies.Where(y=>y.Id == x.companyId).Select(y=>y.companyName).FirstOrDefault(),
                towns = _context.towns.Where(y => y.Id == x.townId).Select(t => new DTO_Town
                {
                    id = t.Id,
                    town = t.town
                }).ToList(),
                stateId = _context.towns.Where(y => y.Id == x.townId).Select(y => y.stateId).FirstOrDefault(),
                state = _context.states.Where(y => y.Id == _context.towns.Where(z => z.Id == x.townId).Select(x => x.stateId).FirstOrDefault()).Select(y => y.state).FirstOrDefault(),
                membershipTypeId = x.membershipTypeId,
                membership = _context.membershipTypes.Where(y => y.Id == x.membershipTypeId).Select(y => y.membershipType).FirstOrDefault(),
                financialYearId = x.financialYearId,
                financialYears = _context.financialYears.Where(y => y.Id == x.financialYearId).Select(f => new DTO_FinancialYear
                {
                    id = f.Id,
                    financialYear = f.financialYear
                }).ToList(),
                establishmentId = x.establishmentId,
                establishments = _context.establishments.Where(y => y.Id == x.establishmentId).Select(e => new DTO_Establishment
                {
                    id = e.Id,
                    establishment = e.establishment
                }).ToList(),
                plantingMaterial = _context.plantingMaterials.Where(y => y.Id == x.plantingMaterialId).Select(x => new PlantingMaterial
                {
                    Id = x.Id,
                    plantingMaterial = x.plantingMaterial
                }).ToList(),
                grantNo = x.grantNo,
                plantingMaterialId = x.plantingMaterialId,
                fields = _context.fields.Where(y => y.estateId == id).Select(d => new DTO_Field
                {
                    id = d.Id,
                    fieldName = d.fieldName,
                    area = d.area,
                    isMature = d.isMature,
                    isActive = d.isActive,
                    dateOpenTapping = d.dateOpenTapping,
                    yearPlanted = d.yearPlanted,
                    fieldStatus = _context.fieldStatus.Where(y => y.Id == d.fieldStatusId).Select(y => y.fieldStatus).FirstOrDefault(),
                    fieldStatuses = _context.fieldStatus.Where(y => y.Id == d.fieldStatusId).Select(y => new DTO_FieldStatus
                    {
                        id = y.Id,
                        fieldStatus = y.fieldStatus,
                    }).ToList(),
                    initialTreeStand = d.initialTreeStand,
                    totalTask = d.totalTask
                }).OrderByDescending(c => c.isActive).ToList(),
            }).FirstOrDefaultAsync();
            return estate;
        }

        public async Task<Estate> AddEstate(Estate estate)
        {
            estate.createdDate = DateTime.Now;
            await _context.estates.AddAsync(estate);
            await _context.SaveChangesAsync();

            return estate;
        }

        public async Task<Estate> UpdateEstate(Estate estate)
        {
            var existingEstate = await _context.estates.FirstOrDefaultAsync(x => x.Id == estate.Id);
            if (existingEstate != null)
            {
                existingEstate.estateName = estate.estateName;
                existingEstate.address1 = estate.address1;
                existingEstate.address2 = estate.address2;
                existingEstate.address3 = estate.address3;
                existingEstate.postcode = estate.postcode;
                existingEstate.townId = estate.townId;
                existingEstate.financialYearId = estate.financialYearId;
                existingEstate.membershipTypeId = estate.membershipTypeId;
                existingEstate.establishmentId = estate.establishmentId;
                existingEstate.phone = estate.phone;
                existingEstate.fax = estate.fax;
                existingEstate.email = estate.email;
                existingEstate.licenseNo = estate.licenseNo;
                existingEstate.totalArea = estate.totalArea;
                existingEstate.managerName = estate.managerName;
                existingEstate.latitudeLongitude = estate.latitudeLongitude;
                existingEstate.grantNo = estate.grantNo;
                existingEstate.plantingMaterialId = estate.plantingMaterialId;
                existingEstate.updatedBy = estate.updatedBy;
                existingEstate.updatedDate = DateTime.Now;
                existingEstate.isActive = estate.isActive;
                await _context.SaveChangesAsync();
                return existingEstate;
            }
            return null;
        }

        public async Task<Object> CheckEstateName(string estateName)
        {
            var estate = await _context.estates.Where(x=>x.estateName == estateName).Select(x => x.estateName).FirstOrDefaultAsync();
            if(estate == null)
            {
                return estate;
            }
            else
            {
                throw new("Estate Name already exists !");
            }
        }
    }


}
