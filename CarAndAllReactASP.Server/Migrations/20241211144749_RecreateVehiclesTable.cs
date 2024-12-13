using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CarAndAllReactASP.Server.Migrations
{
    /// <inheritdoc />
    public partial class RecreateVehiclesTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Opmerk",
                table: "Vehicles",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Opmerkingen",
                table: "ParticuliereVerhuur",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "ParticuliereVerhuur",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "UitgifteDatum",
                table: "ParticuliereVerhuur",
                type: "date",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Opmerk",
                table: "Vehicles");

            migrationBuilder.DropColumn(
                name: "Opmerkingen",
                table: "ParticuliereVerhuur");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "ParticuliereVerhuur");

            migrationBuilder.DropColumn(
                name: "UitgifteDatum",
                table: "ParticuliereVerhuur");
        }
    }
}
