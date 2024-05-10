using E_EstateV2_API.Data;
using E_EstateV2_API.DTO;
using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using E_EstateV2_API.ViewModel;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace E_EstateV2_API.Repository
{
    public class ReportRepository : IReportRepository
    {
        private readonly ApplicationDbContext _context;

        public ReportRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        //LGMAdmin
        public async Task<object> GetCurrentProduction()
        {
            int year = DateTime.Now.Year;

            var fieldProduction = await _context.fieldProductions.Where(x => x.status == "Submitted" && x.monthYear.Contains(year.ToString())).Select(x => new
            {
                estateId = _context.fields.Where(y => y.Id == x.fieldId).Select(y => y.estateId).FirstOrDefault(),
                cuplumpDry = x.cuplump * (x.cuplumpDRC / 100),
                latexDry = x.latex * (x.latexDRC / 100),
                ussDry = x.USS * (x.USSDRC / 100),
                othersDry = x.others * (x.othersDRC / 100),
            }).ToListAsync();

            var groupdFieldProduction = fieldProduction
                .GroupBy(x => x.estateId)
                 .Select(group => new
                 {
                     estateId = group.First().estateId,
                     cuplumpDry = group.Sum(x => x.cuplumpDry),
                     latexDry = group.Sum(x => x.latexDry),
                     ussDry = group.Sum(x => x.ussDry),
                     othersDry = group.Sum(x => x.othersDry)
                 })
                 .ToList();
            return groupdFieldProduction;
        }

        //LGMAdmin
        public async Task<object> GetProductivity()
        {
            var fieldProduction = await _context.fieldProductions
                .Where(x => x.status == "Submitted") // Filter by status
                .Select(x => new
                {
                    EstateId = _context.fields.Where(y => y.Id == x.fieldId).Select(y => y.estateId).FirstOrDefault(),
                    CuplumpDry = x.cuplump * (x.cuplumpDRC / 100),
                    LatexDry = x.latex * (x.latexDRC / 100),
                    UssDry = x.USS * (x.USSDRC / 100),
                    OthersDry = x.others * (x.othersDRC / 100),
                    Area = _context.fields.Where(y => y.Id == x.fieldId).Select(y => y.area).FirstOrDefault(),
                    MonthYear = x.monthYear
                })
                .ToListAsync();

            var productivityMetrics = fieldProduction
                .Select(x => new
                {
                    x.MonthYear,
                    x.EstateId,
                    ProductivityCuplumpDry = x.CuplumpDry / x.Area,
                    ProductivityLatexDry = x.LatexDry / x.Area,
                    ProductivityUssDry = x.UssDry / x.Area,
                    ProductivityOthersDry = x.OthersDry / x.Area
                })
                .ToList();

            return productivityMetrics;
        }

        // Define the GetMonthValue 
        int GetMonthValue(string monthYear)
        {
            string[] monthNames = { "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC" };
            string month = monthYear.Split('-')[0].Trim(); // Extract month string (e.g., 'Mar' from 'Mar-2024')

            // Find the index of the month in the monthNames array
            int monthIndex = Array.IndexOf(monthNames, month);

            // Add 1 to the index to make it 1-based
            return monthIndex + 1;
        }

        //LGMAdmin
        public async Task<object> GetLatestMonthWorker()
        {
            int year = DateTime.Now.Year;

            // Fetch all laborInfos records into memory
            var allLaborInfos = await _context.laborInfos.ToListAsync();

            var latestMonthYearsForEachEstate = allLaborInfos
                .Where(x => x.monthYear.Contains(year.ToString())) // Filter by year
                .GroupBy(x => x.estateId) // Group by estateId
                .Select(group => new
                {
                    EstateId = group.Key,
                    LatestMonthYear = group.OrderByDescending(x => GetMonthValue(x.monthYear)).Select(x => x.monthYear).FirstOrDefault()
                })
                .ToList();

            var workerForEachEstate = new List<object>();

            foreach (var latestMonthYearForEstate in latestMonthYearsForEachEstate)
            {
                var worker = allLaborInfos
                    .Where(x => x.estateId == latestMonthYearForEstate.EstateId && x.monthYear == latestMonthYearForEstate.LatestMonthYear)
                    .Select(x => new
                    {
                        estateId = x.estateId,
                        tapperCheckrole = x.tapperCheckrole,
                        tapperContractor = x.tapperContractor,
                        fieldCheckrole = x.fieldCheckrole,
                        fieldContractor = x.fieldContractor
                    })
                    .FirstOrDefault();

                workerForEachEstate.Add(worker);
            }

            return workerForEachEstate;
        }


        public async Task<object> GetProductionYearlyByField(int year)
        {
            var monthyearstrings = await _context.fieldProductions
                .Where(x => x.monthYear.Contains(year.ToString()))
                .Select(x => new
                {
                    monthYear = x.monthYear,
                    estateId = _context.fields.Where(y => y.Id == x.fieldId).Select(y => y.estateId).ToList()
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

                estateId = _context.fields.Where(y => y.Id == x.fieldId).Select(y => y.estateId).ToList()
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
                     ussDry = group.Sum(x => x.ussDry),
                     othersDry = group.Sum(x => x.othersDry),
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



        private int GetYear(string monthYear)
        {
            if (DateTime.TryParseExact(monthYear, "MMM-yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime date))
            {
                return date.Year;
            }
            // Handle invalid input or edge cases
            return -1; // Or throw an exception
        }

        public List<DTO_FieldProduction> GetProductionYearly(int year)
        {
            var fieldProduction = _context.fieldProductions.Where(x => x.status == "Submitted" && x.monthYear.Contains(year.ToString()))
                .Join(_context.fields, prod => prod.fieldId, field => field.Id, (prod, field) => new
                {
                    prod.monthYear,
                    cuplumpDry = prod.cuplump * (prod.cuplumpDRC / 100),
                    latexDry = prod.latex * (prod.latexDRC / 100),
                    ussDry = prod.USS * (prod.USSDRC / 100),
                    otherDry = prod.others * (prod.othersDRC / 100),
                    field.estateId
                }).GroupBy(x => new { x.monthYear, x.estateId })
                .Select(x => new DTO_FieldProduction
                {
                    monthYear = x.Key.monthYear,
                    cuplumpDry = x.Sum(x => x.cuplumpDry),
                    latexDry = x.Sum(x => x.latexDry),
                    ussDry = x.Sum(x => x.ussDry),
                    othersDry = x.Sum(x => x.otherDry),
                    estateId = x.Key.estateId
                })
                //CultureInfo to ensures that the parsing is done using a culture-independent format
                .ToList() // Switch to client-side evaluation
                .OrderBy(x => DateTime.ParseExact(x.monthYear, "MMM-yyyy", CultureInfo.InvariantCulture))
                .ToList();
            return fieldProduction;
        }

        //EstateClerk
        public async Task<object> GetFieldArea()
        {
            var field = await _context.fields.Where(x => x.isActive == true).Select(x => new
            {
                fieldId = x.Id,
                area = x.area,
                isMature = x.isMature,
                estateId = x.estateId
            }).ToListAsync();

            return field;
        }


        public async Task<object> GetProductionYearlyByClone(int year)
        {
            var fieldProduction = await _context.fieldProductions.Where(x => x.status == "Submitted" && x.monthYear.Contains(year.ToString())).Select(x => new
            {
                fieldId = x.fieldId,
                area = _context.fields.Where(y => y.Id == x.fieldId).Select(y => y.area).FirstOrDefault(),
                fieldClone = _context.fieldClones.Where(y => y.fieldId == x.fieldId).Select(y => new
                {
                    cloneId = y.cloneId,
                    cloneName = _context.clones.Where(t => t.Id == y.cloneId).Select(y => y.cloneName).FirstOrDefault(),
                }).ToList(),
            }).ToListAsync();
            return fieldProduction;
        }

        public async Task<object> GetProductivityYearlyByClone(int year)
        {

            var fieldProduction = await _context.fieldProductions.Where(x => x.status == "Submitted" && x.monthYear.Contains(year.ToString())).Select(x => new
            {
                fieldId = x.fieldId,
                area = _context.fields.Where(y => y.Id == x.fieldId).Select(y => y.area).FirstOrDefault(),
                cuplumpDry = x.cuplump * (x.cuplumpDRC / 100),
                latexDry = x.latex * (x.latexDRC / 100),
                ussDry = x.USS * (x.USSDRC / 100),
                othersDry = x.others * (x.othersDRC / 100),
                fieldClone = _context.fieldClones.Where(y => y.fieldId == x.fieldId).Select(y => new
                {
                    cloneId = y.cloneId,
                    cloneName = _context.clones.Where(t => t.Id == y.cloneId).Select(y => y.cloneName).FirstOrDefault(),
                }).ToList(),
            }).ToListAsync();
            return fieldProduction;
        }

        //LGMAdmin
        public async Task<object> GetLaborInformationCategory()
        {
            var allLaborInfos = await _context.laborInfos.ToListAsync();

            var latestMonthYearsForEachEstate = allLaborInfos
                .GroupBy(x => x.estateId) // Group by estateId
                .Select(group => new
                {
                    EstateId = group.Key,
                    LatestMonthYear = group.OrderByDescending(x => GetMonthValue(x.monthYear)).Select(x => x.monthYear).FirstOrDefault()
                })
                .ToList();

            var workerForEachLaborType = new List<object>();

            foreach (var latestMonthYearForEstate in latestMonthYearsForEachEstate)
            {
                var labor = await _context.laborByCategories
                    .Where(x => x.LaborInfo.monthYear == latestMonthYearForEstate.LatestMonthYear && x.LaborInfo.estateId == latestMonthYearForEstate.EstateId)
                    .GroupBy(x => x.laborTypeId) // Group by laborTypeId
                    .Select(group => new
                    {
                        laborTypeId = group.Key,
                        estateId = latestMonthYearForEstate.EstateId,
                        latestMonthYear = latestMonthYearForEstate.LatestMonthYear,
                        laborType = _context.laborTypes.Where(y => y.Id == group.Key).Select(y => y.laborType).FirstOrDefault(),
                        localNoOfWorkers = group
                            .Join(_context.laborInfos, x => x.laborInfoId, y => y.Id, (x, y) => new { x, y })
                            .Join(_context.countries, xy => xy.y.countryId, z => z.Id, (xy, z) => new { xy.x, xy.y, z })
                            .Where(xyz => xyz.z.isLocal)
                            .Sum(xyz => xyz.x.noOfWorker),
                        foreignNoOfWorkers = group
                            .Join(_context.laborInfos, x => x.laborInfoId, y => y.Id, (x, y) => new { x, y })
                            .Join(_context.countries, xy => xy.y.countryId, z => z.Id, (xy, z) => new { xy.x, xy.y, z })
                            .Where(xyz => !xyz.z.isLocal)
                            .Sum(xyz => xyz.x.noOfWorker)
                    })
                    .ToListAsync();

                workerForEachLaborType.AddRange(labor);
            }

            var groupedResult = workerForEachLaborType
            .GroupBy(x => new {
                laborTypeId = (int)x.GetType().GetProperty("laborTypeId").GetValue(x, null),
                estateId = (int)x.GetType().GetProperty("estateId").GetValue(x, null)
            })
            .Select(group => new
            {
                estateId = group.Key.estateId,
                laborTypeId = group.Key.laborTypeId,
                laborType = _context.laborTypes
                    .Where(y => y.Id == group.Key.laborTypeId)
                    .Select(y => y.laborType)
                    .FirstOrDefault(),
                localNoOfWorkers = group.Sum(x => (int)x.GetType().GetProperty("localNoOfWorkers").GetValue(x, null)),
                foreignNoOfWorkers = group.Sum(x => (int)x.GetType().GetProperty("foreignNoOfWorkers").GetValue(x, null))
            })
            .ToList();


            return groupedResult;
        }

        //LGMAdmin
        public async Task<object> GetTapperAndFieldWorker()
        {
            // Fetch all laborInfos records into memory
            var allLaborInfos = await _context.laborInfos.ToListAsync();

            // Fetch the necessary data for isLocal before the LINQ query
            var countryIsLocalMap = _context.countries.ToDictionary(y => y.Id, y => y.isLocal);

            var latestMonthYearsForEachEstate = allLaborInfos
                .GroupBy(x => new { x.estateId, IsLocal = countryIsLocalMap.ContainsKey(x.countryId) ? countryIsLocalMap[x.countryId] : false }) // Group by estateId and isLocal
                .Select(group => new
                {
                    group.Key.estateId,
                    group.Key.IsLocal,
                    LatestMonthYear = group.OrderByDescending(x => GetMonthValue(x.monthYear)).Select(x => x.monthYear).FirstOrDefault()
                })
                .ToList();

            var workerForEachEstate = new List<object>();

            foreach (var latestMonthYearForEstate in latestMonthYearsForEachEstate)
            {
                var worker = allLaborInfos
                    .Where(x => x.estateId == latestMonthYearForEstate.estateId
                             && x.monthYear == latestMonthYearForEstate.LatestMonthYear
                             && _context.countries.Where(y => y.Id == x.countryId).Select(y => y.isLocal).FirstOrDefault() == latestMonthYearForEstate.IsLocal)
                    .Select(x => new
                    {
                        estateId = x.estateId,
                        isLocal = _context.countries.Where(y => y.Id == x.countryId).Select(y => y.isLocal).FirstOrDefault(),
                        tapperWorker = x.tapperCheckrole + x.tapperContractor,
                        fieldWorker = x.fieldCheckrole + x.fieldContractor,
                    })
                    .FirstOrDefault();

                workerForEachEstate.Add(worker);
            }

            // Group by isLocal and calculate totals
            var groupedData = workerForEachEstate
            .GroupBy(x => new { EstateId = x.GetType().GetProperty("estateId").GetValue(x, null), IsLocal = x.GetType().GetProperty("isLocal").GetValue(x, null) })
            .Select(group => new
            {
                EstateId = group.Key.EstateId,
                IsLocal = group.Key.IsLocal,
                tapperWorker = group.Sum(x => (int)x.GetType().GetProperty("tapperWorker").GetValue(x, null)),
                fieldWorker = group.Sum(x => (int)x.GetType().GetProperty("fieldWorker").GetValue(x, null))
            })
            .ToList();

            return groupedData;
        }


        //LGMAdmin
        public async Task<object> GetWorkerShortageEstate()
        {
            // Fetch all worker shortage records into memory
            var allWorkerShortage = await _context.workerShortages.ToListAsync();

            var latestWorkerShortageForEachEstate = allWorkerShortage
                .GroupBy(x => x.estateId) // Group by estateId
                .Select(group => new
                {
                    EstateId = group.Key,
                    LatestMonthYear = group.OrderByDescending(x => GetMonthValue(x.monthYear)).Select(x => x.monthYear).FirstOrDefault(),
                    TapperShortage = group.OrderByDescending(x => GetMonthValue(x.monthYear)).Select(x => x.tapperWorkerShortage).FirstOrDefault(),
                    FieldShortage = group.OrderByDescending(x => GetMonthValue(x.monthYear)).Select(x => x.fieldWorkerShortage).FirstOrDefault()
                })
                .ToList();

            return latestWorkerShortageForEachEstate;
        }

        public async Task<object> GetCostInformation(int year)
        {
            var cost = await _context.costAmounts.Where(x =>x.status == "Submitted" && x.year == year).Select(x => new
            {
                amount = x.amount,
                costType = _context.costTypes.Where(y=>y.Id == (_context.costs.Where(z=>z.Id == x.costId).Select(z=>z.costTypeId).FirstOrDefault())).Select(y=>y.costType).FirstOrDefault(),
                isMature = _context.costs.Where(y=>y.Id == x.costId).Select(y=>y.isMature).FirstOrDefault(),
                costCategory = _context.costCategories.Where(y => y.Id == (_context.costs.Where(z => z.Id == x.costId).Select(z => z.costCategoryId).FirstOrDefault())).Select(y => y.costCategory).FirstOrDefault(),
                costSubcategories1 = _context.costSubcategories1.Where(y => y.Id == (_context.costs.Where(z => z.Id == x.costId).Select(z => z.costSubcategory1Id).FirstOrDefault())).Select(y => y.costSubcategory1).FirstOrDefault(),
                costSubcategories2 = _context.costSubcategories2.Where(y => y.Id == (_context.costs.Where(z => z.Id == x.costId).Select(z => z.costSubcategory2Id).FirstOrDefault())).Select(y => y.costSubcategory2).FirstOrDefault(),
                estateId = x.estateId,
                costId = x.costId

            }).ToListAsync();
            return cost;
        }

    }
}
