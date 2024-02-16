namespace E_EstateV2_API.ViewModel
{
    public class DTO_ForeignLabor
    {
        public int id { get; set; }
        public string monthYear { get; set; }
        public int tapperCheckrole { get; set; }
        public int tapperContractor { get; set; }
        public int fieldCheckrole { get; set; }
        public int fieldContractor { get; set; }
        public int workerNeeded { get; set; }
        public int estateId { get; set; }
        public string countryName { get; set; }
        public bool isLocal { get; set; }
        public int totalLaborWorker { get; set; }


        public int countryId { get; set; }

    }
}
