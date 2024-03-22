using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace E_EstateV2_API.Models
{
    public class Estate
    {
        [Key]
        public int Id { get; set; }
        public string estateName { get; set; }
        public string address1 { get; set; }
        public string address2 { get; set; }
        public string address3 { get; set; }
        public string postcode { get; set; }
        public string phone { get; set; }
        public string fax { get; set; }
        public string email { get; set; }
        public string licenseNo { get; set; }
        public string totalArea { get; set; }
        public bool isActive { get; set; }
        public string managerName { get; set; }
        public string latitudeLongitude { get; set; }
        public string grantNo { get; set; }
        public string createdBy { get; set; }
        public DateTime createdDate { get; set; }
        public string updatedBy { get; set; }
        public DateTime updatedDate { get; set; }

        [ForeignKey("CompanyId")]
        public int companyId { get; set; }
        public Company Company { get; set; }

        [ForeignKey("TownId")]
        public int townId { get; set; }
        public Town Town { get; set; }

        [ForeignKey("EstablshmentId")]
        public int establishmentId { get; set; }
        public Establishment Establishment { get; set; }

        [ForeignKey("FinancialYearId")]
        public int financialYearId { get; set; }
        public FinancialYear FinancialYear { get; set; }

        [ForeignKey("MembershipTypeId")]
        public int membershipTypeId { get; set; }
        public MembershipType MembershipType { get; set; }

        [ForeignKey("PlantingMaterialId")]
        public int plantingMaterialId { get; set; }
        public PlantingMaterial PlantingMaterial { get; set; }
    }
}
