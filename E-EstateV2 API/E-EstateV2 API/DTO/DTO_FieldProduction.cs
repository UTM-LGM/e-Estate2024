namespace E_EstateV2_API.ViewModel
{
    public class DTO_FieldProduction
    {
        public int id { get; set; }
        public string monthYear { get; set; }
        public float cuplump { get; set; }
        public float cuplumpDRC { get; set; }
        public float cuplumpDry { get; set; }

        public float latex { get; set; }
        public float latexDRC { get; set; }
        public float latexDry { get; set; }

        public float uss { get; set; }
        public float ussDRC { get; set; }
        public float ussDry { get; set; }

        public float others { get; set; }
        public float othersDRC { get; set; }

        public float othersDry { get; set; }

        public int noTaskTap { get; set; }
        public int noTaskUntap { get; set; }
        public int fieldId { get; set; }
        public string remarkUntap { get; set; }
        public int estateId { get; set; }
        public string fieldName { get; set; }
        public int totalTask { get; set; }
        public List<DTO_Clone> cloneInfo { get; set; }
    }
}
