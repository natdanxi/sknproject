using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using Laundry.Configs;
using System.Threading.Tasks;
using System.Collections.Generic;
using System;
using System.IO;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;

namespace Laundry.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FabricController : ControllerBase
    {
        private readonly dbConnect _db;
        private readonly IWebHostEnvironment _env;

        // รับค่า dbConnect สำหรับฐานข้อมูล และ IWebHostEnvironment สำหรับจัดการไฟล์
        public FabricController(dbConnect db, IWebHostEnvironment env)
        {
            _db = db;
            _env = env;
        }

        //  GET: api/Fabric (ดึงรายการผ้าทั้งหมด)
        [HttpGet]
        public async Task<IActionResult> GetAllFabrics()
        {
            try
            {
                var result = new List<object>();
                using var conn = _db.GetConnection();
                await conn.OpenAsync();

                string sql = "SELECT FabricID, FabricName, FabricNum, FabricImages FROM Fabric ORDER BY FabricID ASC";
                using var cmd = new SqlCommand(sql, conn);
                using var reader = await cmd.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    result.Add(new
                    {
                        fabricID = reader["FabricID"].ToString(),
                        fabricName = reader["FabricName"].ToString(),
                        fabricNum = reader["FabricNum"].ToString(),
                        fabricImages = reader["FabricImages"].ToString()
                    });
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "เกิดข้อผิดพลาดในการดึงข้อมูล", error = ex.Message });
            }
        }

        //  GET: api/Fabric/{id} (ดึงรายการผ้า 1 รายการเพื่อแก้ไข)
        [HttpGet("{id}")]
        public async Task<IActionResult> GetFabricById(string id)
        {
            try
            {
                var result = new List<object>();
                using var conn = _db.GetConnection();
                await conn.OpenAsync();

                string sql = "SELECT FabricID, FabricName, FabricNum, FabricImages FROM Fabric WHERE FabricID = @id";
                using var cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@id", id);

                using var reader = await cmd.ExecuteReaderAsync();
                if (await reader.ReadAsync())
                {
                    result.Add(new
                    {
                        fabricID = reader["FabricID"].ToString(),
                        fabricName = reader["FabricName"].ToString(),
                        fabricNum = reader["FabricNum"].ToString(),
                        fabricImages = reader["FabricImages"].ToString()
                    });
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "เกิดข้อผิดพลาดในการดึงข้อมูล", error = ex.Message });
            }
        }

        // DTO สำหรับรับข้อมูลจากฟอร์ม (รวมถึงไฟล์รูปภาพ)
        public class FabricRequest
        {
            public string? tid { get; set; }
            public string? tname { get; set; }
            public string? tnum { get; set; }
            public IFormFile? tfile { get; set; }
        }

        //  POST: api/Fabric (เพิ่ม หรือ แก้ไขข้อมูล พร้อมอัปโหลดรูปภาพ)
        [HttpPost]
        public async Task<IActionResult> SaveFabric([FromForm] FabricRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.tname))
            {
                return BadRequest("กรุณากรอกชื่อรายการผ้า");
            }

            try
            {
                using var conn = _db.GetConnection();
                await conn.OpenAsync();

                // ---  เช็คชื่อผ้าซ้ำ ---
                string checkSql = "SELECT COUNT(*) FROM Fabric WHERE FabricName = @name";
                if (request.tid != "0") checkSql += " AND FabricID != @tid";

                using var checkCmd = new SqlCommand(checkSql, conn);
                checkCmd.Parameters.AddWithValue("@name", request.tname);
                if (request.tid != "0") checkCmd.Parameters.AddWithValue("@tid", request.tid);

                int count = Convert.ToInt32(await checkCmd.ExecuteScalarAsync());
                if (count > 0) return Ok("1"); // คืนค่า "1" (มีชื่อซ้ำ)

                // ---  จัดการอัปโหลดไฟล์รูปภาพ (ถ้ามี) ---
                string? fileName = null;
                if (request.tfile != null && request.tfile.Length > 0)
                {
                    // สร้าง Path สำหรับเก็บไฟล์ (ต้องมีโฟลเดอร์ wwwroot/StaticFiles/Fabric ในโปรเจกต์)
                    string uploadsFolder = Path.Combine(_env.WebRootPath ?? Directory.GetCurrentDirectory(), "wwwroot", "StaticFiles", "Fabric");
                    Directory.CreateDirectory(uploadsFolder);

                    // ตั้งชื่อไฟล์ใหม่ด้วย GUID ป้องกันชื่อซ้ำ
                    fileName = Guid.NewGuid().ToString() + Path.GetExtension(request.tfile.FileName);
                    string filePath = Path.Combine(uploadsFolder, fileName);

                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await request.tfile.CopyToAsync(fileStream);
                    }
                }

                // --- บันทึกข้อมูลลงฐานข้อมูล ---
                if (request.tid == "0")
                {
                    // เพิ่มใหม่
                    string insertSql = "INSERT INTO Fabric (FabricName, FabricNum, FabricImages) VALUES (@name, @num, @img)";
                    using var cmd = new SqlCommand(insertSql, conn);
                    cmd.Parameters.AddWithValue("@name", request.tname);
                    cmd.Parameters.AddWithValue("@num", request.tnum ?? "0");
                    cmd.Parameters.AddWithValue("@img", fileName ?? "");

                    await cmd.ExecuteNonQueryAsync();
                    return Ok("0"); // เพิ่มสำเร็จ
                }
                else
                {
                    // แก้ไข
                    // ถ้าไม่มีการอัปโหลดไฟล์ใหม่ จะไม่อัปเดตคอลัมน์ FabricImages (ใช้รูปเดิม)
                    string updateSql = request.tfile != null
                        ? "UPDATE Fabric SET FabricName = @name, FabricNum = @num, FabricImages = @img WHERE FabricID = @tid"
                        : "UPDATE Fabric SET FabricName = @name, FabricNum = @num WHERE FabricID = @tid";

                    using var cmd = new SqlCommand(updateSql, conn);
                    cmd.Parameters.AddWithValue("@name", request.tname);
                    cmd.Parameters.AddWithValue("@num", request.tnum ?? "0");
                    cmd.Parameters.AddWithValue("@tid", request.tid);

                    if (request.tfile != null)
                        cmd.Parameters.AddWithValue("@img", fileName);

                    await cmd.ExecuteNonQueryAsync();
                    return Ok("2"); // อัปเดตสำเร็จ
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "เกิดข้อผิดพลาดในการบันทึก", error = ex.Message });
            }
        }

        //  DELETE: api/Fabric/{id} 
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFabric(string id)
        {
            try
            {
                using var conn = _db.GetConnection();
                await conn.OpenAsync();

                // ดึงชื่อไฟล์รูปภาพเก่ามาลบออกจากโฟลเดอร์ (ทางเลือก: ถ้าต้องการประหยัดพื้นที่เซิร์ฟเวอร์)
                // string getImgSql = "SELECT FabricImages FROM Fabric WHERE FabricID = @id"; ...

                string sql = "DELETE FROM Fabric WHERE FabricID = @id";
                using var cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@id", id);
                await cmd.ExecuteNonQueryAsync();

                return Ok("ลบข้อมูลสำเร็จ");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "เกิดข้อผิดพลาดในการลบ", error = ex.Message });
            }
        }
    }
}