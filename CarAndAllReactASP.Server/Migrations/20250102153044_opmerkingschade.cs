using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CarAndAllReactASP.Server.Migrations
{
    /// <inheritdoc />
    public partial class opmerkingschade : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Schadeclaims");

            migrationBuilder.AddColumn<string>(
                name: "ReparatieOpmerkingen",
                table: "Schades",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "Schades",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ReparatieOpmerkingen",
                table: "Schades");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Schades");

            migrationBuilder.CreateTable(
                name: "Schadeclaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SchadeId = table.Column<int>(type: "int", nullable: false),
                    VehicleId = table.Column<int>(type: "int", nullable: false),
                    Beschrijving = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Datum = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FotoUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Schadeclaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Schadeclaims_Schades_SchadeId",
                        column: x => x.SchadeId,
                        principalTable: "Schades",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Schadeclaims_Vehicles_VehicleId",
                        column: x => x.VehicleId,
                        principalTable: "Vehicles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Schadeclaims_SchadeId",
                table: "Schadeclaims",
                column: "SchadeId");

            migrationBuilder.CreateIndex(
                name: "IX_Schadeclaims_VehicleId",
                table: "Schadeclaims",
                column: "VehicleId");
        }
    }
}
