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
        public async Task<object> GetCurrentProduction()
        {
            int year = DateTime.Now.Year;

            var fieldProduction = await _context.fieldProductions.Where(x => x.status == "Submitted" && x.monthYear.Contains(year.ToString())).Select(x => new
            {
                estateId = _context.fields.Where(y => y.Id == x.fieldId).Select(y => y.estateId).FirstOrDefault(),
                cuplumpDry = x.cuplump * (x.cuplumpDRC / 100),
                latexDry = x.latex * (x.latexDRC / 100),
            }).ToListAsync();

            var groupdFieldProduction = fieldProduction
                .GroupBy(x => x.estateId)
                 .Select(group => new
                 {
                     estateId = group.First().estateId,
                     cuplumpDry = group.Sum(x => x.cuplumpDry),
                     latexDry = group.Sum(x => x.latexDry),
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
            var fieldProduction = _context.fieldProductions.Where(x => x.status == "Submitted" && x.monthYear.Contains(year.ToString()))
                .Join(_context.fields, prod => prod.fieldId, field => field.Id, (prod, field) => new
                {
                    prod.monthYear,
                    cuplumpDry = prod.cuplump * (prod.cuplumpDRC / 100),
                    latexDry = prod.latex * (prod.latexDRC / 100),
                    field.estateId
                }).GroupBy(x => new { x.monthYear, x.estateId })
                .Select(x => new DTO_FieldProduction
                {
                    monthYear = x.Key.monthYear,
                    cuplumpDry = x.Sum(x => x.cuplumpDry),
                    latexDry = x.Sum(x => x.latexDry),
                    estateId = x.Key.estateId
                })
                //CultureInfo to ensures that the parsing is done using a culture-independent format
                .ToList() // Switch to client-side evaluation
                .OrderBy(x => DateTime.ParseExact(x.monthYear, "MMM-yyyy", CultureInfo.InvariantCulture))
                .ToList();
            return fieldProduction;
        }

        //EstateClerk
        public async Task<object> GetStateFieldArea(string start, string end)
        {
            // Parse the start and end dates
            DateTime startDate = DateTime.ParseExact(start, "yyyy-MM", CultureInfo.InvariantCulture);
            DateTime endDate = DateTime.ParseExact(end + "-01", "yyyy-MM-dd", CultureInfo.InvariantCulture)
                                          .AddMonths(1).AddDays(-1);

            // Create the range filters
            var excludedStatuses = new[] { "abandoned", "government" };

            // Filter fields based on isActive, date range, and other criteria
            var field = await _context.fields
                .Where(x => x.isActive && x.createdDate >= startDate && x.createdDate <= endDate)
                .Select(x => new
                {
                    fieldId = x.Id,
                    area = x.rubberArea,
                    isMature = x.isMature,
                    estateId = x.estateId,
                    isActive = x.isActive,
                    fieldStatus = _context.fieldStatus.Where(y => y.Id == x.fieldStatusId).Select(y => y.fieldStatus).FirstOrDefault(),
                    createdDate = x.createdDate
                })
                .ToListAsync();

            return field;
        }

        public async Task<object> GetFieldArea(int year)
        {
            var excludedStatuses = new[] { "abandoned", "government" };
            var field = await _context.fields.Where(x => x.isActive == true && x.createdDate.Year == year).Select(x => new
            {
                fieldId = x.Id,
                area = x.area,
                isMature = x.isMature,
                estateId = x.estateId,
                isActive = x.isActive,
                fieldStatus = _context.fieldStatus.Where(y => y.Id == x.fieldStatusId).Select(y => y.fieldStatus).FirstOrDefault()
            }).ToListAsync();

            return field;
        }



        public async Task<object> GetProductionYearlyByClone(int year)
        {
            var fieldProduction = await _context.fieldProductions.Where(x => x.status == "Submitted" && x.monthYear.Contains(year.ToString())).Select(x => new
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
            var fieldClone = await _context.fieldClones.Where(x => x.createdDate >= startDate && x.createdDate <= endDate).Select(x => new
            {
                fieldId = x.fieldId,
                cloneId = x.cloneId,
                cloneName = _context.clones.Where(y => y.Id == x.cloneId).Select(y => y.cloneName).FirstOrDefault(),
                area = _context.fields.Where(y => y.Id == x.fieldId && y.isActive == true).Select(y => y.rubberArea).FirstOrDefault(),
            }).ToListAsync();

            // Group by fieldId and create a list of cloneId for each fieldId
            var groupedResult = fieldClone
                .GroupBy(x => new { x.fieldId, x.area })
                .Select(g => new
                {
                    fieldId = g.Key.fieldId,
                    area = g.Key.area,
                    cloneNames = g.Select(x => x.cloneName).ToList()
                }).ToList();

            return groupedResult;
        }

        public async Task<object> GetCurrentField(int year)
        {
            var field = await _context.fields.Where(x => x.createdDate.Year == year).Select(x => new
            {
                id = x.Id,
                fieldName = x.fieldName,
                area = x.rubberArea,
                isMature = x.isMature,
                isActive = x.isActive,
                dateOpenTapping = x.dateOpenTapping,
                yearPlanted = x.yearPlanted,
                fieldStatus = _context.fieldStatus.Where(y => y.Id == x.fieldStatusId).Select(y => y.fieldStatus).FirstOrDefault(),
                initialTreeStand = x.initialTreeStand,
                totalTask = x.totalTask,
                estateId = x.estateId,
            }).ToListAsync();
            return field;
        }


        public async Task<object> GetProductivityYearlyByClone(int year)
        {

            var fieldProduction = await _context.fieldProductions.Where(x => x.status == "Submitted" && x.monthYear.Contains(year.ToString())).Select(x => new
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


            var allProduction = await _context.fieldProductions.ToListAsync();
            var filteredProduction = allProduction.Where(x => IsWithinRange(x.monthYear) && x.status == "Submitted").ToList();

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
                            foreignNoOfWorkers = group.Sum(x => (int)x.GetType().GetProperty("foreignNoOfWorkers").GetValue(x, null))
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
            // Convert start and end to a comparable format (yyyy-mm-01)
            string startDate = $"{start}-01";
            string endDate = $"{end}-01";

            // Fetch all laborInfos records into memory
            var allLaborInfos = await _context.laborInfos.ToListAsync();

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

            // Filter allLaborInfos to only include entries that match the specified year range
            var filteredLaborInfos = allLaborInfos.Where(x => IsWithinRange(x.monthYear)).ToList();

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



        //LGMAdmin
        public async Task<object> GetWorkerShortageEstate(int year)
        {
            // Fetch all worker shortage records into memory
            var allWorkerShortage = await _context.workerShortages.ToListAsync();

            // Helper method to check if monthYear contains the specified year
            bool IsMatchingYear(string monthYear, int year)
            {
                return monthYear.Contains(year.ToString());
            }

            // Filter allWorkerShortage to only include entries that match the specified year
            var filteredWorkerShortage = allWorkerShortage.Where(x => IsMatchingYear(x.monthYear, year)).ToList();

            var latestWorkerShortageForEachEstate = filteredWorkerShortage
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

            // Find the latest month within the specified range
            var latestMonthShortage = filteredWorkerShortage
                .OrderByDescending(x => GetMonthValue(x.monthYear)) // Order by month value descending to get the latest
                .FirstOrDefault();

            // Prepare the result object based on the latest worker shortage found
            var workerShortageData = latestMonthShortage != null ? new List<object>
                {
                    new
                    {
                        EstateId = latestMonthShortage.estateId,
                        MonthYear = latestMonthShortage.monthYear,
                        TapperShortage = latestMonthShortage.tapperWorkerShortage,
                        FieldShortage = latestMonthShortage.fieldWorkerShortage
                    }
                } : new List<object>();

            return workerShortageData;
        }


        public async Task<object> GetCostInformation(int year)
        {
            string yearString = year.ToString();
            var cost = await _context.costAmounts.Where(x =>x.status == "Submitted" && x.monthYear.Contains(yearString)).Select(x => new
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

        public async Task<object> GetAllRubberSale(string start, string end)
        {
            // Parse the start and end dates
            DateTime startDate = DateTime.ParseExact(start, "yyyy-MM", CultureInfo.InvariantCulture);
            DateTime endDate = DateTime.ParseExact(end + "-01", "yyyy-MM-dd", CultureInfo.InvariantCulture)
                                          .AddMonths(1).AddDays(-1);

            var sales = await _context.rubberSales.Where(x=>x.paymentStatusId == 3 && x.saleDateTime >= startDate && x.saleDateTime <= endDate).Select(x => new DTO_RubberSale
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
                buyerId = x.buyerId,
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
                .Where(x => x.status == "Submitted")
                .ToListAsync();

            var allCost = allCostAmount
                .Where(x => IsWithinRange(x.monthYear))
                .ToList();

            var groupedCosts = allCost
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
                .ToList();

            return groupedCosts;
        }


    }
}
