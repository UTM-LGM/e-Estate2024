using E_EstateV2_API.Data;
using E_EstateV2_API.IRepository;
using E_EstateV2_API.ViewModel;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace E_EstateV2_API.Repository
{
    public class ReportRepository:IReportRepository
    {
        private readonly ApplicationDbContext _context;

        public ReportRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<object> GetProductionYearlyByField(int year)
        {
            var monthyearstrings = await _context.fieldProductions
                .Where(x => x.monthYear.Contains(year.ToString()))
                .Select(x => new
                {
                    monthYear = x.monthYear,
                    estateId = _context.estates.Where(y => y.Id == (_context.fields.Where(f => f.Id == x.fieldId).Select(f => f.estateId).FirstOrDefault())).Select(e => e.Id).FirstOrDefault(),
                }).ToListAsync();

            var orderedMonthYearStrings = monthyearstrings
                .GroupBy(x => x.estateId)
                .Select(group => new
                {
                    estateId = group.Key,
                    monthYear = group
                        .Max(x => DateTime.ParseExact(x.monthYear, "MMM-yyyy", CultureInfo.InvariantCulture))
                        .ToString("MMM-yyyy"),
                }).ToList();


            var fieldProduction = await _context.fieldProductions.Where(x => x.monthYear.Contains(year.ToString())).Select(x => new
            {
                fieldId = x.fieldId,
                fieldName = _context.fields.Where(y => y.Id == x.fieldId).Select(y => y.fieldName).FirstOrDefault(),
                noTaskTap = x.noTaskTap,
                fieldArea = _context.fields.Where(y => y.Id == x.fieldId).Select(y => y.area).FirstOrDefault(),
                totalTask = _context.fields.Where(y => y.Id == x.fieldId).Select(y => y.totalTask).FirstOrDefault(),
                //totalCrop = x.cuplump + x.latex,
                cuplumpDry = x.cuplump * (x.cuplumpDRC / 100),
                latexDry = x.latex * (x.latexDRC / 100),
                ussDry = x.USS * (x.USSDRC / 100),
                othersDry = x.others * (x.othersDRC / 100),

                estateId = _context.estates.Where(y => y.Id == (_context.fields.Where(f => f.Id == x.fieldId).Select(f => f.estateId).FirstOrDefault())).Select(e => e.Id).FirstOrDefault(),
            }).ToListAsync();

            var groupdFieldProduction = fieldProduction
                 .GroupBy(x => x.fieldId)
                 .Select(group => new
                 {
                     fieldId = group.Key,
                     fieldName = group.First().fieldName,
                     //totalCrop = group.Sum(x => x.totalCrop),
                     cuplumpDry = group.Sum(x => x.cuplumpDry),
                     latexDry = group.Sum(x => x.latexDry),
                     ussDry = group.Sum(x=> x.ussDry),
                     othersDry = group.Sum(x=> x.othersDry),
                     fieldArea = group.First().fieldArea,
                     totalTask = group.First().totalTask,
                     noTaskTap = group.First().noTaskTap,
                     estateId = group.First().estateId,
                     //double in the calculation to ensure the division results in a floating-point value.
                     tappedAreaPerHa = group.First().fieldArea * (double)group.First().noTaskTap / group.First().totalTask,
                 })
                 .ToList();

            var result = new
            {
                monthYear = orderedMonthYearStrings,
                production = groupdFieldProduction
            };

            return result;
        }

        public async Task<List<DTO_FieldProduction>> GetCurrentProduction()
        {
            int year = 2022;
            //int year = DateTime.Now.Year;

            var fieldProduction = await _context.fieldProductions.Where(x => x.monthYear.Contains(year.ToString())).Select(x => new DTO_FieldProduction
            {
                estateId = _context.estates.Where(y => y.Id == (_context.fields.Where(f => f.Id == x.fieldId).Select(f => f.estateId).FirstOrDefault())).Select(e => e.Id).FirstOrDefault(),
                cuplumpDry = x.cuplump * (x.cuplumpDRC / 100),
                latexDry = x.latex * (x.latexDRC / 100),
                ussDry = x.USS * (x.USSDRC / 100),
                othersDry = x.others * (x.othersDRC / 100),
            }).ToListAsync();

            var groupdFieldProduction = fieldProduction
                .GroupBy(x => x.estateId)
                 .Select(group => new DTO_FieldProduction
                 {
                     estateId = group.First().estateId,
                     cuplumpDry = group.Sum(x => x.cuplumpDry),
                     latexDry = group.Sum(x => x.latexDry),
                     ussDry = group.Sum(x=>x.ussDry),
                     othersDry = group.Sum(x=>x.othersDry)
                 })
                 .ToList();

            return groupdFieldProduction;
        }

        public List<DTO_FieldProduction> GetProductionYearly(int year)
        {
            var fieldProduction = _context.fieldProductions.Where(x => x.monthYear.Contains(year.ToString()))
                .Join(_context.fields, prod => prod.fieldId, field => field.Id, (prod, field) => new
                {
                    prod.monthYear,
                    cuplumpDry = prod.cuplump * (prod.cuplumpDRC / 100),
                    latexDry = prod.latex * (prod.latexDRC / 100),
                    ussDry = prod.USS * (prod.USSDRC/ 100),
                    otherDry = prod.others * (prod.othersDRC/ 100),
                    field.estateId
                }).GroupBy(x => new { x.monthYear, x.estateId })
                .Select(x => new DTO_FieldProduction
                {
                    monthYear = x.Key.monthYear,
                    cuplumpDry = x.Sum(x => x.cuplumpDry),
                    latexDry = x.Sum(x => x.latexDry),
                    ussDry = x.Sum(x => x.ussDry),
                    othersDry = x.Sum(x=>x.otherDry),
                    estateId = x.Key.estateId
                })
                //CultureInfo to ensures that the parsing is done using a culture-independent format
                .ToList() // Switch to client-side evaluation
                .OrderBy(x => DateTime.ParseExact(x.monthYear, "MMM-yyyy", CultureInfo.InvariantCulture))
                .ToList();
            return fieldProduction;
        }

        public async Task<object> GetCurrentLocalLabor()
        {
            int year = DateTime.Now.Year;

            var localLabor = await _context.localLabors.Where(x => x.monthYear.Contains(year.ToString())).Select(x => new DTO_LocalLabor
            {
                monthYear = x.monthYear,
                totalWorker = x.totalWorker,
                estateId = x.estateId
            }).ToListAsync();

            var groupLocalLabor = localLabor
                .GroupBy(x => x.monthYear)
                 .Select(group => new DTO_LocalLabor
                 {
                     estateId = group.First().estateId,
                     monthYear = group.First().monthYear,
                     totalLaborWorker = group.Sum(x => x.totalWorker)
                 }).OrderBy(x => x.monthYear)
                 .ToList();

            var latestEntry = groupLocalLabor.FirstOrDefault();

            var result = new[] { latestEntry };

            return result;
        }

        public async Task<object> GetCurrentForeignLabor()
        {
            int year = DateTime.Now.Year;

            /**var foreignLabor = await _context.foreignLabors.Where(x => x.monthYear.Contains(year.ToString())).Select(x => new DTO_LaborInfo
            {
                monthYear = x.monthYear,
                totalLaborWorker = x.tapperCheckrole + x.tapperContractor + x.fieldCheckrole + x.fieldContractor,
                estateId = x.estateId
            }).ToListAsync();

            var groupForeignLabor = foreignLabor
                .GroupBy(x => x.monthYear)
                 .Select(group => new DTO_LaborInfo
                 {
                     estateId = group.First().estateId,
                     monthYear = group.First().monthYear,
                     totalLaborWorker = group.Sum(x => x.totalLaborWorker)
                 }).OrderBy(x => x.monthYear)
                 .ToList();

            var latestEntry = groupForeignLabor.FirstOrDefault();

            var result = new[] { latestEntry };

            return result; **/
            return null;
        }

        public async Task<object> GetProductionYearlyByClone(int year)
        {

            //List all monthYear
            var monthyearstrings = await _context.fieldProductions
                    .Where(x => x.monthYear.Contains(year.ToString()))
                    .Select(x => new DTO_FieldProduction
                    {
                        monthYear = x.monthYear,
                        estateId = _context.estates.Where(y => y.Id == (_context.fields.Where(f => f.Id == x.fieldId).Select(f => f.estateId).FirstOrDefault())).Select(e => e.Id).FirstOrDefault(),
                    }).ToListAsync();

            //Only take the last month input
            var orderedMonthYearStrings = monthyearstrings
               .GroupBy(x => x.estateId)
               .Select(group => new DTO_FieldProduction
               {
                   estateId = group.Key,
                   monthYear = group
                       .Max(x => DateTime.ParseExact(x.monthYear, "MMM-yyyy", CultureInfo.InvariantCulture))
                       .ToString("MMM-yyyy"),
               }).ToList();


            var fieldProduction = await _context.fieldProductions.Where(x => x.monthYear.Contains(year.ToString())).Select(x => new
            {
                fieldId = x.fieldId,
                cloneInfo = _context.fieldClones
                        .Where(y => y.fieldId == x.fieldId)
                        .Select(y => new
                        {
                            cloneId = y.cloneId,
                            cloneName = _context.clones.Where(z => z.Id == y.cloneId).Select(z => z.cloneName).FirstOrDefault()
                        })
                        .ToList(),
                //totalCrop = x.cuplump + x.latex,
                cuplumpDry = x.cuplump * (x.cuplumpDRC / 100),
                latexDry = x.latex * (x.latexDRC / 100),
                ussDry = x.USS * (x.USSDRC / 100),
                othersDry = x.others * (x.othersDRC / 100),
                estateId = _context.estates.Where(y => y.Id == (_context.fields.Where(f => f.Id == x.fieldId).Select(f => f.estateId).FirstOrDefault())).Select(e => e.Id).FirstOrDefault(),
            }).ToListAsync();

            var groupedFieldProduction = fieldProduction
                    .SelectMany(x => x.cloneInfo, (parent, child) => new
                    {
                        cloneId = child.cloneId,
                        cloneName = child.cloneName,
                        //totalCrop = parent.totalCrop,
                        cuplumpDry = parent.cuplumpDry,
                        latexDry = parent.latexDry,
                        ussDry = parent.ussDry,
                        othersDry = parent.othersDry,
                        estateId = parent.estateId,
                    })
                    .GroupBy(x => new { x.cloneId, x.cloneName})
                    .Select(group => new
                    {
                        cloneId = group.Key.cloneId,
                        cloneName = group.Key.cloneName,
                        cuplumpDry = group.Sum(x => x.cuplumpDry),
                        latexDry = group.Sum(x => x.latexDry),
                        ussDry = group.Sum(x=> x.ussDry),
                        othersDry = group.Sum(x=>x.othersDry),
                        //totalCrop = group.Sum(x => x.totalCrop),
                        estateId = group.First().estateId,
                    })
                    .ToList();

            var result = new
            {
                monthYear = orderedMonthYearStrings,
                production = groupedFieldProduction
            };

            return result;

        }
    }
}
