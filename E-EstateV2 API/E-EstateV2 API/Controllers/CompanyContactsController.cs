using E_EstateV2_API.Data;
using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace E_EstateV2_API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class CompanyContactsController : ControllerBase
    {
        private readonly IGenericRepository<CompanyContact> _genericRepository;
        private readonly ApplicationDbContext _context;
        private readonly ICompanyContactHistoryRepository _companyContactHistoryRepository;

        public CompanyContactsController(IGenericRepository<CompanyContact> genericRepository, ApplicationDbContext context, ICompanyContactHistoryRepository historyRepository)
        {
            _genericRepository = genericRepository;
            _context = context;
            _companyContactHistoryRepository = historyRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetCompanyContact()
        {
            var contacts = await _genericRepository.GetAll();
            var sortedContacts = contacts.OrderByDescending(contact => contact.isActive).ToList();
            return Ok(sortedContacts);
        }

        [HttpPost]
        public async Task<IActionResult> AddCompanyContact([FromBody] CompanyContact contact)
        {
            contact.createdDate = DateTime.Now;
            var addedCompanyContact = await _genericRepository.Add(contact);
            return Ok(addedCompanyContact);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateCompanyContact([FromBody] CompanyContact contact)
        {
            contact.updatedDate = DateTime.Now;

            var existingContact = await _context.companyContacts.FindAsync(contact.Id);
            if (existingContact != null)
            {
                var companyContactHistory = new CompanyContactHistory
                {
                    companyContactId = existingContact.Id,
                    name = existingContact.name,
                    position = existingContact.position,
                    phoneNo = existingContact.phoneNo,
                    email = existingContact.email,
                    isActive = existingContact.isActive,
                    createdBy = existingContact.createdBy,
                    createdDate = existingContact.createdDate,
                    updatedBy = existingContact.updatedBy,
                    updatedDate = existingContact.updatedDate,
                    companyId = existingContact.companyId
                };

                await _companyContactHistoryRepository.AddCompanyContactHistory(companyContactHistory);

                _context.Entry(existingContact).CurrentValues.SetValues(contact);
                existingContact.updatedDate = DateTime.Now;

                await _context.SaveChangesAsync();

                return Ok(existingContact);
            }
            else
            {
                return NotFound();
            }
        }
    }
}
