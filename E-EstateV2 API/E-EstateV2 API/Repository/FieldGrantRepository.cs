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

        public async Task UpdateFieldGrants(int fieldId, FieldGrant[] updatedFieldGrants)
        {
            var existingFieldGrants = await _context.fieldGrants.Where(x => x.fieldId == fieldId).ToListAsync();

            //Allows efficient set operations to determine which existing FieldGrant IDs are not in the updated list.
            var incomingGrantIds = new HashSet<int>(updatedFieldGrants.Select(g => g.Id));

            foreach (var grant in updatedFieldGrants)
            {
                if (grant.Id != 0)
                {
                    var existingGrant = existingFieldGrants.FirstOrDefault(x => x.Id == grant.Id);
                    if (existingGrant != null)
                    {
                        existingGrant.isActive = grant.isActive; // Update properties as needed
                    }
                }
                else
                {
                    grant.isActive = true; // Set isActive as needed
                    grant.fieldId = fieldId; // Set the associated FieldId
                    _context.fieldGrants.Add(grant);
                }
            }

            foreach (var existingGrant in existingFieldGrants)
            {
                if (!incomingGrantIds.Contains(existingGrant.Id))
                {
                    existingGrant.isActive = false; // Deactivate the grant
                    existingGrant.updatedDate = DateTime.Now;
                }
            }

            await _context.SaveChangesAsync();
        }

    }
}
