using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using Laundry.Configs;
using System.Threading.Tasks;
using System.Collections.Generic;
using System;
using Microsoft.AspNetCore.Hosting;

namespace Laundry.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly dbConnect _db;
        private readonly IWebHostEnvironment _env;

        public UserController(dbConnect db, IWebHostEnvironment env)
        {
            _db = db;
            _env = env;
        }

        //  ดึงข้อมูลคำนำหน้าชื่อ (สำหรับ Dropdown)
        [HttpGet("Showlisttname")]
        public async Task<IActionResult> Showlisttname()
        {
            var result = new List<object>();
            using var conn = _db.GetConnection();
            await conn.OpenAsync();

            //  รอแก้ไข: ตรวจสอบชื่อตาราง 'TitleName' และคอลัมน์ 'Tid', 'Tname'
            string sql = "SELECT Tid AS value, Tname AS label FROM TitleName";

            using var cmd = new SqlCommand(sql, conn);
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                result.Add(new { value = reader["value"].ToString(), label = reader["label"].ToString() });
            }
            return Ok(result);
        }

        //  ดึงข้อมูลหน่วยงาน (สำหรับ Dropdown)
        [HttpGet("Showlistoffice")]
        public async Task<IActionResult> Showlistoffice()
        {
            var result = new List<object>();
            using var conn = _db.GetConnection();
            await conn.OpenAsync();

            // ⚠ รอแก้ไข: ตรวจสอบชื่อตาราง 'Office' และคอลัมน์ 'Officeid', 'Officename'
            string sql = "SELECT Officeid AS value, Officename AS label FROM Office";

            using var cmd = new SqlCommand(sql, conn);
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                result.Add(new { value = reader["value"].ToString(), label = reader["label"].ToString() });
            }
            return Ok(result);
        }

        //  ดึงข้อมูลผู้ใช้งานทั้งหมด 
        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            try
            {
                var result = new List<object>();
                using var conn = _db.GetConnection();
                await conn.OpenAsync();

                // ⚠️ รอแก้ไข: ตรวจสอบชื่อตาราง 'Users', 'Office'
                string sql = @"SELECT u.Pid, u.Fname + ' ' + u.Lname AS fullname, 
                                      o.Officename, u.Pstr, u.LA_Str 
                               FROM Users u 
                               LEFT JOIN Office o ON u.Officeid = o.Officeid";

                using var cmd = new SqlCommand(sql, conn);
                using var reader = await cmd.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    result.Add(new
                    {
                        pid = reader["Pid"].ToString(),
                        fullname = reader["fullname"].ToString(),
                        officename = reader["Officename"].ToString(),
                        pstr = reader["Pstr"].ToString(),
                        lA_Str = reader["LA_Str"].ToString()
                    });
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้งาน", error = ex.Message });
            }
        }

        //  ดึงข้อมูลผู้ใช้งาน 1 คน (สำหรับดึงมาแสดงในฟอร์มแก้ไข)
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(string id)
        {
            var result = new List<object>();
            using var conn = _db.GetConnection();
            await conn.OpenAsync();

            //  รอแก้ไข: ตรวจสอบชื่อตาราง 'Users' 
            string sql = "SELECT * FROM Users WHERE Pid = @id";

            using var cmd = new SqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("@id", id);
            using var reader = await cmd.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                result.Add(new
                {
                    tid = reader["Tid"].ToString(),
                    fname = reader["Fname"].ToString(),
                    lname = reader["Lname"].ToString(),
                    position = reader["Position"].ToString(),
                    pid = reader["Pid"].ToString(),
                    officeid = reader["Officeid"].ToString(),
                    tel = reader["Tel"].ToString(),
                    email = reader["Email"].ToString(),
                    username = reader["Username"].ToString(),
                    images = reader["Images"].ToString()
                });
            }
            return Ok(result);
        }
    }
}