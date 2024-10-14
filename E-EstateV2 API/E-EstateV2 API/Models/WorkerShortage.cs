using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace E_EstateV2_API.Models
{
    public class WorkerShortage
    {
        [Key]
        public int Id { get; set; }
        public string monthYear { get; set; }
        public int tapperWorkerShortage { get; set; }
        public int fieldWorkerShortage { get; set; }
        public string createdBy { get; set; }
        public DateTime createdDate { get; set; }
        public string updatedBy { get; set; }
        public DateTime updatedDate { get; set; }

        public int estateId { get; set; }


    }
}
