namespace E_EstateV2_API.Repository
{
    public class ForeignLaborRepository
    {
        /**private readonly ApplicationDbContext _context;

        public ForeignLaborRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<LaborInfo> AddForeignLabor(LaborInfo foreignLabor)
        {
            foreignLabor.createdDate = DateTime.Now;
            await _context.foreignLabors.AddAsync(foreignLabor);
            await _context.SaveChangesAsync();
            return foreignLabor;
        }

        public async Task<List<DTO_LaborInfo>> GetForeignLabors()
        {
            var labor = await _context.foreignLabors.Select(x => new DTO_LaborInfo
            {
                id = x.Id,
                monthYear = x.monthYear,
                tapperCheckrole = x.tapperCheckrole,
                tapperContractor = x.tapperContractor,
                fieldCheckrole = x.fieldCheckrole,
                fieldContractor = x.fieldContractor,
                estateId = x.estateId,
                countryName = _context.countries.Where(y => y.Id == x.countryId).Select(y => y.country).FirstOrDefault(),
                isLocal = _context.countries.Where(y => y.Id == x.countryId).Select(y => y.isLocal).FirstOrDefault(),
                countryId = x.countryId
            }).ToListAsync();
            return labor;
        }

        public async Task<LaborInfo> UpdateForeignLabor(LaborInfo foreignLabor)
        {
            var existingLabor = await _context.foreignLabors.FirstOrDefaultAsync(x => x.Id == foreignLabor.Id);
            if (existingLabor != null)
            {
                existingLabor.countryId = foreignLabor.countryId;
                existingLabor.tapperCheckrole = foreignLabor.tapperCheckrole;
                existingLabor.tapperContractor = foreignLabor.tapperContractor;
                existingLabor.fieldCheckrole = foreignLabor.fieldCheckrole;
                existingLabor.fieldContractor = foreignLabor.fieldContractor;
                existingLabor.updatedBy = foreignLabor.updatedBy;
                existingLabor.updatedDate = DateTime.Now;
                await _context.SaveChangesAsync();
                return existingLabor;
            }
            return null;
        }

        public async Task<LaborInfo> DeleteForeignLabor(int id)
        {
            var existingLabor = await _context.foreignLabors.FirstOrDefaultAsync(x => x.Id == id);
            if (existingLabor != null)
            {
                _context.foreignLabors.Remove(existingLabor);
                await _context.SaveChangesAsync();
                return existingLabor;
            }
            return null;
        }
    }**/
    }
}
