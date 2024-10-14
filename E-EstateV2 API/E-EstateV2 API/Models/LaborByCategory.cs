using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace E_EstateV2_API.Models
{
    public class LaborByCategory
    {
        [Key]
        public int Id { get; set; }
        public int noOfWorker { get; set; }
        public string createdBy { get; set; }
        public DateTime createdDate { get; set; }
        public string updatedBy { get; set; }
        public DateTime updatedDate { get; set; }

        [ForeignKey("LaborInfoId")]
        public int laborInfoId { get; set; }
        public LaborInfo LaborInfo { get; set; }

        [ForeignKey("LaborTypeId")]
        public int laborTypeId { get; set; }
        public LaborType LaborType { get; set; }
       
    }
}
