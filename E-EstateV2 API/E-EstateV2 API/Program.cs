using E_EstateV2_API.Data;
using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using E_EstateV2_API.Repository;
using Microsoft.AspNetCore.Authentication.AzureAD.UI;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Web;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

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
builder.Services.AddScoped<IRubberSaleIntegrationRepository, RubberSaleIntegrationRepository>();
builder.Services.AddScoped<IFieldDiseaseRepository, FieldDiseaseRepository>();
builder.Services.AddScoped<IFieldGrantRepository, FieldGrantRepository>();
builder.Services.AddScoped<IFieldHistoryRepository, FieldHistoryRepository>();
builder.Services.AddScoped<IFieldInfectedHistoryRepository, FieldInfectedHistoryRepository>();
builder.Services.AddScoped<IRubberSaleHistoryRepository, RubberSaleHistoryRepository>();
builder.Services.AddScoped<IEstateContactHistoryRepository, EstateContactHistoryRepository>();
builder.Services.AddScoped<ICompanyContactHistoryRepository, CompanyContactHistoryRepository>();

//configure password
builder.Services.Configure<IdentityOptions>(options =>
{
    options.Password.RequireDigit = false;
    options.Password.RequireLowercase = false;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequiredLength = 3;
});


builder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme; // Default scheme for non-Azure clients
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer("CustomJwt",options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Convert.FromBase64String(builder.Configuration["Jwt:Key"])), // Decode the key
        ValidateIssuer = true,
        ValidIssuer = "https://www5.lgm.gov.my/trainingE-estate",
        ValidAudience = "https://api02.lgm.gov.my/trainingE-estateApi",
        ValidateAudience = true,
        //ValidIssuer = "https://www5.lgm.gov.my/RRIMestet",
        //ValidAudience = "https://api02.lgm.gov.my/RRIMestetApi",
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
})
.AddMicrosoftIdentityWebApi(builder.Configuration.GetSection("AzureAD"), "AzureAD");

// Optionally set up authorization policies for each scheme
//builder.Services.AddAuthorization(options =>
//{
//    options.AddPolicy("AzureADPolicy", policy =>
//    {
//        policy.AuthenticationSchemes.Add("AzureAD");
//        policy.RequireAuthenticatedUser();
//    });

//    options.AddPolicy("CustomJwtPolicy", policy =>
//    {
//        policy.AuthenticationSchemes.Add("CustomJwt");
//        policy.RequireAuthenticatedUser();
//    });
//});

builder.Services.AddControllers(options =>
{
    options.Filters.Add(new AuthorizeFilter(new AuthorizationPolicyBuilder()
        .AddAuthenticationSchemes("CustomJwt", "AzureAD")
        .RequireAuthenticatedUser()
        .Build()));
});


builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy",
        builder => builder.AllowAnyHeader()
        .AllowAnyOrigin()
        .AllowAnyMethod());
});

builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddSwaggerGen(c =>
//{
//    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Your API", Version = "v1" });

//    // Include security requirement (client ID) in Swagger UI
//    c.AddSecurityDefinition("ClientIdSecurity", new OpenApiSecurityScheme
//    {
//        Type = SecuritySchemeType.ApiKey,
//        Name = "Client-ID",
//        In = ParameterLocation.Header,
//        Description = "Please enter your client ID.",
//    });

//    // Apply security requirement (client ID) globally to all endpoints
//    c.AddSecurityRequirement(new OpenApiSecurityRequirement
//    {
//        {
//            new OpenApiSecurityScheme
//            {
//                Reference = new OpenApiReference
//                {
//                    Type = ReferenceType.SecurityScheme,
//                    Id = "ClientIdSecurity"
//                }
//            },
//            new string[] {}
//        }
//    });
//});


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment() || app.Environment.IsProduction())
{
    app.UseSwagger();
    app.UseSwaggerUI();

    app.UseCors("CorsPolicy");
}
app.UseStaticFiles();

// Middleware to validate client ID in incoming requests
//app.Use(async (context, next) =>
//{
//    var endpoint = context.GetEndpoint();

//    // Only enforce client ID check if the endpoint has [Authorize] attribute
//    if (endpoint?.Metadata?.GetMetadata<AuthorizeAttribute>() != null)
//    {
//        string clientId = context.Request.Headers["Client-ID"].FirstOrDefault();

//        var registeredClients = new Dictionary<string, string>
//        {
//            { "ceced9cc-f6b2-4cae-8b60-1c7b67dc70db", "" }, // No client secret required
//            // Add other registered clients...
//        };

//        if (!string.IsNullOrEmpty(clientId) && registeredClients.ContainsKey(clientId))
//        {
//            // Add the client_id claim for the authorization policy to work
//            var claims = new List<Claim> { new Claim("client_id", clientId) };
//            var identity = new ClaimsIdentity(claims);
//            context.User.AddIdentity(identity);

//            await next();
//        }
//        else
//        {
//            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
//            await context.Response.WriteAsync("Unauthorized. Invalid client ID.");
//        }
//    }
//    else
//    {
//        await next();
//    }
//});


app.UseCors("CorsPolicy");

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

SeedData.PopulateDb(app);

app.Run();
