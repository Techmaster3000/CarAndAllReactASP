using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CarAndAllReactASP.Server.Migrations
{
    /// <inheritdoc />
    public partial class carretrieve1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Opmerkingen",
                table: "Vehicles",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Opmerkingen",
                table: "Vehicles");
        }
    }
}
