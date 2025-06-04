using E_EstateV2_API.Data;
using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using Microsoft.AspNetCore.Mvc;

namespace E_EstateV2_API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class EstateContactsController : ControllerBase
    {
        private readonly IGenericRepository<EstateContact> _genericRepository;
        private readonly ApplicationDbContext _context;
        private readonly IEstateContactHistoryRepository _estateHistoryRepository;

        public EstateContactsController(IGenericRepository<EstateContact> genericRepository, ApplicationDbContext context, IEstateContactHistoryRepository historyRepository)
        {
            _genericRepository = genericRepository;
            _context = context;
            _estateHistoryRepository = historyRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetEstateContact()
        {
            var contacts = await _genericRepository.GetAll();
            var sortedContacts = contacts.OrderByDescending(contact => contact.isActive).ToList();
            return Ok(sortedContacts);
        }

        [HttpGet]
        [Route("{estateId:int}")]
        public async Task<IActionResult> GetEstateContactByEstateId([FromRoute] int estateId)
        {
            var contacts = await _genericRepository.GetAll();
            var sortedContact = contacts.Where(x => x.estateId == estateId)
                .OrderByDescending(x => x.isActive).ToList();
            return Ok(sortedContact);
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
            try
            {
                contact.updatedDate = DateTime.Now;

                // Retrieve the existing EstateContact entity
                var existingContact = await _context.estateContacts.FindAsync(contact.Id);
                if (existingContact != null)
                {
                    // Create an EstateContactHistory record from the existing entity
                    var estateContactHistory = new EstateContactHistory
                    {
                        estateContactId = existingContact.Id,
                        name = existingContact.name,
                        position = existingContact.position,
                        phoneNo = existingContact.phoneNo,
                        email = existingContact.email,
                        isActive = existingContact.isActive,
                        createdBy = existingContact.createdBy,
                        createdDate = existingContact.createdDate,
                        updatedBy = existingContact.updatedBy,
                        updatedDate = existingContact.updatedDate,
                        estateId = existingContact.estateId
                    };

                    // Add the EstateContactHistory record to the database
                    await _estateHistoryRepository.AddEstateContactHistory(estateContactHistory);

                    // Update the existing EstateContact entity with the new data
                    _context.Entry(existingContact).CurrentValues.SetValues(contact);
                    existingContact.updatedDate = DateTime.Now;

                    // Save the changes to the database
                    await _context.SaveChangesAsync();

                    return Ok(existingContact);
                }
                else
                {
                    return NotFound();
                }}
                catch (Exception ex)
                {
                    // Handle exception as per your application's error handling strategy
                    return StatusCode(StatusCodes.Status500InternalServerError, "Error updating estate contact");
                }
        }


    }


}
