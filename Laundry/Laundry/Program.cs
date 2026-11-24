using Laundry.Configs;

var builder = WebApplication.CreateBuilder(args);

// ✅ เพิ่ม CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// Add services to the container.
builder.Services.AddScoped<dbConnect>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// ✅ ใช้ CORS (ต้องอยู่ก่อน MapControllers)
app.UseCors("AllowAll");

// ✅ เปิด Swagger ทุก environment
app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();

// เรียกใช้ไฟล์รูปภาพ
app.UseStaticFiles();

app.UseAuthorization();

app.MapControllers();

app.Run();
