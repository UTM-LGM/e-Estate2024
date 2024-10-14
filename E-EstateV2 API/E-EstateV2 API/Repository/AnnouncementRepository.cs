using E_EstateV2_API.Data;
using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using Microsoft.EntityFrameworkCore;

namespace E_EstateV2_API.Repository
{
    public class AnnouncementRepository:IAnnouncementRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly string _wwwrootPath;

        public AnnouncementRepository(ApplicationDbContext context, IWebHostEnvironment webHostEnvironment)
        {
            _context = context;
            _wwwrootPath = Path.Combine(webHostEnvironment.WebRootPath, "api/Images");
        }

        public async Task<Announcement> AddAnnouncement(Announcement announcement, IFormFile file)
        {
            announcement.createdDate = DateTime.Now;
            if (file != null && file.Length > 0)
            {
                // Ensure the Images folder exists
                Directory.CreateDirectory(_wwwrootPath);

                // Generate a unique filename based on announcement.tittle and the original file extension
                var fileExtension = Path.GetExtension(file.FileName);
                var fileName = $"{announcement.tittle}{fileExtension}";

                // Combine the path and filename
                var filePath = Path.Combine(_wwwrootPath, fileName);

                // Save the file to the server
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Set the file path in the announcement object
                announcement.filePath = fileName;
            }

            await _context.announcements.AddAsync(announcement);
            await _context.SaveChangesAsync();
            return announcement;
        }
        
        public async Task<List<Announcement>> GetAnnouncements()
        {
            var announcements = await _context.announcements.OrderBy(a => a.hierarchy).ToListAsync();
            return announcements;
        }

        public async Task<Announcement> UpdateAnnouncement(Announcement announcement)
        {
            var existingAnnouncement = await _context.announcements.FirstOrDefaultAsync(x => x.Id == announcement.Id );
            if( existingAnnouncement != null )
            {
                existingAnnouncement.isActive = announcement.isActive;
                existingAnnouncement.updatedDate = DateTime.Now;
                existingAnnouncement.updatedBy = announcement.updatedBy;
                existingAnnouncement.tittle = announcement.tittle;
                existingAnnouncement.hierarchy = announcement.hierarchy;
                await _context.SaveChangesAsync();
                return existingAnnouncement;
            }
            return null;
        }
    }
}
