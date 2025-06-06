using E_EstateV2_API.Models;

namespace E_EstateV2_API.ViewModel
{
    public class DTO_Estate
    {
        public int id { get; set; }
        public string estateName { get; set; }
        public string address1 { get; set; }
        public string address2 { get; set; }
        public string address3 { get; set; }
        public string postcode { get; set; }
        public string phone { get; set; }

        public string fax { get; set; }
        public string latitudeLongitude { get; set; }


        public string email { get; set; }
        public string licenseNo { get; set; }
        public string totalArea { get; set; }
        public string managerName { get; set; }
        public int companyId { get; set; }
        public string companyName { get; set; }

        public string town { get; set; }
        public bool isActive { get; set; }
        public int establishmentId { get; set; }
        public string establishment { get; set; }
        public int financialYearId { get; set; }
        public string financialYear { get; set; }
        public int membershipTypeId { get; set; }
        public int townId { get; set; }
        public string town1 { get; set; }
        public string membership { get; set; }
        public string state { get; set; }
        public int stateId { get; set; }
        //public string plantingMaterial { get; set; }
        public string grantNo { get; set; }
        public int plantingMaterialId { get; set; }

        public List<PlantingMaterial> plantingMaterial { get; set; }

        public List<DTO_Field> fields { get; set; }
        public List<DTO_Town> towns { get; set; }
        public List<DTO_FinancialYear> financialYears { get; set;}
        public List<DTO_Establishment> establishments { get; set;}
        

    }
}
