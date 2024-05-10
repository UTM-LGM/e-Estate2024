using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace E_EstateV2_API.Models
{
    public partial class OtherCrop
    {
        [Key]
        public int Id { get; set; }
        public string otherCrop { get; set; }
        public bool isActive { get; set; }
        public string createdBy { get; set; }
        public DateTime createdDate { get; set; }
        public string updatedBy { get; set; }
        public DateTime updatedDate { get; set; }
    }
}
