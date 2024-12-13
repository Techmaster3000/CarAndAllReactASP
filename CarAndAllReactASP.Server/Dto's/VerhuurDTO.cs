namespace CarAndAllReactASP.Server.Dto_s
{
    public class VerhuurDTO
    {
        public int VerhuurID { get; set; }
        public string Status { get; set; }
        public VoertuigDTO Voertuig { get; set; }
        public UserDTO User { get; set; }
    }
}
