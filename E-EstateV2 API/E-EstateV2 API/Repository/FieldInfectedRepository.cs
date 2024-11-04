using E_EstateV2_API.Data;
using E_EstateV2_API.DTO;
using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace E_EstateV2_API.Repository
{
    public class FieldInfectedRepository: IFieldInfectedRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly IFieldInfectedHistoryRepository _historyRepository;

        public FieldInfectedRepository(ApplicationDbContext context, IFieldInfectedHistoryRepository historyRepository)
        {
            _context = context;
            _historyRepository = historyRepository;

        }

        public async Task<FieldInfected> Add(FieldInfected entity)
        {
            await _context.Set<FieldInfected>().AddAsync(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        
        public async Task<List<FieldInfected>> GetAll()
        {
            return await _context.Set<FieldInfected>().ToListAsync();
        }

        public async Task<FieldInfected> Update(FieldInfected entity)
        {
            _context.Set<FieldInfected>().Update(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task<List<DTO_FieldInfected>> GetFieldInfectedByEstateId(int estateId)
        {
            // Find all fieldIds associated with the given estateId
            var fieldIds = await _context.fields
                .Where(f => f.estateId == estateId)
                .Select(f => f.Id)
                .ToListAsync(); // Retrieve all fieldIds matching the estateId

            // Query for fieldInfecteds that have fieldId values matching the fieldIds
            var fieldInfecteds = await _context.fieldInfecteds
                .Where(fi => fieldIds.Contains(fi.fieldId ?? 0))
                .Select(fi => new DTO_FieldInfected
                {
                    id = fi.Id,
                    fieldId = fi.fieldId,
                    dateScreening = fi.dateScreening,
                    fieldDiseaseId = fi.fieldDiseaseId,
                    areaInfected = fi.areaInfected,
                    areaInfectedPercentage = fi.areaInfectedPercentage,
                    isActive = fi.isActive,
                    fieldName = _context.fields.Where(x=>x.Id == fi.fieldId).Select(x=>x.fieldName).FirstOrDefault(),
                    diseaseName = _context.fieldDiseases.Where(x=>x.Id == fi.fieldDiseaseId).Select(x=>x.diseaseName).FirstOrDefault(),
                    diseaseCategory = _context.diseaseCategories.Where(x=>x.Id == (_context.fieldDiseases.Where(y=>y.Id == fi.fieldDiseaseId).Select(y=>y.diseaseCategoryId).FirstOrDefault())).Select(x=>x.category).FirstOrDefault(),
                    area = _context.fields.Where(x=>x.Id == fi.fieldId).Select(x=>x.rubberArea).FirstOrDefault(),
                    remark = fi.remark,
                    severityLevel = fi.severityLevel,
                    dateRecovered = fi.dateRecovered,
                    diseaseCategoryId = _context.fieldDiseases.Where(x => x.Id == fi.fieldDiseaseId).Select(x => x.diseaseCategoryId).FirstOrDefault(),
                })
                .ToListAsync(); // Retrieve all matching fieldInfecteds

            return fieldInfecteds;
        }

        public async Task<FieldInfected> UpdateFieldInfectedRemark(FieldInfected fieldInfected)
        {
            var existingField = await _context.fieldInfecteds.FirstOrDefaultAsync(x => x.Id == fieldInfected.Id);
            if (existingField != null)
            {
                existingField.updatedDate = DateTime.Now;
                existingField.updatedBy = fieldInfected.updatedBy;
                existingField.isActive = fieldInfected.isActive;
                existingField.remark = fieldInfected.remark;
                existingField.dateRecovered = fieldInfected.dateRecovered;
                await _context.SaveChangesAsync();
                return existingField;
            }
            return null;
        }

        public async Task<List<DTO_FieldInfected>> GetFieldInfectedByFieldId(int id)
        {
            var fieldInfected = await _context.fieldInfecteds.Where(x => x.fieldId == id).Select(x => new DTO_FieldInfected
            {
                id = x.Id,
                fieldId = x.fieldId,
                dateScreening = x.dateScreening,
                fieldDiseaseId = x.fieldDiseaseId,
                areaInfected = x.areaInfected,
                areaInfectedPercentage = x.areaInfectedPercentage,
                isActive = x.isActive,
                fieldName = _context.fields.Where(y => y.Id == x.fieldId).Select(y => y.fieldName).FirstOrDefault(),
                diseaseName = _context.fieldDiseases.Where(y => y.Id == x.fieldDiseaseId).Select(y => y.diseaseName).FirstOrDefault(),
                area = _context.fields.Where(y => y.Id == x.fieldId).Select(x => x.area).FirstOrDefault(),
                remark = x.remark,
                severityLevel = x.severityLevel,
                dateRecovered = x.dateRecovered
            }).ToListAsync();
            return fieldInfected;
        }

        public async Task<DTO_FieldInfected> GetFieldInfectedById(int id)
        {
            var fieldInfected = await _context.fieldInfecteds.Where(x => x.Id == id).Select(x => new DTO_FieldInfected
            {
                id = x.Id,
                fieldId = x.fieldId,
                dateScreening = x.dateScreening,
                fieldDiseaseId = x.fieldDiseaseId,
                areaInfected = x.areaInfected,
                areaInfectedPercentage = x.areaInfectedPercentage,
                isActive = x.isActive,
                fieldName = _context.fields.Where(y => y.Id == x.fieldId).Select(y => y.fieldName).FirstOrDefault(),
                diseaseName = _context.fieldDiseases.Where(y => y.Id == x.fieldDiseaseId).Select(y => y.diseaseName).FirstOrDefault(),
                area = _context.fields.Where(y => y.Id == x.fieldId).Select(x => x.area).FirstOrDefault(),
                remark = x.remark,
                severityLevel = x.severityLevel,
                dateRecovered = x.dateRecovered,
                createdBy = x.createdBy,
                createdDate = x.createdDate,
                updatedDate = x.updatedDate,
                updatedBy = x.updatedBy
            }).FirstOrDefaultAsync();
            return fieldInfected;
        }
    }
}
