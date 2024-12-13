using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CarAndAllReactASP.Server.Migrations
{
    /// <inheritdoc />
    public partial class RelatieParticulierH : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "UserID",
                table: "ParticuliereVerhuur",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateIndex(
                name: "IX_ParticuliereVerhuur_UserID",
                table: "ParticuliereVerhuur",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_ParticuliereVerhuur_VoertuigID",
                table: "ParticuliereVerhuur",
                column: "VoertuigID");

            migrationBuilder.AddForeignKey(
                name: "FK_ParticuliereVerhuur_AspNetUsers_UserID",
                table: "ParticuliereVerhuur",
                column: "UserID",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ParticuliereVerhuur_Vehicles_VoertuigID",
                table: "ParticuliereVerhuur",
                column: "VoertuigID",
                principalTable: "Vehicles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ParticuliereVerhuur_AspNetUsers_UserID",
                table: "ParticuliereVerhuur");

            migrationBuilder.DropForeignKey(
                name: "FK_ParticuliereVerhuur_Vehicles_VoertuigID",
                table: "ParticuliereVerhuur");

            migrationBuilder.DropIndex(
                name: "IX_ParticuliereVerhuur_UserID",
                table: "ParticuliereVerhuur");

            migrationBuilder.DropIndex(
                name: "IX_ParticuliereVerhuur_VoertuigID",
                table: "ParticuliereVerhuur");

            migrationBuilder.AlterColumn<string>(
                name: "UserID",
                table: "ParticuliereVerhuur",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");
        }
    }
}
