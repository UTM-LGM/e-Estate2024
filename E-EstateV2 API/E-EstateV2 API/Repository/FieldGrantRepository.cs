using E_EstateV2_API.Data;
using E_EstateV2_API.DTO;
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

        public async Task<List<DTO_FieldGrant>> GetFieldGrantByFieldId(int fieldId)
        {
            var grant = await _context.fieldGrants.Where(x => x.fieldId == fieldId).Select(x => new DTO_FieldGrant
            {
                Id = x.Id,
                grantTitle = x.grantTitle,
                grantArea = x.grantArea,
                grantRubberArea = x.grantRubberArea,
                isActive = x.isActive,
                files = _context.fieldGrantAttachments.Where(y=>y.fieldGrantId == x.Id).ToList()
            }).ToListAsync();
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

        public async Task<List<FieldGrant>> UpdateFieldGrants(int fieldId, FieldGrant[] updatedFieldGrants)
        {
            var existingFieldGrants = await _context.fieldGrants.Where(x => x.fieldId == fieldId).ToListAsync();

            // HashSet to track the incoming FieldGrant IDs
            var incomingGrantIds = new HashSet<int>(updatedFieldGrants.Select(g => g.Id));

            // List to keep track of newly added grants
            var newlyAddedGrants = new List<FieldGrant>();

            foreach (var grant in updatedFieldGrants)
            {
                if (grant.Id != 0)
                {
                    // Update existing grants
                    var existingGrant = existingFieldGrants.FirstOrDefault(x => x.Id == grant.Id);
                    if (existingGrant != null)
                    {
                        existingGrant.isActive = grant.isActive; // Update properties as needed
                    }
                }
                else
                {
                    // Add new grants
                    grant.isActive = true; // Set isActive as needed
                    grant.fieldId = fieldId; // Set the associated FieldId
                    grant.createdDate = DateTime.Now; // Set createdDate for the new grant

                    _context.fieldGrants.Add(grant);
                    newlyAddedGrants.Add(grant); // Track new grants
                }
            }

            // Deactivate grants not included in the updated list
            foreach (var existingGrant in existingFieldGrants)
            {
                if (!incomingGrantIds.Contains(existingGrant.Id))
                {
                    existingGrant.isActive = false; // Deactivate the grant
                    existingGrant.updatedDate = DateTime.Now;
                }
            }

            await _context.SaveChangesAsync();

            // Return only the newly added grants
            return newlyAddedGrants;
        }


        public async Task AddFieldGrantAttachment(FieldGrantAttachment attachment)
        {
            _context.fieldGrantAttachments.Add(attachment);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<FieldGrantAttachment>> GetAttachmentsByFieldGrantId(int fieldGrantId)
        {
            return await _context.fieldGrantAttachments
                .Where(a => a.fieldGrantId == fieldGrantId && a.isActive)
                .ToListAsync();
        }

        public async Task UpdateFieldGrantAttachment(FieldGrantAttachment updatedAttachment)
        {
            var existingAttachment = await _context.fieldGrantAttachments
                .FirstOrDefaultAsync(a => a.Id == updatedAttachment.Id);

            if (existingAttachment != null)
            {
                existingAttachment.fileName = updatedAttachment.fileName;
                existingAttachment.updatedBy = updatedAttachment.updatedBy;
                existingAttachment.updatedDate = updatedAttachment.updatedDate;
                existingAttachment.isActive = updatedAttachment.isActive;

                _context.fieldGrantAttachments.Update(existingAttachment);
                await _context.SaveChangesAsync();
            }
        }



    }
}
