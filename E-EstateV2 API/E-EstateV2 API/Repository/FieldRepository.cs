using E_EstateV2_API.Data;
using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using E_EstateV2_API.ViewModel;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Asn1.X9;

namespace E_EstateV2_API.Repository
{
    public class FieldRepository:IFieldRepository
    {
        private readonly ApplicationDbContext _context;

        public FieldRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Field> AddField(Field field)
        {
            field.createdDate = DateTime.Now;
            await _context.fields.AddAsync(field);
            await _context.SaveChangesAsync();
            return field;
        }

        public async Task<List<DTO_Field>> GetFields()
        {
            var field = await _context.fields.Select(x => new DTO_Field
            {
                id = x.Id,
                fieldName = x.fieldName,
                area = x.area,
                isMature = x.isMature,
                isActive = x.isActive,
                dateOpenTapping = x.dateOpenTapping,
                yearPlanted = x.yearPlanted,
                fieldStatus = _context.fieldStatus.Where(y => y.Id == x.fieldStatusId).Select(y => y.fieldStatus).FirstOrDefault(),
                initialTreeStand = x.initialTreeStand,
                totalTask = x.totalTask
            }).ToListAsync();
            return field;
        }

        public async Task<List<DTO_Field>> GetFieldDescStatus()
        {
            var field = await _context.fields.Select(x => new DTO_Field
            {
                id = x.Id,
                fieldName = x.fieldName,
                area = x.area,
                isMature = x.isMature,
                isActive = x.isActive,
                dateOpenTapping = x.dateOpenTapping,
                yearPlanted = x.yearPlanted,
                fieldStatus = _context.fieldStatus.Where(y => y.Id == x.fieldStatusId).Select(y => y.fieldStatus).FirstOrDefault(),
                initialTreeStand = x.initialTreeStand,
                totalTask = x.totalTask
            }).OrderByDescending(c => c.isActive)
                .ToListAsync();
            return field;
        }

        public async Task<DTO_Field> GetFieldById(int id)
        {
            var cloneIds = _context.fieldClones.Where(y => y.fieldId == id).Select(y => y.cloneId).ToList();
            
            var field = await _context.fields.Where(x => x.Id == id).Select(x => new DTO_Field
            {
                id = x.Id,
                fieldName = x.fieldName,
                area = x.area,
                isMature = x.isMature,
                isActive = x.isActive,
                dateOpenTapping = x.dateOpenTapping,
                dateOpenTappingFormatted = (x.dateOpenTapping != null) ? x.dateOpenTapping.Value.ToString("yyyy-MM-dd") : null,
                yearPlanted = x.yearPlanted,
                fieldDiseaseId = x.fieldDiseaseId,
                infectedPercentage = x.infectedPercentage,
                //fieldStatus = _context.fieldStatus.Where(y => y.Id == x.fieldStatusId).Select(y => y.fieldStatus).FirstOrDefault(),
                fieldStatusId = _context.fieldStatus.Where(y => y.Id == x.fieldStatusId).Select(y => y.Id).FirstOrDefault(),
                fieldStatuses = _context.fieldStatus.Where(y => y.Id == x.fieldStatusId).Select(y => new DTO_FieldStatus
                {
                    id = y.Id,
                    fieldStatus = y.fieldStatus,
                }).ToList(),
                //clones = _context.clones.Where(y=>y.Id == _context.fieldClones.Where(y => y.fieldId == id).Select(y => y.cloneId).FirstOrDefault()).ToList()
                clones = _context.clones.Where(y => cloneIds.Contains(y.Id)).Select(y => new DTO_Clone
                {
                    id = y.Id,
                    cloneName = y.cloneName
                }).ToList(),
                initialTreeStand = x.initialTreeStand,
                totalTask = x.totalTask,
                conversionCropName = _context.fieldConversions.Where(y => y.fieldId == x.Id).Select(y => y.conversionCropName).FirstOrDefault(),
                sinceYear = _context.fieldConversions.Where(y => y.fieldId == x.Id).Select(y => y.sinceYear).FirstOrDefault(),
                conversionId = _context.fieldConversions.Where(y => y.fieldId == x.Id).Select(y => y.Id).FirstOrDefault()
            }).FirstOrDefaultAsync();
            return field;
        }

        public async Task<Field> UpdateField(Field field)
        {
            var existingField = await _context.fields.FirstOrDefaultAsync(x => x.Id == field.Id);
            if (existingField != null)
            {
                existingField.fieldName = field.fieldName;
                existingField.area = field.area;
                existingField.isMature = field.isMature;
                existingField.fieldStatusId = field.fieldStatusId;
                existingField.yearPlanted = field.yearPlanted;
                existingField.dateOpenTapping = field.dateOpenTapping;
                existingField.initialTreeStand = field.initialTreeStand;
                existingField.fieldDiseaseId = field.fieldDiseaseId;
                existingField.infectedPercentage = field.infectedPercentage;
                existingField.totalTask = field.totalTask;
                existingField.updatedBy = field.updatedBy;
                existingField.updatedDate = DateTime.Now;
                existingField.isActive = field.isActive;
                await _context.SaveChangesAsync();
                return existingField;
            }
            return null;
        }

        public async Task<FieldClone> AddFieldClone(FieldClone clone)
        {
            clone.createdDate = DateTime.Now;
            await _context.fieldClones.AddAsync(clone);
            await _context.SaveChangesAsync();
            return clone;
        }

        public async Task<FieldClone> GetFieldCloneById(int cloneId, int fieldId)
        {
            return await _context.fieldClones
            .FirstOrDefaultAsync(x => x.cloneId == cloneId && x.fieldId == fieldId);
        }

        public async Task DeleteFieldClone(FieldClone fieldClone)
        {
            _context.fieldClones.Remove(fieldClone);
            await _context.SaveChangesAsync();
        }
    }
}
