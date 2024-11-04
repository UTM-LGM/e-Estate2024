using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace E_EstateV2_API.Controllers
{
    [AllowAnonymous]
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AnnouncementsController : ControllerBase
    {
        private readonly IAnnouncementRepository _announcementRepository;

        public AnnouncementsController(IAnnouncementRepository announcementRepository)
        {
            _announcementRepository = announcementRepository;
        }

        [HttpPost]
        public async Task<IActionResult> AddAnnouncement([FromForm] Announcement announcement,[FromForm] IFormFile file)
        {
            var addedAnnouncement = await _announcementRepository.AddAnnouncement(announcement, file);
            return Ok(addedAnnouncement);
        }

        [HttpGet]
        public async Task<IActionResult> GetAnnouncements()
        {
            var announcements = await _announcementRepository.GetAnnouncements();
            return Ok(announcements);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateAnnouncement([FromBody] Announcement announcement)
        {
            var updatedAnnouncement = await _announcementRepository.UpdateAnnouncement(announcement);
            return Ok(updatedAnnouncement);
        }
    }
}
