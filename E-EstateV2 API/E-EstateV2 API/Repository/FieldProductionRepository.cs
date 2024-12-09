using E_EstateV2_API.Data;
using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using E_EstateV2_API.ViewModel;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace E_EstateV2_API.Repository
{
    public class FieldProductionRepository: IFieldProductionRepository
    {
        private readonly ApplicationDbContext _context;

        public FieldProductionRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<List<DTO_FieldProduction>> GetFieldProductions()
        {
            var production = await _context.fieldProductions.Select(x => new DTO_FieldProduction
            {
                id = x.Id,
                monthYear = x.monthYear,
                cuplump = x.cuplump,
                cuplumpDRC = x.cuplumpDRC,
                latex = x.latex,
                latexDRC = x.latexDRC,
                noTaskTap = x.noTaskTap,
                noTaskUntap = x.noTaskUntap,
                fieldId = x.fieldId,
                remarkUntap = x.remarkUntap,
                fieldName = _context.fields.Where(y => y.Id == x.fieldId).Select(y => y.fieldName).FirstOrDefault(),
                totalTask = _context.fields.Where(y => y.Id == x.fieldId).Select(y => y.totalTask).FirstOrDefault(),
                status = x.status,
                estateId = _context.fields.Where(y=>y.Id == x.fieldId).Select(y=>y.estateId).FirstOrDefault()
            }).ToListAsync();

            return production;
        }

        public async Task<IEnumerable<FieldProduction>> AddFieldProduction(FieldProduction[] fieldProduction)
        {
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                var addedProductions = new List<FieldProduction>();

                foreach (var item in fieldProduction)
                {
                    bool exists = await _context.fieldProductions
                        .AnyAsync(fp => fp.fieldId == item.fieldId && fp.createdDate.Date == DateTime.Now.Date);

                    if (!exists)
                    {
                        item.createdDate = DateTime.Now;
                        await _context.AddAsync(item);
                        addedProductions.Add(item);
                    }
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                return addedProductions;
            }
        }


        public async Task<IEnumerable<FieldProduction>> UpdateFieldProductionDraft(FieldProduction[] fieldProduction)
        {
            foreach(var item in fieldProduction)
            {
                var existingProduction = await _context.fieldProductions.FirstOrDefaultAsync(x => x.Id == item.Id);
                if (existingProduction != null)
                {
                    existingProduction.cuplump = item.cuplump;
                    existingProduction.cuplumpDRC = item.cuplumpDRC;
                    existingProduction.latex = item.latex;
                    existingProduction.latexDRC = item.latexDRC;
                    existingProduction.noTaskTap = item.noTaskTap;
                    existingProduction.noTaskUntap = item.noTaskUntap;
                    existingProduction.remarkUntap = item.remarkUntap;
                    existingProduction.updatedBy = item.updatedBy;
                    existingProduction.updatedDate = DateTime.Now;
                    existingProduction.status = item.status;
                    await _context.SaveChangesAsync();
                }
            }
            return fieldProduction;
        }

        public async Task<FieldProduction> UpdateFieldProduction(FieldProduction fieldProduction)
        {
            var existingProduction = await _context.fieldProductions.FirstOrDefaultAsync(x => x.Id == fieldProduction.Id);
            if (existingProduction != null)
            {
                existingProduction.cuplump = fieldProduction.cuplump;
                existingProduction.cuplumpDRC = fieldProduction.cuplumpDRC;
                existingProduction.latex = fieldProduction.latex;
                existingProduction.latexDRC = fieldProduction.latexDRC;
                existingProduction.noTaskTap = fieldProduction.noTaskTap;
                existingProduction.noTaskUntap = fieldProduction.noTaskUntap;
                existingProduction.remarkUntap = fieldProduction.remarkUntap;
                existingProduction.updatedBy = fieldProduction.updatedBy;
                existingProduction.updatedDate = DateTime.Now;
                await _context.SaveChangesAsync();
                return existingProduction;
            }
            return null;
        }
    }
}
