namespace E_EstateV2_API.DTO
{
    public class SaleTransactionDto
    {
        public DateTime TransactionDate { get; set; }
    }

    public class SaleTransactionResponse
    {
        public int TransactionCount { get; set; }
        public List<SaleTransactionDto> Transactions { get; set; }
    }
}
