namespace E_EstateV2_API.DTO
{
    public class DTO_LaborByCategory
    {
        public int id { get; set; }
        public int noOfWorker { get; set; }
        public int laborInfoId { get; set; }
        public int laborTypeId { get; set; }
        public string laborType { get; set; }
        public int estateId { get; set; }

    }
}
