using E_EstateV2_API.Data;
using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;

namespace E_EstateV2_API.Repository
{
    public class FieldCloneRepository:IFieldCloneRepository
    {
        private readonly ApplicationDbContext _context;

        public FieldCloneRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<FieldClone>> AddFieldClone(FieldClone[] fieldClone)
        {
            foreach (var item in fieldClone)
            {
                item.createdDate = DateTime.Now;
                await _context.AddAsync(item);
                await _context.SaveChangesAsync();
            }
            return fieldClone;
        }

        public async Task<List<FieldClone>> UpdateFieldCloneStatus (int fieldId)
        {
            var fieldClone = _context.fieldClones.Where(x => x.fieldId == fieldId).ToList();
            foreach (var item in fieldClone)
            {
                item.isActive = false;
                await _context.SaveChangesAsync();
            }
            return fieldClone;
        }
    }
}
