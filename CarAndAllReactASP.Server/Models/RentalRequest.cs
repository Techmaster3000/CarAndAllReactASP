public class RentalRequest
{
    public int Id { get; set; }
    public string CustomerName { get; set; }
    public string RentalItem { get; set; }
    public DateTime RentalDate { get; set; }
    public string Status { get; set; } // "Pending", "Approved", "Rejected"
    public string RejectionReason { get; set; }
}