
using Microsoft.Extensions.Configuration;
using Mng.Core.IRepositories;
using Mng.Core.IServices;
using Mng.Core.IRepositories;
using Mng.Core.IServices;
using Mng.Data;
using Mng.Data.Repositories;
using Mng.Service.Services;
using Marketplace.API.Mapping;
using Mng.Core.Mapping;
using Microsoft.Extensions.Options;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    options.JsonSerializerOptions.WriteIndented = true;
});
ConfigurationManager configuration = builder.Configuration;

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
    });
});
builder.Services.AddDbContext<DataContext>();
builder.Services.AddScoped<IEmployeeService, EmployeeService>();
builder.Services.AddScoped<IEmployeeRepository, EmployeeRepository>();
builder.Services.AddScoped<IRoleService, RoleService>();
builder.Services.AddScoped<IRoleRepository, RoleRepository>();
builder.Services.AddScoped<IEmployeeRolesService, EmployeeRolesService>();
builder.Services.AddScoped<IEmployeeRolesRepository, EmployeeRolesRepository>();
builder.Services.AddAutoMapper(typeof(MappingProfile), typeof(PostModelsMappingProfile));
var app = builder.Build();
AppContext.SetSwitch("System.Globalization.Invariant", true);
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors();
app.UseAuthorization();

app.MapControllers();

app.Run();

