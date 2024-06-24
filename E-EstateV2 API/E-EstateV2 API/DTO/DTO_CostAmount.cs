namespace E_EstateV2_API.ViewModel
{
    public class DTO_CostAmount
    {
        public int id { get; set; }

        public decimal amount { get; set; }
        public string monthYear { get; set; }
        public string status { get; set; }
        public int estateId { get; set; }
        public int costId { get; set; }
        public int costSubcategory1Id { get; set; }
        public string costSubcategory1 { get; set; }
        public string costSubcategory2 { get; set; }

        public bool? isMature { get; set; }
        public string costType { get; set; }
        public int costTypeId { get; set; }

    }
}
