using E_EstateV2_API.Data;
using E_EstateV2_API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using E_EstateV2_API.IRepository;
using E_EstateV2_API.Repository;
using System.Security.Cryptography;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddTransient<AnnouncementRepository>();
builder.Services.AddDirectoryBrowser();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

//injectDBContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
           options.UseSqlServer(connectionString));

//add ASPIdentity
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

//Add Repository and IRepository
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
// create new instance when the system see InterfaceReposirtory
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ICompanyRepository, CompanyRepository>();
builder.Services.AddScoped<ICostAmountRepository, CostAmountRepository>();
builder.Services.AddScoped<ICostRepository, CostRepository>();
builder.Services.AddScoped<IEmailRepository, EmailRepository>();
builder.Services.AddScoped<IEstateRepository, EstateRepository>();
builder.Services.AddScoped<IFieldCloneRepository, FieldCloneRepository>();
builder.Services.AddScoped<IFieldConversionRepository, FieldConversionRepository>();
builder.Services.AddScoped<IFieldProductionRepository, FieldProductionRepository>();
builder.Services.AddScoped<IFieldRepository, FieldRepository>();
//builder.Services.AddScoped<IForeignLaborRepository, ForeignLaborRepository>();
builder.Services.AddScoped<ILocalLaborRepository, LocalLaborRepository>();
builder.Services.AddScoped<IRoleRepository, RoleRepository>();
builder.Services.AddScoped<IRubberPurchaseRepository, RubberPurchaseRepository>();
builder.Services.AddScoped<IRubberSaleRepository, RubberSaleRepository>();
builder.Services.AddScoped<IUserActivityLogRepository, UserActivityLogRepository>();
builder.Services.AddScoped<IReportRepository, ReportRepository>();
builder.Services.AddScoped<ITownRepository, TownRepository>();
builder.Services.AddScoped<ICountryRepository, CountryRepository>();
builder.Services.AddScoped<IAnnouncementRepository, AnnouncementRepository>();
builder.Services.AddScoped<IFieldInfoYearlyRepository, FieldInfoYearlyRepository>();
builder.Services.AddScoped<IEstateDetailRepository, EstateDetailRepository>();
builder.Services.AddScoped<IFieldInfectedRepository, FieldInfectedRepository>();
builder.Services.AddScoped<ICompanyDetailRepository, CompanyDetailRepository>();
builder.Services.AddScoped<ILaborInformationRepository, LaborInformationRepository>();
builder.Services.AddScoped<ILaborByCategoryRepository, LaborByCategoryRepository>();

//configure password
builder.Services.Configure<IdentityOptions>(options =>
{
    options.Password.RequireDigit = false;
    options.Password.RequireLowercase = false;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequiredLength = 3;
});

//JWT Authentication
byte[] key = (byte[])GenerateRandomKey();


object GenerateRandomKey()
{
    byte[] keyBytes = new byte[32];
    using (var rng = new RNGCryptoServiceProvider())
    {
        rng.GetBytes(keyBytes);
    }
    return keyBytes;
}

builder.Services.AddAuthentication(x =>
{
    //scheme
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;

}).AddJwtBearer(x =>
{
    //restrict certain authentication data 
    x.RequireHttpsMetadata = false;
    //save token in server
    x.SaveToken = false;
    //validate Token after success
    x.TokenValidationParameters = new TokenValidationParameters
    {
        //validate key
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = true,
        ValidateAudience = true,
        ClockSkew = TimeSpan.Zero
    };
});


builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy",
        builder => builder.AllowAnyHeader()
        .AllowAnyOrigin()
        .AllowAnyMethod());
});
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();

    app.UseCors("CorsPolicy");
}
app.UseStaticFiles();

app.UseCors("CorsPolicy");

app.UseHttpsRedirection();

app.UseAuthorization();
app.UseAuthentication();

app.MapControllers();

SeedData.PopulateDb(app);

app.Run();
