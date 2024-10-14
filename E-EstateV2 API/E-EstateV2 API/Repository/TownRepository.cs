using E_EstateV2_API.Data;
using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using E_EstateV2_API.ViewModel;
using Microsoft.EntityFrameworkCore;

namespace E_EstateV2_API.Repository
{
    public class TownRepository:ITownRepository
    {
        private readonly ApplicationDbContext _context;

        public TownRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<DTO_Town>> GetTowns()
        {
            var town = await _context.towns.Select(x => new DTO_Town
            {
                id = x.Id,
                town = x.town,
                stateId = x.stateId,
                isActive = x.isActive,
                state = _context.states.Where(y => y.Id == x.stateId).Select(y => y.state).FirstOrDefault(),
            }).ToListAsync();
            return town;
        }

        public async Task<Town> AddTown(Town town)
        {
            town.createdDate = DateTime.Now;
            await _context.towns.AddAsync(town);
            await _context.SaveChangesAsync();

            return town;
        }
        public async Task<Town> UpdateTown(Town town)
        {
            var existingTown = await _context.towns.Where(x => x.Id == town.Id).FirstOrDefaultAsync();
            if (existingTown != null)
            {
                existingTown.updatedBy = town.updatedBy;
                existingTown.updatedDate = DateTime.Now;
                existingTown.isActive = town.isActive;
                await _context.SaveChangesAsync();
                return existingTown;
            }
            return null;
        }
    }
}
