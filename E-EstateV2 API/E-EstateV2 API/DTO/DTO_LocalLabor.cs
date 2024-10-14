namespace E_EstateV2_API.ViewModel
{
    public class DTO_LocalLabor
    {
        public int id {  get; set; }
        public int laborTypeId { get; set; }
        public string laborTypeName { get; set; }
        public string monthYear { get; set; }
        public int totalWorker { get; set; }
        public int estateId { get; set; }
        public int totalLaborWorker { get; set; }

        public string laborType { get; set; }
       
    }
}
