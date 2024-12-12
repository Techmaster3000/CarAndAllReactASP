using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CarAndAllReactASP.Server.Migrations
{
    /// <inheritdoc />
    public partial class fixVehicle : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Voeg de ontbrekende kolom "Opmerkingen" toe
            migrationBuilder.AddColumn<string>(
                name: "Opmerkingen",
                table: "Vehicles",
                type: "nvarchar(max)",
                nullable: true);

            // Voeg de ontbrekende kolom "PrijsPerDag" toe
            migrationBuilder.AddColumn<double>(
                name: "PrijsPerDag",
                table: "Vehicles",
                type: "float",
                nullable: false,
                defaultValue: 0.0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Verwijder de kolom "Opmerkingen" bij een rollback
            migrationBuilder.DropColumn(
                name: "Opmerkingen",
                table: "Vehicles");

            // Verwijder de kolom "PrijsPerDag" bij een rollback
            migrationBuilder.DropColumn(
                name: "PrijsPerDag",
                table: "Vehicles");
        }
    }
}
