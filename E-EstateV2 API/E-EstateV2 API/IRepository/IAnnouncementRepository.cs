using E_EstateV2_API.Models;

namespace E_EstateV2_API.IRepository
{
    public interface IAnnouncementRepository
    {
        Task<Announcement> AddAnnouncement(Announcement announcement, IFormFile file);
        Task<List<Announcement>> GetAnnouncements();
        Task<Announcement> UpdateAnnouncement(Announcement announcement);
    }
}
