using E_EstateV2_API.Data;
using E_EstateV2_API.DTO;
using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using Microsoft.EntityFrameworkCore;

namespace E_EstateV2_API.Repository
{
    public class FieldInfoYearlyRepository:IFieldInfoYearlyRepository
    {
        private readonly ApplicationDbContext _context;

        public FieldInfoYearlyRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<FieldInfoYearly>> AddFieldInfo (FieldInfoYearly[] fieldInfoYearly)
        {
            foreach (var field in fieldInfoYearly)
            {
                field.createdDate = DateTime.Now;
                await _context.AddAsync(field);
                await _context.SaveChangesAsync();
            }
            return fieldInfoYearly;
        }

        public async Task<List<DTO_FieldInfoYearly>> GetFieldInfo(int year)
        {
            var fieldInfoYearly = await _context.fieldInfoYearly.Where(x=>x.year == year).Select(x => new DTO_FieldInfoYearly
            {
                id = x.Id,
                fieldId = x.fieldId,
                year = x.year,
                estateId = _context.estates.Where(y => y.Id == (_context.fields.Where(f => f.Id == x.fieldId).Select(f => f.estateId).FirstOrDefault())).Select(e => e.Id).FirstOrDefault()
            }).ToListAsync();
            return fieldInfoYearly;
        }
    }
}
