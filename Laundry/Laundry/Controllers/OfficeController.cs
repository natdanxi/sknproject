using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using Laundry.Configs;
using System.Threading.Tasks;
using System.Collections.Generic;
using System;

namespace Laundry.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OfficeController : ControllerBase
    {
        private readonly dbConnect _db;

        public OfficeController(dbConnect db)
        {
            _db = db;
        }

        //  GET: api/Office
        [HttpGet]
        public async Task<IActionResult> GetAllOffices()
        {
            try
            {
                var result = new List<object>();

                using var conn = _db.GetConnection();
                await conn.OpenAsync();

                string sql = "SELECT Officeid, Officename, LA_Str FROM Office ORDER BY Officeid ASC";
                using var cmd = new SqlCommand(sql, conn);
                using var reader = await cmd.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    result.Add(new
                    {
                        officeid = reader["Officeid"].ToString(),
                        officename = reader["Officename"].ToString(),
                        lA_Str = reader["LA_Str"].ToString()
                    });
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                // ดักจับ Error ป้องกัน API ล่มแบบไม่ทราบสาเหตุ
                return StatusCode(500, new { message = "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์", error = ex.Message });
            }
        }


        //  GET: api/Office/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetOfficeById(string id)
        {
            try
            {
                var result = new List<object>();

                using var conn = _db.GetConnection();
                await conn.OpenAsync();

                string sql = "SELECT Officeid, Officename, LA_Str FROM Office WHERE Officeid = @id";
                using var cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@id", id); 

                using var reader = await cmd.ExecuteReaderAsync();
                if (await reader.ReadAsync())
                {
                    result.Add(new
                    {
                        officeid = reader["Officeid"].ToString(),
                        officename = reader["Officename"].ToString(),
                        lA_Str = reader["LA_Str"].ToString()
                    });
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์", error = ex.Message });
            }
        }

        public class OfficeRequest
        {
            public string? tid { get; set; }
            public string? tofficeid { get; set; }
            public string? tofficename { get; set; }
            public string? tStr { get; set; }
        }

        // POST: api/Office
        [HttpPost]
        public async Task<IActionResult> SaveOffice([FromForm] OfficeRequest request)
        {
            // ตรวจสอบความถูกต้องของข้อมูลเบื้องต้น
            if (string.IsNullOrWhiteSpace(request.tofficeid) || string.IsNullOrWhiteSpace(request.tofficename))
            {
                return BadRequest("ข้อมูลไม่ครบถ้วน");
            }

            try
            {
                using var conn = _db.GetConnection();
                await conn.OpenAsync();

                // ---  เช็คข้อมูลซ้ำ ---
                string checkSql = "SELECT COUNT(*) FROM Office WHERE Officeid = @officeid";
                if (request.tid != "0") checkSql += " AND Officeid != @tid";

                using var checkCmd = new SqlCommand(checkSql, conn);
                checkCmd.Parameters.AddWithValue("@officeid", request.tofficeid);
                if (request.tid != "0") checkCmd.Parameters.AddWithValue("@tid", request.tid);

                int count = Convert.ToInt32(await checkCmd.ExecuteScalarAsync());
                if (count > 0) return Ok("1"); // คืนค่า "1" = มีข้อมูลซ้ำ

                // --- บันทึกข้อมูล หรือ อัปเดต ---
                if (request.tid == "0")
                {
                    string insertSql = "INSERT INTO Office (Officeid, Officename, LA_Str) VALUES (@officeid, @officename, @tStr)";
                    using var insertCmd = new SqlCommand(insertSql, conn);
                    insertCmd.Parameters.AddWithValue("@officeid", request.tofficeid);
                    insertCmd.Parameters.AddWithValue("@officename", request.tofficename);
                    insertCmd.Parameters.AddWithValue("@tStr", request.tStr ?? "");

                    await insertCmd.ExecuteNonQueryAsync();
                    return Ok("0"); // คืนค่า "0" = บันทึกใหม่สำเร็จ
                }
                else
                {
                    string updateSql = "UPDATE Office SET Officeid = @officeid, Officename = @officename, LA_Str = @tStr WHERE Officeid = @tid";
                    using var updateCmd = new SqlCommand(updateSql, conn);
                    updateCmd.Parameters.AddWithValue("@officeid", request.tofficeid);
                    updateCmd.Parameters.AddWithValue("@officename", request.tofficename);
                    updateCmd.Parameters.AddWithValue("@tStr", request.tStr ?? "");
                    updateCmd.Parameters.AddWithValue("@tid", request.tid);

                    await updateCmd.ExecuteNonQueryAsync();
                    return Ok("2"); // คืนค่า "2" = อัปเดตสำเร็จ
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "เกิดข้อผิดพลาดในการบันทึกข้อมูล", error = ex.Message });
            }
        }
    }
}