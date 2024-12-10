using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CarAndAllReactASP.Server.Migrations
{
    /// <inheritdoc />
    public partial class extraCarparameters : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "TotaalPrijs",
                table: "ParticuliereVerhuur",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<string>(
                name: "VoertuigNaam",
                table: "ParticuliereVerhuur",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TotaalPrijs",
                table: "ParticuliereVerhuur");

            migrationBuilder.DropColumn(
                name: "VoertuigNaam",
                table: "ParticuliereVerhuur");
        }
    }
}
