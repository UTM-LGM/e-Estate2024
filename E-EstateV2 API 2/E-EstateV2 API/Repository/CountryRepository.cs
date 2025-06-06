using E_EstateV2_API.Data;
using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using Microsoft.EntityFrameworkCore;

namespace E_EstateV2_API.Repository
{
    public class CountryRepository : ICountryRepository
    {
        private readonly ApplicationDbContext _context;

        public CountryRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Country> Add(Country entity)
        {
            await _context.Set<Country>().AddAsync(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task<List<Country>> GetAll()
        {
            return await _context.Set<Country>().ToListAsync();
        }

        public async Task<Country> Update(Country entity)
        {
            _context.Set<Country>().Update(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task<List<Country>> GetCountriesAsc()
        {
            var country = await _context.countries.OrderBy(c => c.country).ToListAsync();
            return country;
        }
    }
}
