using E_EstateV2_API.Data;
using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using E_EstateV2_API.ViewModel;
using Microsoft.EntityFrameworkCore;

namespace E_EstateV2_API.Repository
{
    public class FieldConversionRepository:IFieldConversionRepository
    {
        private readonly ApplicationDbContext _context;

        public FieldConversionRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<FieldConversion> AddFieldClone(FieldConversion fieldConversion)
        {
            fieldConversion.createdDate = DateTime.Now;
            await _context.fieldConversions.AddAsync(fieldConversion);
            await _context.SaveChangesAsync();
            return fieldConversion;
        }

        public async Task<List<DTO_FieldConversion>> GetFieldClones()
        {
            var conversion = await _context.fieldConversions.Select(x => new DTO_FieldConversion
            {
                id = x.Id,
                fieldId = x.fieldId,
                fieldName = _context.fields.Where(y => y.Id == x.fieldId).Select(y => y.fieldName).FirstOrDefault(),
                conversionCropName = _context.otherCrops.Where(y => y.Id == x.otherCropId).Select(y=>y.otherCrop).FirstOrDefault(),
                sinceYear = x.sinceYear
            }).ToListAsync();
            return conversion;

        }
        public async Task<FieldConversion> UpdateFieldCLone(FieldConversion fieldConversion)
        {
            var existingConversion = await _context.fieldConversions.FirstOrDefaultAsync(x => x.Id == fieldConversion.Id);
            if (existingConversion != null)
            {
                existingConversion.updatedBy = fieldConversion.updatedBy;
                existingConversion.updatedDate = DateTime.Now;
                existingConversion.otherCropId = fieldConversion.otherCropId;
                existingConversion.sinceYear = fieldConversion.sinceYear;
                await _context.SaveChangesAsync();
                return existingConversion;
            }
            return null;
        }
    }
}
