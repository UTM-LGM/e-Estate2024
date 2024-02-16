namespace E_EstateV2_API.ViewModel
{
    public class DTO_Cost
    {
        public int id { get; set; }
        public bool? isMature { get; set; }
        public bool isActive { get; set; }
        public string costTypes { get; set; }
        public string costCategory { get; set; }
        public string costSubcategory1 { get; set; }
        public string costSubcategory2 { get; set; }
        public int costSubcategory2Id { get; set; }
        public int costSubcategory1Id { get; set; }

        public int costCategoryId { get; set; }



    }
}
