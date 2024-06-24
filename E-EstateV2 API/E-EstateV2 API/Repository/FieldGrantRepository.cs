using E_EstateV2_API.Data;
using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Asn1.X9;


namespace E_EstateV2_API.Repository
{
    public class FieldGrantRepository:IFieldGrantRepository
    {
        private readonly ApplicationDbContext _context;

        public FieldGrantRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<FieldGrant>> AddFieldGrant(FieldGrant[] fieldGrant)
        {
            foreach(var item  in fieldGrant)
            {
                item.createdDate = DateTime.Now;
                item.isActive = true;
                await _context.AddAsync(item);
                await _context.SaveChangesAsync();
            }
            return fieldGrant;
        }

        public async Task<FieldGrant> AddGrant(FieldGrant grant)
        {
            grant.createdDate = DateTime.Now;
            await _context.fieldGrants.AddAsync(grant);
            await _context.SaveChangesAsync();
            return grant;
        }

        public async Task<List<FieldGrant>> UpdateFieldGrant (int fieldId)
        {
            var fieldGrant = _context.fieldGrants.Where(x=> x.fieldId == fieldId).ToList();
            foreach(var item in fieldGrant)
            {
                item.isActive = false;
                await _context.SaveChangesAsync();
            }
            return fieldGrant;
        }

        public async Task<List<FieldGrant>> GetFieldGrantByFieldId(int fieldId)
        {
            var grant = await _context.fieldGrants.Where(x => x.fieldId == fieldId).ToListAsync();
            return grant;
        }

        public async Task<FieldGrant> GetFieldGrantById(int grantId)
        {
            return await _context.fieldGrants.FirstOrDefaultAsync(x => x.Id == grantId);
        }

        public async Task DeleteFieldGrant(FieldGrant fieldGrant)
        {
            _context.fieldGrants.Remove(fieldGrant);
            await _context.SaveChangesAsync();
        }
    }
}
