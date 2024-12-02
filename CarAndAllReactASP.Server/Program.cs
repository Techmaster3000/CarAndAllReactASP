using CarAndAllReactASP.Data;
using CarAndAllReactASP.Services;
using Microsoft.EntityFrameworkCore;

namespace CarAndAllReactASP.Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // Database context toevoegen
            builder.Services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

            // EmailService registreren in de DI-container
            builder.Services.AddTransient<EmailService>(provider =>
                new EmailService(
                    smtpHost: "smtp.gmail.com",
                    smtpPort: 587,
                    smtpUser: "carandalle@gmail.com",
                    smtpPass: "!c@randAll1"
                )
            );

            var app = builder.Build();

            app.UseDefaultFiles();
            app.UseStaticFiles();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();

            app.MapControllers();

            app.MapFallbackToFile("/index.html");

            app.Run();
        }
    }
}
