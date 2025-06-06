using E_EstateV2_API.Data;
using E_EstateV2_API.DTO;
using E_EstateV2_API.IRepository;
using Microsoft.EntityFrameworkCore;

namespace E_EstateV2_API.Repository
{
    public class FieldDiseaseRepository: IFieldDiseaseRepository
    {
        private readonly ApplicationDbContext _context;

        public FieldDiseaseRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<DTO_DiseaseCategory>> GetFieldDisease()
        {
            var category = await _context.fieldDiseases.Select(x=> new DTO_DiseaseCategory
            {
                id = x.Id,
                category = _context.diseaseCategories.Where(y=>y.Id == x.diseaseCategoryId).Select(y=>y.category).FirstOrDefault(),
                diseaseName = x.diseaseName,
                isActive = x.isActive,
                diseaseCategoryId = x.diseaseCategoryId,

            }).ToListAsync();
            return category;
        }
    }
}
