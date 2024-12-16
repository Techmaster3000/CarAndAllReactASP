using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CarAndAllReactASP.Server.Migrations
{
    /// <inheritdoc />
    public partial class Verhuur2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "RedenAfwijzing",
                table: "ParticuliereVerhuur",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "VerhuurOpmerkingen",
                table: "ParticuliereVerhuur",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RedenAfwijzing",
                table: "ParticuliereVerhuur");

            migrationBuilder.DropColumn(
                name: "VerhuurOpmerkingen",
                table: "ParticuliereVerhuur");
        }
    }
}
