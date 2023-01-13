using Microsoft.EntityFrameworkCore;
using CRUDWebAPI.Models;

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          policy.WithOrigins("*")
                          //.AllowCredentials()
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                      });
});

var connectionString = builder.Configuration.GetConnectionString("VFDB");
builder.Services.AddEntityFrameworkSqlServer();
builder.Services.AddDbContextPool<VfdbContext>((serviceProvider, optionsBuilder) =>
{
    optionsBuilder.UseSqlServer(connectionString);
    optionsBuilder.UseInternalServiceProvider(serviceProvider);
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(MyAllowSpecificOrigins);

app.UseAuthorization();

app.MapControllers();

app.Run();