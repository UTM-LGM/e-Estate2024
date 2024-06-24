using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace E_EstateV2_API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class EstateContactsController : ControllerBase
    {
        private readonly IGenericRepository<EstateContact> _genericRepository;

        public EstateContactsController(IGenericRepository<EstateContact> genericRepository)
        {
            _genericRepository = genericRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetEstateContact()
        {
            var contacts = await _genericRepository.GetAll();
            var sortedContacts = contacts.OrderByDescending(contact => contact.isActive).ToList();
            return Ok(sortedContacts);
        }

        [HttpPost]
        public async Task<IActionResult> AddEstateContact([FromBody] EstateContact contact)
        {
            contact.createdDate = DateTime.Now;
            var addedEstateContact = await _genericRepository.Add(contact);
            return Ok(addedEstateContact);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateEstateContact([FromBody] EstateContact contact)
        {
            contact.updatedDate = DateTime.Now;
            var updatedEstateContact = await _genericRepository.Update(contact);
            return Ok(updatedEstateContact);
        }

    }


}
