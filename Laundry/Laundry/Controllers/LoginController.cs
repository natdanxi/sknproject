using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Laundry.Configs;
using System.Text;
using System.Data.SqlClient;
using Laundry.Models;

namespace Laundry.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {

        private readonly dbConnect _db;

        public LoginController(dbConnect db)
        {
            _db = db;
        }

        [HttpGet("liseproject")]
        public IActionResult Getlistproject()
        {
            var result = new List<object>();

            using (SqlConnection conn = _db.GetConnection())
            {
                conn.Open();

                var sql = new StringBuilder();
                sql.Append(@"SELECT Projectid AS value, Projectname AS label, Projectfile FROM Sknproject");

                var cmd = new SqlCommand();
                cmd.Connection = conn;

                cmd.CommandText = sql.ToString();

                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        result.Add(new
                        {
                            value = reader["value"],
                            label = reader["label"],
                        });
                    }
                }
            }

            return Ok(result);
        }


        [HttpPost]
        public IActionResult Poslogin([FromForm] string? username, [FromForm] string? passwd)
        {
            var result = new List<object>();

            // แปลงรหัสผ่านเป็น MD5 (ถ้า passwd ไม่เป็นค่า null หรือว่าง)
            string hashedPassword = string.IsNullOrEmpty(passwd) ? string.Empty : GetMd5Hash(passwd);

            using (SqlConnection conn = _db.GetConnection())
            {
                conn.Open();

                var sql = new StringBuilder();
                sql.Append(@"SELECT Personnalite.Pid, 
                     RTRIM(Titlename.Tname) + ' ' + RTRIM(Personnalite.Fname) + ' ' + RTRIM(Personnalite.Lname) AS fullname,
                     Personnalite.Position, Personnalite.Officeid, Office.Officename, 
                     Personnalite.Tel, Personnalite.Username, Personnalite.Passwd, 
                     Personnalite.Pstr, Personnalite.Images, Office.LA_Str
                     FROM Personnalite 
                     INNER JOIN Office ON Personnalite.Officeid = Office.Officeid
                     INNER JOIN Titlename ON Personnalite.Tname = Titlename.Tid
                     WHERE (Personnalite.Username = @username) AND (Personnalite.Passwd = @passwd)");

                using (var cmd = new SqlCommand(sql.ToString(), conn))
                {
                    cmd.Parameters.AddWithValue("@username", (object?)username ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@passwd", hashedPassword);

                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            result.Add(new
                            {
                                Pid = reader["Pid"] != DBNull.Value ? reader["Pid"].ToString() : string.Empty,
                                Fullname = reader["fullname"] != DBNull.Value ? reader["fullname"].ToString() : string.Empty,
                                Position = reader["Position"] != DBNull.Value ? reader["Position"].ToString() : string.Empty,
                                Officeid = reader["Officeid"] != DBNull.Value ? reader["Officeid"] : null,
                                Officename = reader["Officename"] != DBNull.Value ? reader["Officename"].ToString() : string.Empty,
                                Tel = reader["Tel"] != DBNull.Value ? reader["Tel"].ToString() : string.Empty,
                                Username = reader["Username"] != DBNull.Value ? reader["Username"].ToString() : string.Empty,
                                Passwd = reader["Passwd"] != DBNull.Value ? reader["Passwd"].ToString() : string.Empty,
                                Pstr = reader["Pstr"] != DBNull.Value ? reader["Pstr"].ToString() : string.Empty,
                                Images = reader["Images"] != DBNull.Value ? reader["Images"].ToString() : string.Empty,
                                LA_Str = reader["LA_Str"] != DBNull.Value ? reader["LA_Str"].ToString() : string.Empty
                            });
                        }
                    }
                }
            }

            return Ok(result);
        }

        // ฟังก์ชันสำหรับแปลงข้อความให้เป็น MD5 Hash (Hexadecimal 32 ตัวอักษร)
        private string GetMd5Hash(string input)
        {
            using (System.Security.Cryptography.MD5 md5 = System.Security.Cryptography.MD5.Create())
            {
                byte[] inputBytes = System.Text.Encoding.UTF8.GetBytes(input);
                byte[] hashBytes = md5.ComputeHash(inputBytes);

                System.Text.StringBuilder sb = new System.Text.StringBuilder();
                for (int i = 0; i < hashBytes.Length; i++)
                {
                    sb.Append(hashBytes[i].ToString("x2"));
                }
                return sb.ToString();
            }
        }

    }
}
