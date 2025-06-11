using E_EstateV2_API.Data;
using E_EstateV2_API.DTO;
using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using E_EstateV2_API.ViewModel;
using Microsoft.EntityFrameworkCore;
using System.Data.Entity.Core.Common.CommandTrees.ExpressionBuilder;
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
        public async Task<object> GetCurrentProduction(int year)
        {
            var fieldProduction = await (
                from fp in _context.fieldProductions
                join f in _context.fields on fp.fieldId equals f.Id
                where fp.status == "SUBMITTED"
                      && fp.monthYear.Contains(year.ToString())
                      && f.isActive == true
                select new
                {
                    estateId = f.estateId,
                    cuplumpDry = fp.cuplump * (fp.cuplumpDRC / 100),
                    latexDry = fp.latex * (fp.latexDRC / 100)
                }
            ).ToListAsync();

            var groupedFieldProduction = fieldProduction
                .GroupBy(x => x.estateId)
                .Select(group => new
                {
                    estateId = group.Key,
                    cuplumpDry = Math.Round(group.Sum(x => x.cuplumpDry),2),
                    latexDry = Math.Round(group.Sum(x => x.latexDry),2)
                })
                .ToList();

            return groupedFieldProduction;
        }


        public async Task<object> GetProduction()
        {
            var fieldProduction = await _context.fieldProductions.Where(x => x.status == "SUBMITTED").Select(x => new
            {
                estateId = _context.fields.Where(y => y.Id == x.fieldId).Select(y => y.estateId).FirstOrDefault(),
                cuplumpDry = x.cuplump * (x.cuplumpDRC / 100),
                latexDry = x.latex * (x.latexDRC / 100),
                monthYear = x.monthYear
            }).ToListAsync();

            var groupdFieldProduction = fieldProduction
                .GroupBy(x => new { x.estateId, x.monthYear })
                 .Select(group => new
                 {
                     estateId = group.First().estateId,
                     monthYear = group.Key.monthYear,
                     cuplumpDry = group.Sum(x => x.cuplumpDry),
                     latexDry = group.Sum(x => x.latexDry),
                     rubberDry = group.Sum(x => x.cuplumpDry) + group.Sum(x => x.latexDry)
                 })
                 .ToList();
            return groupdFieldProduction;
        }

        public async Task<object> GetSales()
        {
            var sales = await _context.rubberSales.Select(x => new
            {
                estateId = x.estateId,
                saleDateTime = x.saleDateTime,
                saleDry = x.wetWeight * (x.DRC / 100),
            }).ToListAsync();

            var groupedSales = sales
                .GroupBy(x => new { x.estateId, SaleMonth = x.saleDateTime.ToString("MMM-yyyy") })
                .Select(group => new
                {
                    estateId = group.Key.estateId,
                    saleMonth = group.Key.SaleMonth.ToUpper(), // Now in "Jan-2025" format
                    saleDry = group.Sum(x => x.saleDry)
                }).ToList();
            return groupedSales;
        }

        public async Task<object> GetStocks()
        {
            var stocks = await _context.rubberStocks.Select(x => new
            {
                estateId = x.estateId,
                monthYear = x.monthYear,
                currentStock = x.currentStock,
                previousStock = x.previousStock
            }).ToListAsync();
            return stocks;
        }



        //LGMAdmin
        public async Task<object> GetProductivity()
        {
            var fieldProduction = await _context.fieldProductions
                .Where(x => x.status == "SUBMITTED") // Filter by status
                .Select(x => new
                {
                    EstateId = _context.fields.Where(y => y.Id == x.fieldId).Select(y => y.estateId).FirstOrDefault(),
                    CuplumpDry = x.cuplump * (x.cuplumpDRC / 100),
                    LatexDry = x.latex * (x.latexDRC / 100),
                    Area = _context.fields.Where(y => y.Id == x.fieldId).Select(y => y.rubberArea).FirstOrDefault(),
                    MonthYear = x.monthYear,
                    Year = x.monthYear.Substring(x.monthYear.Length - 4), // Extracting year from MonthYear
                    fieldId = x.fieldId,
                })
                .ToListAsync();

            var groupedData = fieldProduction
                .GroupBy(x => new { x.Year, x.fieldId })
                .Select(g => new
                {
                    Year = g.Key.Year,
                    FieldId = g.Key.fieldId,
                    Area = g.First().Area, // Assuming Area is same for all in the group
                    EstateId = g.First().EstateId, // Assuming EstateId is same for all in the group
                    TotalCuplumpDry = g.Sum(x => x.CuplumpDry),
                    TotalLatexDry = g.Sum(x => x.LatexDry),
                })
                .ToList();

            return groupedData;
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
        public async Task<object> GetLatestMonthWorker(int year)
        {
            var allLaborInfos = await _context.laborInfos.ToListAsync();

            var groupedByEstate = allLaborInfos
                .Where(x => x.monthYear.Contains(year.ToString()))
                .GroupBy(x => x.estateId)
                .Select(group =>
                {
                    // Find latest monthYear for this estateId
                    var latestMonth = group
                        .OrderByDescending(x => GetMonthValue(x.monthYear))
                        .Select(x => x.monthYear)
                        .FirstOrDefault();

                    // Get all rows for the latest monthYear
                    var latestRows = group
                        .Where(x => x.monthYear == latestMonth)
                        .ToList();

                    // ✅ Aggregate fields using SUM instead of MAX
                    var tapperCheckrole = latestRows.Sum(x => x.tapperCheckrole);
                    var tapperContractor = latestRows.Sum(x => x.tapperContractor);
                    var fieldCheckrole = latestRows.Sum(x => x.fieldCheckrole);
                    var fieldContractor = latestRows.Sum(x => x.fieldContractor);

                    return new
                    {
                        estateId = group.Key,
                        tapperCheckrole,
                        tapperContractor,
                        fieldCheckrole,
                        fieldContractor,
                        totalTapper = tapperCheckrole + tapperContractor,
                        totalField = fieldCheckrole + fieldContractor,
                        monthYear = latestMonth
                    };
                })
                .ToList();

            return groupedByEstate;
        }




        public async Task<object> GetProductionYearlyByField(int year)
        {
            var monthyearstrings = await _context.fieldProductions
                .Where(x => x.status == "SUBMITTED" && x.monthYear.Contains(year.ToString()))
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


            var fieldProduction = await _context.fieldProductions.Where(x => x.status == "SUBMITTED" && x.monthYear.Contains(year.ToString())).Select(x => new
            {
                fieldId = x.fieldId,
                fieldName = _context.fields.Where(y => y.Id == x.fieldId).Select(y => y.fieldName).FirstOrDefault(),
                noTaskTap = x.noTaskTap,
                fieldArea = _context.fields.Where(y => y.Id == x.fieldId).Select(y => y.rubberArea).FirstOrDefault(),
                totalTask = _context.fields.Where(y => y.Id == x.fieldId).Select(y => y.totalTask).FirstOrDefault(),
                //totalCrop = x.cuplump + x.latex,
                cuplumpDry = x.cuplump * (x.cuplumpDRC / 100),
                latexDry = x.latex * (x.latexDRC / 100),
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
            // Step 1: Query with only EF supported operations, no Math.Round, no GroupBy in EF
            var query = _context.fieldProductions
                .Where(x => x.status == "SUBMITTED" && x.monthYear.Contains(year.ToString()))
                .Join(_context.fields,
                    prod => prod.fieldId,
                    field => field.Id,
                    (prod, field) => new
                    {
                        prod.monthYear,
                        cuplumpDryRaw = prod.cuplump * (prod.cuplumpDRC / 100.0), // keep raw values, no rounding
                        latexDryRaw = prod.latex * (prod.latexDRC / 100.0),
                        field.estateId,
                        field.isActive
                    })
                .Where(x => x.isActive)
                .ToList(); // fetch data into memory

            // Step 2: Now group, sum, and round in-memory (LINQ to Objects)
            var result = query
                .GroupBy(x => new { x.monthYear, x.estateId })
                .Select(g => new DTO_FieldProduction
                {
                    monthYear = g.Key.monthYear,
                    // Cast to float if DTO expects float; round to 2 decimals
                    cuplumpDry = (float)Math.Round(g.Sum(x => x.cuplumpDryRaw), 2),
                    latexDry = (float)Math.Round(g.Sum(x => x.latexDryRaw), 2),
                    estateId = g.Key.estateId
                })
                .OrderBy(x => DateTime.ParseExact(x.monthYear, "MMM-yyyy", CultureInfo.InvariantCulture))
                .ToList();

            return result;
        }


        //EstateClerk
        public async Task<object> GetStateFieldArea(string start, string end, int estateId)
        {
            // Parse the start and end dates
            DateTime startDate = DateTime.ParseExact(start, "yyyy-MM", CultureInfo.InvariantCulture);
            DateTime endDate = DateTime.ParseExact(end + "-01", "yyyy-MM-dd", CultureInfo.InvariantCulture)
                                                  .AddMonths(1).AddDays(-1);

            // Create the range filters
            var excludedStatuses = new[] { "abandoned", "government", "conversion" };

            // Filter fields based on isActive, date range, fieldStatus and other criteria
            var fields = await _context.fields
                .Where(x => x.isActive == true
                            && x.createdDate >= startDate
                            && x.createdDate <= endDate
                            && x.estateId == estateId
                            && !excludedStatuses.Contains(_context.fieldStatus
                                .Where(y => y.Id == x.fieldStatusId)
                                .Select(y => y.fieldStatus.ToLower())
                                .FirstOrDefault())) // Filter based on fieldStatus (exclude unwanted statuses)
                .Select(x => new
                {
                    fieldId = x.Id,
                    rubberArea = x.rubberArea,
                    isMature = x.isMature,
                    estateId = x.estateId,
                    isActive = x.isActive,
                    fieldStatus = _context.fieldStatus.Where(y => y.Id == x.fieldStatusId).Select(y => y.fieldStatus).FirstOrDefault(),
                    createdDate = x.createdDate
                })
                .ToListAsync();

            if (!fields.Any())
            {
                return Array.Empty<object>(); // Return an empty array if no fields meet the criteria
            }

            return fields;
        }

        public async Task<object> GetFieldsByEstateId(int estateId)
        {
            var field = await _context.fields.Where(x => x.estateId == estateId).Select(x => new
            {
                id = x.Id,
                fieldName = x.fieldName,
                isMature = x.isMature,
                isActive = x.isActive,
                fieldStatus = _context.fieldStatus.Where(y => y.Id == x.fieldStatusId).Select(y => y.fieldStatus).FirstOrDefault(),
                estateId = x.estateId,
                createdDate = x.createdDate,
                rubberArea = x.rubberArea,
                fieldStatusId = x.fieldStatusId
            }).ToListAsync();
            if (!field.Any())
            {
                return new object[] { }; // Return an empty array
            }

            return field;
        }


        public async Task<object> GetFieldArea(int year)
        {
            var excludedStatuses = new[] { "abandoned", "government" };
            var field = await _context.fields.Where(x => x.isActive == true && x.createdDate.Year == year).Select(x => new
            {
                fieldId = x.Id,
                area = x.rubberArea,
                isMature = x.isMature,
                estateId = x.estateId,
                isActive = x.isActive,
                fieldStatus = _context.fieldStatus.Where(y => y.Id == x.fieldStatusId).Select(y => y.fieldStatus).FirstOrDefault(),
                createdDate = x.createdDate,
                fieldStatusId = x.fieldStatusId
            }).ToListAsync();

            return field;
        }

        public async Task<object> GetFieldAreaByDate(string start, string end, int estateId)
        {
            // Try parsing the strings into DateTime objects
            if (!DateTime.TryParse(start, out DateTime startDate) || !DateTime.TryParse(end, out DateTime endDate))
            {
                throw new ArgumentException("Invalid date format. Please use 'yyyy-MM-dd'.");
            }

            // Get fields that are active and fall within the given date range
            var fields = await _context.fields
                .Select(x => new
                {
                    fieldId = x.Id,
                    area = x.rubberArea,
                    isMature = x.isMature,
                    estateId = x.estateId,
                    isActive = x.isActive,
                    fieldStatus = _context.fieldStatus
                                    .Where(y => y.Id == x.fieldStatusId)
                                    .Select(y => y.fieldStatus)
                                    .FirstOrDefault(),
                    createdDate = x.createdDate,
                    fieldStatusId = x.fieldStatusId
                })
                .ToListAsync();

            return fields;
        }

        public async Task<object> GetProductionYearlyByClone(int year)
        {
            var fieldProduction = await _context.fieldProductions.Where(x => x.status == "SUBMITTED" && x.monthYear.Contains(year.ToString())).Select(x => new
            {
                fieldId = x.fieldId,
                area = _context.fields.Where(y => y.Id == x.fieldId).Select(y => y.rubberArea).FirstOrDefault(),
                fieldClone = _context.fieldClones.Where(y => y.fieldId == x.fieldId).Select(y => new
                {
                    cloneId = y.cloneId,
                    cloneName = _context.clones.Where(t => t.Id == y.cloneId).Select(y => y.cloneName).FirstOrDefault(),
                }).ToList(),
            }).ToListAsync();
            return fieldProduction;
        }

        public async Task<object> GetAreaByClone(int year)
        {
            // Fetch the raw data
            var fieldClone = await _context.fieldClones.Where(x=>x.createdDate.Year == year).Select(x => new
            {
                fieldId = x.fieldId,
                cloneId = x.cloneId,
                cloneName = _context.clones.Where(y=>y.Id == x.cloneId).Select(y => y.cloneName).FirstOrDefault(),
                area = _context.fields.Where(y => y.Id == x.fieldId && y.isActive == true).Select(y => y.rubberArea).FirstOrDefault(),
            }).ToListAsync();

            // Group by fieldId and create a list of cloneId for each fieldId
            var groupedResult = fieldClone
                .GroupBy(x => new { x.fieldId, x.area })
                .Select(g => new 
                {
                    fieldId = g.Key.fieldId,
                    area = g.Key.area,
                    cloneIds = g.Select(x => x.cloneId).ToList(),
                    cloneNames = g.Select(x => x.cloneName).ToList()
                }).ToList();

            return groupedResult;
        }

        public async Task<object> GetAreaByAllClone(string start, string end)
        {
            DateTime startDate = DateTime.ParseExact(start, "yyyy-MM", CultureInfo.InvariantCulture);
            DateTime endDate = DateTime.ParseExact(end + "-01", "yyyy-MM-dd", CultureInfo.InvariantCulture)
                                       .AddMonths(1).AddDays(-1);

            // Fetch the raw data
            var fieldClone = await _context.fieldClones
                .Where(x => x.createdDate >= startDate && x.createdDate <= endDate)
                .Select(x => new
                {
                    fieldId = x.fieldId,
                    cloneId = x.cloneId,
                    cloneName = _context.clones.Where(y => y.Id == x.cloneId).Select(y => y.cloneName).FirstOrDefault(),
                    area = _context.fields.Where(y => y.Id == x.fieldId && y.isActive == true).Select(y => y.rubberArea).FirstOrDefault()
                })
                .Where(x => x.area > 0) // Ensure there is an area to consider
                .ToListAsync();

            // Group by fieldId and ensure area is only counted once per field
            var groupedResult = fieldClone
                .GroupBy(x => x.fieldId)
                .Select(g => new DTO_EstateByClone
                {
                    fieldId = g.Key,
                    area = g.First().area,  // Only take the first area's value
                    cloneIds = g.Count() == 1 ? (object)g.First().cloneId : (object)g.Select(x => x.cloneId).ToList(),
                    cloneNames = g.Select(x => x.cloneName).Distinct().ToList()  // Collect distinct clone names
                })
                .ToList();

            return groupedResult;
        }

        //problem
        public async Task<object> GetCurrentField()
        {
            var field = await _context.fields
            .Select(x => new
            {
                id = x.Id,
                fieldName = x.fieldName,
                area = x.rubberArea,
                isMature = x.isMature,
                isActive = x.isActive,
                dateOpenTapping = x.dateOpenTapping,
                yearPlanted = x.yearPlanted,
                fieldStatus = _context.fieldStatus
                                .Where(y => y.Id == x.fieldStatusId)
                                .Select(y => y.fieldStatus)
                                .FirstOrDefault(),
                initialTreeStand = x.initialTreeStand,
                totalTask = x.totalTask,
                estateId = x.estateId,
                createdDate = x.createdDate,
                fieldStatusId = x.fieldStatusId
            }).ToListAsync();
            return field;
        }


        public async Task<object> GetProductivityYearlyByClone(int year)
        {

            var fieldProduction = await _context.fieldProductions.Where(x => x.status == "SUBMITTED" && x.monthYear.Contains(year.ToString())).Select(x => new
            {
                fieldId = x.fieldId,
                area = _context.fields.Where(y => y.Id == x.fieldId).Select(y => y.rubberArea).FirstOrDefault(),
                cuplumpDry = x.cuplump * (x.cuplumpDRC / 100),
                latexDry = x.latex * (x.latexDRC / 100),
                fieldClone = _context.fieldClones.Where(y => y.fieldId == x.fieldId).Select(y => new
                {
                    cloneId = y.cloneId,
                    cloneName = _context.clones.Where(t => t.Id == y.cloneId).Select(y => y.cloneName).FirstOrDefault(),
                }).ToList(),
            }).ToListAsync();
            return fieldProduction;
        }

        public async Task<object> GetAllProductivityYearlyByClone(string start, string end)
        {
            // Convert start and end to DateTime objects for accurate comparison
            if (!DateTime.TryParseExact($"{start}-01", "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime startDate) ||
                !DateTime.TryParseExact($"{end}-01", "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime endDate))
            {
                throw new ArgumentException("Invalid date format for start or end.");
            }


            bool IsWithinRange(string monthYear)
            {
                if (!DateTime.TryParseExact(monthYear, "MMM-yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime monthDate))
                {
                    return false; // Invalid format
                }

                // Check if monthDate is within startDate and endDate
                return startDate <= monthDate && monthDate <= endDate;
            }


            var allProduction = await _context.fieldProductions.Where(x=>x.status == "SUBMITTED").ToListAsync();
            var filteredProduction = allProduction.Where(x => IsWithinRange(x.monthYear) && x.status == "SUBMITTED").ToList();

            var fieldProduction = filteredProduction.Select(x => new
            {
                fieldId = x.fieldId,
                area = _context.fields.Where(y => y.Id == x.fieldId).Select(y => y.rubberArea).FirstOrDefault(),
                cuplumpDry = x.cuplump * (x.cuplumpDRC / 100),
                latexDry = x.latex * (x.latexDRC / 100),
                fieldClone = _context.fieldClones.Where(y => y.fieldId == x.fieldId).Select(y => new
                {
                    cloneId = y.cloneId,
                    cloneName = _context.clones.Where(t => t.Id == y.cloneId).Select(y => y.cloneName).FirstOrDefault(),
                }).ToList(),
            }).ToList();

            return fieldProduction;
        }


        //LGMAdmin
        public async Task<object> GetLaborInformationCategory(int year)
        {
            var allLaborInfos = await _context.laborInfos.ToListAsync();

            // Helper method to check if monthYear contains the specified year
            bool IsMatchingYear(string monthYear, int year)
            {
                return monthYear.Contains(year.ToString());
            }

            // Filter allLaborInfos to only include entries that match the specified year
            var filteredLaborInfos = allLaborInfos.Where(x => IsMatchingYear(x.monthYear, year)).ToList();

            var latestMonthYearsForEachEstate = filteredLaborInfos
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

        // LGMAdmin
        public async Task<object> GetAllLaborInformationCategory(string start, string end)
        {
            var allLaborInfos = await _context.laborInfos.ToListAsync();

            // Convert start and end to a comparable format (yyyy-mm-01)
            string startDate = $"{start}-01";
            string endDate = $"{end}-01";

            string[] monthNames = { "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC" };

            // Helper method to check if monthYear is within the specified range
            bool IsWithinRange(string monthYear)
            {
                // Convert monthYear to comparable format (mmm-yyyy to yyyy-mm-01)
                string[] parts = monthYear.Split('-');
                if (parts.Length != 2)
                    return false;

                string year = parts[1].Trim();
                string month = parts[0].Trim();

                // Convert month to a numeric format (1-based index)
                string numericMonth = (Array.IndexOf(monthNames, month) + 1).ToString();
                if (numericMonth.Length == 1)
                    numericMonth = "0" + numericMonth;

                string comparableFormat = $"{year}-{numericMonth}-01";

                // Perform comparison
                return comparableFormat.CompareTo(startDate) >= 0 && comparableFormat.CompareTo(endDate) <= 0;
            }

            // Filter allLaborInfos to only include entries that match the specified year range
            var filteredLaborInfos = allLaborInfos.Where(x => IsWithinRange(x.monthYear)).ToList();

            // Get the latest monthYear for each estate
            var latestMonthYearsForEachEstate = filteredLaborInfos
                .GroupBy(x => x.estateId)
                .Select(group => new
                {
                    EstateId = group.Key,
                    LatestMonthYear = group.OrderByDescending(x => GetMonthValue(x.monthYear)).Select(x => x.monthYear).FirstOrDefault()
                })
                .ToList();

            var workerForEachLaborType = new List<object>();

            // Iterate through each estate and get labor information for the latest monthYear
            foreach (var latestMonthYearForEstate in latestMonthYearsForEachEstate)
            {
                var labor = await _context.laborByCategories
                    .Where(x => x.LaborInfo.monthYear == latestMonthYearForEstate.LatestMonthYear && x.LaborInfo.estateId == latestMonthYearForEstate.EstateId)
                    .GroupBy(x => x.laborTypeId)
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

            // Group the result by estateId and laborTypeId and calculate sums
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
                            foreignNoOfWorkers = group.Sum(x => (int)x.GetType().GetProperty("foreignNoOfWorkers").GetValue(x, null)),
                            latestMonthYear = latestMonthYearsForEachEstate.FirstOrDefault(x => x.EstateId == group.Key.estateId)?.LatestMonthYear
                        })
                        .ToList();

            return groupedResult;
        }



        //LGMAdmin
        public async Task<object> GetTapperAndFieldWorker(int year)
        {
            // Fetch all laborInfos records into memory
            var allLaborInfos = await _context.laborInfos.ToListAsync();

            // Helper method to check if monthYear contains the specified year
            bool IsMatchingYear(string monthYear, int year)
            {
                return monthYear.Contains(year.ToString());
            }

            // Filter allLaborInfos to only include entries that match the specified year
            var filteredLaborInfos = allLaborInfos.Where(x => IsMatchingYear(x.monthYear, year)).ToList();

            // Fetch the necessary data for isLocal before the LINQ query
            var countryIsLocalMap = _context.countries.ToDictionary(y => y.Id, y => y.isLocal);

            var latestMonthYearsForEachEstate = filteredLaborInfos
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
                var worker = filteredLaborInfos
                    .Where(x => x.estateId == latestMonthYearForEstate.estateId
                             && x.monthYear == latestMonthYearForEstate.LatestMonthYear
                             && countryIsLocalMap.ContainsKey(x.countryId) && countryIsLocalMap[x.countryId] == latestMonthYearForEstate.IsLocal)
                    .Select(x => new
                    {
                        estateId = x.estateId,
                        isLocal = countryIsLocalMap[x.countryId],
                        tapperWorker = x.tapperCheckrole + x.tapperContractor,
                        fieldWorker = x.fieldCheckrole + x.fieldContractor,
                    })
                    .FirstOrDefault();

                workerForEachEstate.Add(worker);
            }

            // Group by isLocal and calculate totals
            var groupedData = workerForEachEstate
            .Where(x => x != null)
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

        public async Task<object> GetAllTapperAndFieldWorker(string start, string end)
        {
            // Convert start and end to a comparable format (yyyy-MM-01)
            string startDate = $"{start}-01";
            string endDate = $"{end}-01";

            // Fetch all laborInfos records into memory
            var allLaborInfos = await _context.laborInfos.ToListAsync();

            // Helper method to check if monthYear is within the specified range
            bool IsWithinRange(string monthYear)
            {
                string[] parts = monthYear.Split('-');
                if (parts.Length != 2)
                    return false;

                string year = parts[1].Trim();
                string month = parts[0].Trim();

                string[] monthNames = { "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC" };
                string numericMonth = (Array.IndexOf(monthNames, month) + 1).ToString().PadLeft(2, '0');

                string comparableFormat = $"{year}-{numericMonth}-01";

                return comparableFormat.CompareTo(startDate) >= 0 && comparableFormat.CompareTo(endDate) <= 0;
            }

            // Filter laborInfos by date range
            var filteredLaborInfos = allLaborInfos.Where(x => IsWithinRange(x.monthYear)).ToList();

            // Fetch country-local mapping
            var countryIsLocalMap = _context.countries.ToDictionary(y => y.Id, y => y.isLocal);

            // Find the latest monthYear for each estate and isLocal combination
            var latestMonthYears = filteredLaborInfos
                .GroupBy(x => new { x.estateId, IsLocal = countryIsLocalMap.ContainsKey(x.countryId) ? countryIsLocalMap[x.countryId] : false })
                .Select(group => new
                {
                    group.Key.estateId,
                    group.Key.IsLocal,
                    LatestMonthYear = group.OrderByDescending(x => GetMonthValue(x.monthYear)).Select(x => x.monthYear).FirstOrDefault()
                })
                .ToList();

            // Collect data for the latest month only
            var workerData = new List<object>();

            foreach (var latest in latestMonthYears)
            {
                var workers = filteredLaborInfos
                    .Where(x => x.estateId == latest.estateId
                             && x.monthYear == latest.LatestMonthYear
                             && countryIsLocalMap.ContainsKey(x.countryId) && countryIsLocalMap[x.countryId] == latest.IsLocal)
                    .GroupBy(x => x.estateId)
                    .Select(group => new
                    {
                        estateId = group.Key,
                        isLocal = latest.IsLocal,
                        tapperWorker = group.Sum(y => y.tapperCheckrole + y.tapperContractor),
                        fieldWorker = group.Sum(y => y.fieldCheckrole + y.fieldContractor)
                    })
                    .FirstOrDefault();

                if (workers != null)
                {
                    workerData.Add(workers);
                }
            }

            // Group by isLocal and aggregate totals
            var result = workerData
                .GroupBy(x => new { EstateId = x.GetType().GetProperty("estateId").GetValue(x, null), IsLocal = x.GetType().GetProperty("isLocal").GetValue(x, null) })
                .Select(group => new
                {
                    EstateId = group.Key.EstateId,
                    IsLocal = group.Key.IsLocal,
                    tapperWorker = group.Sum(x => (int)x.GetType().GetProperty("tapperWorker").GetValue(x, null)),
                    fieldWorker = group.Sum(x => (int)x.GetType().GetProperty("fieldWorker").GetValue(x, null))
                })
                .ToList();

            return result;
        }




        //LGMAdmin
        public async Task<object> GetWorkerShortageEstate(int year)
        {
            var allWorkerShortage = await _context.workerShortages.ToListAsync();

            // Filter by year
            var filteredWorkerShortage = allWorkerShortage
                .Where(x => x.monthYear.Contains(year.ToString()))
                .ToList();

            // Convert monthYear to a DateTime for proper ordering and grouping
            DateTime ParseMonthYear(string monthYear)
            {
                // Assuming monthYear is like 'MMM-yyyy', e.g. 'Jan-2025'
                return DateTime.ParseExact("01-" + monthYear, "dd-MMM-yyyy", System.Globalization.CultureInfo.InvariantCulture);
            }

            // Group by estateId and monthYear (to sum shortages per estate per month)
            var groupedByEstateAndMonth = filteredWorkerShortage
                .GroupBy(x => new { x.estateId, x.monthYear })
                .Select(g => new
                {
                    EstateId = g.Key.estateId,
                    MonthYear = g.Key.monthYear,
                    MonthDate = ParseMonthYear(g.Key.monthYear),
                    TapperShortage = g.Sum(x => x.tapperWorkerShortage),
                    FieldShortage = g.Sum(x => x.fieldWorkerShortage)
                });

            // Now get the latest month record for each estate
            var latestPerEstate = groupedByEstateAndMonth
                .GroupBy(x => x.EstateId)
                .Select(g => g.OrderByDescending(x => x.MonthDate).First())
                .ToList();

            // Calculate grand totals
            var grandTotalTapper = latestPerEstate.Sum(x => x.TapperShortage);
            var grandTotalField = latestPerEstate.Sum(x => x.FieldShortage);

            // Add grand totals to each record for output similar to your SQL
            var result = latestPerEstate.Select(x => new
            {
                estateId = x.EstateId,
                tapperShortage = x.TapperShortage,
                fieldShortage = x.FieldShortage,
                latestMonthYear = x.MonthYear,
                grandTotalTapper,
                grandTotalField
            }).ToList();

            return result;
        }


        public async Task<object> GetAllWorkerShortageEstate(string start, string end)
        {
            // Convert start and end to a comparable format (yyyy-mm-01)
            string startDate = $"{start}-01";
            string endDate = $"{end}-01";

            // Fetch all worker shortage records into memory
            var allWorkerShortage = await _context.workerShortages.ToListAsync();

            // Helper method to check if monthYear is within the specified range
            bool IsWithinRange(string monthYear)
            {
                // Convert monthYear to comparable format (mmm-yyyy to yyyy-mm-01)
                string[] parts = monthYear.Split('-');
                if (parts.Length != 2)
                    return false;

                string year = parts[1].Trim();
                string month = parts[0].Trim();

                // Convert month to a numeric format (1-based index)
                string[] monthNames = { "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC" };
                string numericMonth = (Array.IndexOf(monthNames, month) + 1).ToString();
                if (numericMonth.Length == 1)
                    numericMonth = "0" + numericMonth;

                string comparableFormat = $"{year}-{numericMonth}-01";

                // Perform comparison
                return comparableFormat.CompareTo(startDate) >= 0 && comparableFormat.CompareTo(endDate) <= 0;
            }

            // Filter allWorkerShortage to only include entries that match the specified year range
            var filteredWorkerShortage = allWorkerShortage.Where(x => IsWithinRange(x.monthYear)).ToList();

            // Group by estateId and select the latest record for each estate
            var latestWorkerShortageForEachEstate = filteredWorkerShortage
                .GroupBy(x => x.estateId)
                .Select(group => group
                    .OrderByDescending(x => GetMonthValue(x.monthYear))
                    .FirstOrDefault())
                .Select(x => new
                {
                    EstateId = x.estateId,
                    MonthYear = x.monthYear,
                    TapperShortage = x.tapperWorkerShortage,
                    FieldShortage = x.fieldWorkerShortage
                })
                .ToList();

            return latestWorkerShortageForEachEstate;
        }




        public async Task<object> GetCostInformation(int year)
        {
            string yearString = year.ToString();
            var cost = await _context.costAmounts.Where(x =>x.status == "SUBMITTED" && x.monthYear.Contains(yearString)).Select(x => new
            {
                amount = x.amount,
                costType = _context.costTypes.Where(y=>y.Id == (_context.costs.Where(z=>z.Id == x.costId).Select(z=>z.costTypeId).FirstOrDefault())).Select(y=>y.costType).FirstOrDefault(),
                isMature = _context.costs.Where(y=>y.Id == x.costId).Select(y=>y.isMature).FirstOrDefault(),
                costCategory = _context.costCategories.Where(y => y.Id == (_context.costs.Where(z => z.Id == x.costId).Select(z => z.costCategoryId).FirstOrDefault())).Select(y => y.costCategory).FirstOrDefault(),
                costSubcategories1 = _context.costSubcategories1.Where(y => y.Id == (_context.costs.Where(z => z.Id == x.costId).Select(z => z.costSubcategory1Id).FirstOrDefault())).Select(y => y.costSubcategory1).FirstOrDefault(),
                costSubcategories2 = _context.costSubcategories2.Where(y => y.Id == (_context.costs.Where(z => z.Id == x.costId).Select(z => z.costSubcategory2Id).FirstOrDefault())).Select(y => y.costSubcategory2).FirstOrDefault(),
                estateId = x.estateId,
                costId = x.costId,
                id= x.Id

            }).ToListAsync();
            return cost;
        }

        public async Task<object> GetAllRubberSale(string start, string end)
        {
            // Parse the start and end dates
            DateTime startDate = DateTime.ParseExact(start, "yyyy-MM", CultureInfo.InvariantCulture);
            DateTime endDate = DateTime.ParseExact(end + "-01", "yyyy-MM-dd", CultureInfo.InvariantCulture)
                                          .AddMonths(1).AddDays(-1);


            var sales = await _context.rubberSales.Where(x=>x.paymentStatusId == 3 && x.saleDateTime >= startDate && x.saleDateTime <= endDate || x.letterOfConsentNo == "" || x.isActive == false).Select(x => new DTO_RubberSale
            {
                id = x.Id,
                saleDateTime = x.saleDateTime,
                buyerName = _context.buyers.Where(y => y.Id == x.buyerId).Select(y => y.buyerName).FirstOrDefault(),
                rubberType = x.rubberType,
                letterOfConsentNo = x.letterOfConsentNo,
                receiptNo = x.receiptNo,
                wetWeight = x.wetWeight,
                buyerWetWeight = x.buyerWetWeight,
                DRC = x.DRC,
                buyerDRC = x.buyerDRC,
                unitPrice = x.unitPrice,
                total = x.total,
                weightSlipNo = x.weightSlipNo,
                isActive = x.isActive,
                buyerId = x.buyerId ?? 0,
                buyerLicenseNo = _context.buyers.Where(y => y.Id == x.buyerId).Select(y => y.licenseNo).FirstOrDefault(),
                paymentStatusId = x.paymentStatusId,
                paymentStatus = _context.paymentStatuses.Where(y => y.id == x.paymentStatusId).Select(y => y.status).FirstOrDefault(),
                estateId = x.estateId,
                transportPlateNo = x.transportPlateNo,
                driverName = x.driverName,
                driverIc = x.driverIc,
                remark = x.remark,
                deliveryAgent = x.deliveryAgent,
            }).OrderBy(x => x.saleDateTime).ToListAsync();
            return sales;
        }

        public async Task<object> GetAllCostInformation(string start, string end)
        {
            // Convert start and end to DateTime objects for accurate comparison
            if (!DateTime.TryParseExact($"{start}-01", "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime startDate) ||
                !DateTime.TryParseExact($"{end}-01", "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime endDate))
            {
                throw new ArgumentException("Invalid date format for start or end.");
            }

            // Helper method to check if monthYear is within the specified range
            bool IsWithinRange(string monthYear)
            {
                if (!DateTime.TryParseExact(monthYear, "MMM-yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime monthDate))
                {
                    return false; // Invalid format
                }

                // Check if monthDate is within startDate and endDate
                return startDate <= monthDate && monthDate <= endDate;
            }

            var allCostAmount = await _context.costAmounts
                .Where(x => x.status == "SUBMITTED")
                .ToListAsync();

            var allCost = allCostAmount
                .Where(x => IsWithinRange(x.monthYear))
                .Select(x => new
                {
                    id = x.Id,
                    amount = x.amount,
                    costType = _context.costTypes.Where(y => y.Id == (_context.costs.Where(z => z.Id == x.costId).Select(z => z.costTypeId).FirstOrDefault())).Select(y => y.costType).FirstOrDefault(),
                    isMature = _context.costs.Where(y => y.Id == x.costId).Select(y => y.isMature).FirstOrDefault(),
                    costCategory = _context.costCategories.Where(y => y.Id == (_context.costs.Where(z => z.Id == x.costId).Select(z => z.costCategoryId).FirstOrDefault())).Select(y => y.costCategory).FirstOrDefault(),
                    costSubcategories1 = _context.costSubcategories1.Where(y => y.Id == (_context.costs.Where(z => z.Id == x.costId).Select(z => z.costSubcategory1Id).FirstOrDefault())).Select(y => y.costSubcategory1).FirstOrDefault(),
                    costSubcategories2 = _context.costSubcategories2.Where(y => y.Id == (_context.costs.Where(z => z.Id == x.costId).Select(z => z.costSubcategory2Id).FirstOrDefault())).Select(y => y.costSubcategory2).FirstOrDefault(),
                    estateId = x.estateId,
                    costId = x.costId
                })
                .ToList();

            /*var groupedCosts = allCost
                .GroupBy(x => x.costId)
                .Select(g => new
                {
                    costId = g.Key,
                    amount = g.Sum(x => x.amount),
                    costType = _context.costTypes
                        .Where(y => y.Id == (_context.costs.Where(z => z.Id == g.Key).Select(z => z.costTypeId).FirstOrDefault()))
                        .Select(y => y.costType)
                        .FirstOrDefault(),
                    isMature = _context.costs
                        .Where(y => y.Id == g.Key)
                        .Select(y => y.isMature)
                        .FirstOrDefault(),
                    costCategory = _context.costCategories
                        .Where(y => y.Id == (_context.costs.Where(z => z.Id == g.Key).Select(z => z.costCategoryId).FirstOrDefault()))
                        .Select(y => y.costCategory)
                        .FirstOrDefault(),
                    costSubcategories1 = _context.costSubcategories1
                        .Where(y => y.Id == (_context.costs.Where(z => z.Id == g.Key).Select(z => z.costSubcategory1Id).FirstOrDefault()))
                        .Select(y => y.costSubcategory1)
                        .FirstOrDefault(),
                    costSubcategories2 = _context.costSubcategories2
                        .Where(y => y.Id == (_context.costs.Where(z => z.Id == g.Key).Select(z => z.costSubcategory2Id).FirstOrDefault()))
                        .Select(y => y.costSubcategory2)
                        .FirstOrDefault(),
                    estateId = g.FirstOrDefault().estateId // Assuming estateId is the same for all entries with the same costId
                })
                .ToList();*/

            return allCost;
        }


    }
}
