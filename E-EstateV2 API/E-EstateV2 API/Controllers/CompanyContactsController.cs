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

        public CompanyContactsController(IGenericRepository<CompanyContact> genericRepository)
        {
            _genericRepository = genericRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetCompanyContact()
        {
            var contacts = await _genericRepository.GetAll();
            return Ok(contacts);
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
            var updatedCompanyContact = await _genericRepository.Update(contact);
            return Ok(updatedCompanyContact);
        }

    }
}
