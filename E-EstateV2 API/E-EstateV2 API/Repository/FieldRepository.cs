using E_EstateV2_API.Data;
using E_EstateV2_API.DTO;
using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using E_EstateV2_API.ViewModel;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Asn1.X9;
using System.Globalization;

namespace E_EstateV2_API.Repository
{
    public class FieldRepository:IFieldRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly IFieldHistoryRepository _fieldHistoryRepository;

        public FieldRepository(ApplicationDbContext context, IFieldHistoryRepository fieldHistoryRepository)
        {
            _context = context;
            _fieldHistoryRepository = fieldHistoryRepository;
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
                totalTask = x.totalTask,
                estateId = x.estateId,
                createdDate = x.createdDate,
                rubberArea = x.rubberArea,
                currentTreeStand = x.currentTreeStand,
                remark = x.remark,
                fieldGrants = _context.fieldGrants.Where(y=>y.fieldId == x.Id).ToList(),
            }).OrderByDescending(c => c.yearPlanted).ToListAsync();
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
            var cloneIds = _context.fieldClones.Where(y => y.fieldId == id && y.isActive == true).Select(y => y.cloneId).ToList();
            
            var field = await _context.fields.Where(x => x.Id == id).Select(x => new DTO_Field
            {
                id = x.Id,
                fieldName = x.fieldName,
                area = x.area,
                isMature = x.isMature,
                isActive = x.isActive,
                dateOpenTapping = x.dateOpenTapping,
                dateOpenTappingFormatted = (x.dateOpenTapping != null) ? x.dateOpenTapping.Value.ToString("yyyy-MM") : null,
                yearPlanted = x.yearPlanted,
                //fieldStatus = _context.fieldStatus.Where(y => y.Id == x.fieldStatusId).Select(y => y.fieldStatus).FirstOrDefault(),
                fieldStatusId = _context.fieldStatus.Where(y => y.Id == x.fieldStatusId).Select(y => y.Id).FirstOrDefault(),
                fieldStatuses = _context.fieldStatus.Where(y => y.Id == x.fieldStatusId).Select(y => new DTO_FieldStatus
                {
                    id = y.Id,
                    fieldStatus = y.fieldStatus,
                }).ToList(),
                //clones = _context.clones.Where(y=>y.Id == _context.fieldClones.Where(y => y.fieldId == id).Select(y => y.cloneId).FirstOrDefault()).ToList()
                fieldClones = _context.fieldClones.Where(y => y.fieldId == id && y.isActive == true).Select(y=> new DTO_FieldClone
                {
                    Id = y.Id,
                    cloneId = y.cloneId,
                    cloneName = _context.clones.Where(c=>c.Id == y.cloneId).Select(c=>c.cloneName).FirstOrDefault(),
                }).ToList(),
                initialTreeStand = x.initialTreeStand,
                totalTask = x.totalTask,
                conversionCropName = _context.otherCrops.Where(y => y.Id == (_context.fieldConversions.Where(z=>z.fieldId == x.Id).Select(z=>z.otherCropId).FirstOrDefault())).Select(y => y.otherCrop).FirstOrDefault(),
                sinceYear = _context.fieldConversions.Where(y => y.fieldId == x.Id).Select(y => y.sinceYear).FirstOrDefault(),
                conversionId = _context.fieldConversions.Where(y => y.fieldId == x.Id).Select(y => y.Id).FirstOrDefault(),
                otherCropId = _context.fieldConversions.Where(y => y.fieldId == x.Id).Select(y => y.otherCropId).FirstOrDefault(),
                rubberArea = x.rubberArea,
                currentTreeStand = x.currentTreeStand,
                remark = x.remark,
                estateId = x.estateId
            }).FirstOrDefaultAsync();
            return field;
        }

        public async Task<FieldHistory> GetOneFieldHistory(int id)
        {
            var getFieldHistory = await _context.fieldHistories
                .Include(x => x.FieldStatus)
                .Where(x => x.fieldId == id)
                .OrderByDescending(x => x.Id) 
                .FirstOrDefaultAsync();

            return getFieldHistory;
        }

        public async Task<Field> UpdateField(Field field)
        {
            var existingField = await _context.fields.FirstOrDefaultAsync(x => x.Id == field.Id);
            if (existingField != null)
            {
                var fieldHistory = new FieldHistory
                {
                    fieldId = existingField.Id,
                    fieldName = existingField.fieldName,
                    area = existingField.area,
                    rubberArea = existingField.rubberArea,
                    isMature = existingField.isMature,
                    isActive = existingField.isActive,
                    dateOpenTapping = existingField.dateOpenTapping,
                    yearPlanted = existingField.yearPlanted,
                    remark = existingField.remark,
                    totalTask = existingField.totalTask,
                    initialTreeStand = existingField.initialTreeStand,
                    currentTreeStand = existingField.currentTreeStand,
                    createdBy = existingField.createdBy,
                    createdDate = existingField.createdDate,
                    updatedBy = existingField.updatedBy,
                    updatedDate = existingField.updatedDate,
                    fieldStatusId = existingField.fieldStatusId,
                    estateId = existingField.estateId,
                };

                await _fieldHistoryRepository.AddFieldHistory(fieldHistory);

                existingField.fieldName = field.fieldName;
                existingField.area = field.area;
                existingField.isMature = field.isMature;
                existingField.fieldStatusId = field.fieldStatusId;
                existingField.rubberArea = field.rubberArea;
                existingField.currentTreeStand = field.currentTreeStand;
                existingField.remark = field.remark;
                existingField.yearPlanted = field.yearPlanted;
                existingField.dateOpenTapping = field.dateOpenTapping;
                existingField.initialTreeStand = field.initialTreeStand;
                existingField.totalTask = field.totalTask;
                existingField.updatedBy = field.updatedBy;
                existingField.updatedDate = DateTime.Now;
                existingField.isActive = field.isActive;
                await _context.SaveChangesAsync();
                return existingField;
            }
            return null;
        }

        public async Task<Field> UpdateFieldInfected(Field field)
        {
            var existingField = await _context.fields.FirstOrDefaultAsync(x => x.Id == field.Id);
            if(existingField != null)
            {
                existingField.isActive = field.isActive;
                existingField.updatedBy = field.updatedBy;
                existingField.updatedDate = DateTime.Now;
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
