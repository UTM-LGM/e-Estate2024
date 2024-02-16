using E_EstateV2_API.Data;  
using E_EstateV2_API.DTO;
using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using Microsoft.EntityFrameworkCore;

namespace E_EstateV2_API.Repository
{
    public class OtherFieldRepository:IOtherFieldRepository
    {
        private readonly ApplicationDbContext _context;

        public OtherFieldRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<DTO_OtherField>> GetOtherFields()
        {
            var otherField = await _context.otherFields.Select(x => new DTO_OtherField
            {
                id = x.Id,
                fieldName = x.fieldName,
                estateId = x.estateId,
                isActive = x.isActive,
                cropTypeId = x.cropTypeId,
                area = x.area,
                cropType = _context.cropTypes.Where(y => y.Id == x.cropTypeId).Select(y => y.cropType).FirstOrDefault(),
            }).ToListAsync();
            return otherField;
        }

        public async Task<DTO_OtherField> GetOtherFieldById(int id)
        {
            var otherField = await _context.otherFields.Where(x => x.Id == id).Select(x => new DTO_OtherField
            {
                id = x.Id,
                fieldName = x.fieldName,
                area = x.area,
                cropTypeId = x.cropTypeId,
                isActive = x.isActive,
            }).FirstOrDefaultAsync();
            return otherField;
        }

        public async Task<OtherField> AddOtherField(OtherField otherField)
        {
            otherField.createdDate = DateTime.Now;
            await _context.otherFields.AddAsync(otherField);
            await _context.SaveChangesAsync();
            return otherField;
        }

        public async Task<OtherField> UpdateOtherField(OtherField otherField)
        {
            var existingOtherField = await _context.otherFields.Where(x => x.Id == otherField.Id).FirstOrDefaultAsync();
            if (existingOtherField != null)
            {
                existingOtherField.updatedBy = otherField.updatedBy;
                existingOtherField.updatedDate = DateTime.Now;
                existingOtherField.area = otherField.area;
                existingOtherField.isActive = otherField.isActive;
                existingOtherField.cropTypeId = otherField.cropTypeId;
                await _context.SaveChangesAsync();
                return otherField;
            }
                return null;
        }

        public async Task<Object> CheckOtherFieldName (string fieldName)
        {
            var field = await _context.otherFields.Where(x => x.fieldName == fieldName).FirstOrDefaultAsync();
            if(field == null)
            {
                return field;
            }
            throw new("Field name already exist !");
        }
    }
}
