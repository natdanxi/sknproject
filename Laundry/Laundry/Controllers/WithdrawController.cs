using Microsoft.AspNetCore.Mvc;
using Laundry.Configs;
using System.Text;
using System.Data.SqlClient;
using Laundry.Models;

namespace Laundry.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WithdrawController : ControllerBase
    {
        private readonly dbConnect _db;

        public WithdrawController(dbConnect db)
        {
            _db = db;
        }

        //  ดึงรายการเบิกของหน่วยงาน
        [HttpGet]
        public IActionResult Showdata([FromQuery] string? officeID)
        {
            var result = new List<object>();

            using (SqlConnection conn = _db.GetConnection())
            {
                conn.Open();

                var sql = new StringBuilder();
                sql.Append(@"SELECT TOP(1000) oc.Orderid, CONVERT(varchar, oc.Orderdate, 103) AS Orderdate, CONVERT(varchar, oc.Orderdate, 108) AS Ordertime, ");
                sql.Append(" RTRIM(t.Tname) + '' + RTRIM(p.Fname) + ' ' + RTRIM(p.Lname) AS fullname, oc.Orderstatus, oc.Orderseason ");
                sql.Append(" FROM LA_Ordercloth oc ");
                sql.Append(" LEFT JOIN Personnalite p ON oc.Orderusersend = p.Pid ");
                sql.Append(" LEFT JOIN Titlename t ON t.Tid = p.Tname ");
                sql.Append(" WHERE oc.Orderdel = '1' AND oc.Orderofficeid = @officeID ");
                sql.Append(" ORDER BY oc.Orderid DESC");

                using (var cmd = new SqlCommand(sql.ToString(), conn))
                {
                    cmd.Parameters.AddWithValue("@officeID", officeID ?? "");

                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            result.Add(new
                            {
                                Orderid = reader["Orderid"].ToString(),
                                Orderdate = reader["Orderdate"].ToString(),
                                Ordertime = reader["Ordertime"].ToString(),
                                fullname = reader["fullname"].ToString(),
                                Orderstatus = reader["Orderstatus"].ToString(),
                                Orderseason = reader["Orderseason"].ToString()
                            });
                        }
                    }
                }
            }

            return Ok(result);
        }

        //  โหลดรายการผ้าใส่ Dropdown (React-Select ใช้ value, label)
        [HttpGet("Showlistfabric")]
        public IActionResult Showlistfabric([FromQuery] string? officeID)
        {
            var result = new List<object>();

            using (SqlConnection conn = _db.GetConnection())
            {
                conn.Open();
                // หมายเหตุ: ตรวจสอบชื่อตารางผ้า/สต็อก (LA_Fabric, LA_Stock) ให้ตรงกับใน SQL Server ของคุณ
                string sql = @"SELECT f.FabricID AS value, f.FabricName AS label 
                               FROM LA_Fabric f
                               INNER JOIN LA_Stock s ON f.FabricID = s.FabricID
                               WHERE s.Officeid = @officeID";

                using (var cmd = new SqlCommand(sql, conn))
                {
                    cmd.Parameters.AddWithValue("@officeID", officeID ?? "");
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            result.Add(new
                            {
                                value = reader["value"].ToString(),
                                label = reader["label"].ToString()
                            });
                        }
                    }
                }
            }

            return Ok(result);
        }

        //  ดึงยอดคงเหลือในตู้เมื่อเลือกผ้า
        [HttpGet("Showstock/{id}")]
        public IActionResult Showstock(string id, [FromQuery] string? officeID)
        {
            var result = new List<object>();

            using (SqlConnection conn = _db.GetConnection())
            {
                conn.Open();
                // หมายเหตุ: ตรวจสอบชื่อตาราง LA_Stock และคอลัมน์ Stocknum
                string sql = @"SELECT Stocknum FROM LA_Stock WHERE FabricID = @id AND Officeid = @officeID";

                using (var cmd = new SqlCommand(sql, conn))
                {
                    cmd.Parameters.AddWithValue("@id", id);
                    cmd.Parameters.AddWithValue("@officeID", officeID ?? "");
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            result.Add(new
                            {
                                Stocknum = reader["Stocknum"].ToString()
                            });
                        }
                    }
                }
            }

            return Ok(result);
        }

        //  ตรวจสอบเลขที่ใบเบิกที่สร้างค้างไว้ (ยังไม่มีรายการผ้า)
        [HttpGet("Checkordernumber")]
        public IActionResult Checkordernumber([FromQuery] string? officeID)
        {
            var result = new List<object>();

            using (SqlConnection conn = _db.GetConnection())
            {
                conn.Open();
                string sql = @"SELECT TOP(1) oc.Orderid, oc.Orderstatus, COUNT(od.ID) AS CountID
                               FROM LA_Ordercloth oc
                               LEFT JOIN LA_Orderdetail od ON od.Orderid = oc.Orderid
                               WHERE oc.Orderofficeid = @officeID AND oc.Orderdel = '1'
                               GROUP BY oc.Orderid, oc.Orderstatus
                               ORDER BY oc.Orderid DESC";

                using (var cmd = new SqlCommand(sql, conn))
                {
                    cmd.Parameters.AddWithValue("@officeID", officeID ?? "");
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            result.Add(new
                            {
                                Orderid = reader["Orderid"].ToString(),
                                Orderstatus = reader["Orderstatus"].ToString(),
                                CountID = reader["CountID"].ToString()
                            });
                        }
                    }
                }
            }

            return Ok(result);
        }

        //  สร้างเลขที่ใบเบิกใหม่
        [HttpPost("Createnumber")]
        public IActionResult Createnumber([FromQuery] string? officeID, [FromQuery] string? userID)
        {
            string newOrderId = DateTime.Now.ToString("yyyyMMddHHmmss");

            using (SqlConnection conn = _db.GetConnection())
            {
                conn.Open();
                string sql = @"INSERT INTO LA_Ordercloth (Orderid, Orderdate, Orderofficeid, Orderusersend, Orderstatus, Orderdel)
                               VALUES (@orderid, GETDATE(), @officeID, @userID, '0', '1')";

                using (var cmd = new SqlCommand(sql, conn))
                {
                    cmd.Parameters.AddWithValue("@orderid", newOrderId);
                    cmd.Parameters.AddWithValue("@officeID", officeID ?? "");
                    cmd.Parameters.AddWithValue("@userID", userID ?? "");
                    cmd.ExecuteNonQuery();
                }
            }

            return Ok(newOrderId);
        }

        //  ดึงข้อมูลรายละเอียดใบเบิกตอนกดปุ่มแก้ไข
        [HttpGet("Edit/{id}")]
        public IActionResult Showdataedit(string id)
        {
            var result = new List<object>();

            using (SqlConnection conn = _db.GetConnection())
            {
                conn.Open();
                string sql = @"SELECT oc.Orderid, oc.Orderseason, od.FabricID, f.FabricName, 
                                      od.Cupboard, od.Bed, od.Borrow, od.Patientnum, od.Other
                               FROM LA_Ordercloth oc
                               INNER JOIN LA_Orderdetail od ON oc.Orderid = od.Orderid
                               LEFT JOIN LA_Fabric f ON od.FabricID = f.FabricID
                               WHERE oc.Orderid = @id";

                using (var cmd = new SqlCommand(sql, conn))
                {
                    cmd.Parameters.AddWithValue("@id", id);
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            result.Add(new
                            {
                                Orderid = reader["Orderid"].ToString(),
                                Orderseason = reader["Orderseason"].ToString(),
                                FabricID = reader["FabricID"].ToString(),
                                FabricName = reader["FabricName"].ToString(),
                                Cupboard = reader["Cupboard"].ToString(),
                                Bed = reader["Bed"].ToString(),
                                Borrow = reader["Borrow"].ToString(),
                                Patientnum = reader["Patientnum"].ToString(),
                                Other = reader["Other"].ToString()
                            });
                        }
                    }
                }
            }

            return Ok(result);
        }

        //  บันทึกหัวบิล (อัปเดตช่วงเวลา และเคลียร์รายการเดิมกรณีแก้ไข)
        [HttpPost]
        public IActionResult Inputdata(
            [FromForm] string? tid,
            [FromForm] string? torderid,
            [FromForm] string? torderstatus,
            [FromForm] string? tofficeid,
            [FromForm] string? tuserid)
        {
            using (SqlConnection conn = _db.GetConnection())
            {
                conn.Open();

                // อัปเดตช่วงเวลา (Orderseason) ในหัวบิล
                string sqlUpdate = @"UPDATE LA_Ordercloth 
                                     SET Orderseason = @orderseason, Orderusersend = @userid 
                                     WHERE Orderid = @orderid";
                using (var cmd = new SqlCommand(sqlUpdate, conn))
                {
                    cmd.Parameters.AddWithValue("@orderseason", torderstatus ?? "1");
                    cmd.Parameters.AddWithValue("@userid", tuserid ?? "");
                    cmd.Parameters.AddWithValue("@orderid", torderid ?? "");
                    cmd.ExecuteNonQuery();
                }

                // ลบรายการผ้าย่อยเดิมออกก่อน เพื่อบันทึกรายการใหม่จาก Inputdetail
                string sqlDelDetail = @"DELETE FROM LA_Orderdetail WHERE Orderid = @orderid";
                using (var cmd = new SqlCommand(sqlDelDetail, conn))
                {
                    cmd.Parameters.AddWithValue("@orderid", torderid ?? "");
                    cmd.ExecuteNonQuery();
                }
            }

            return Ok(torderid);
        }

        //  บันทึกรายการผ้าย่อย
        [HttpPost("Detail")]
        public IActionResult Inputdetail(
            [FromForm] string? torderid,
            [FromForm] string? tfabricID,
            [FromForm] string? tcupboard,
            [FromForm] string? tbed,
            [FromForm] string? tborrow,
            [FromForm] string? tpatientnum,
            [FromForm] string? tother)
        {
            using (SqlConnection conn = _db.GetConnection())
            {
                conn.Open();
                string sql = @"INSERT INTO LA_Orderdetail (Orderid, FabricID, Cupboard, Bed, Borrow, Patientnum, Other)
                               VALUES (@orderid, @fabricID, @cupboard, @bed, @borrow, @patientnum, @other)";

                using (var cmd = new SqlCommand(sql, conn))
                {
                    cmd.Parameters.AddWithValue("@orderid", torderid ?? "");
                    cmd.Parameters.AddWithValue("@fabricID", tfabricID ?? "");
                    cmd.Parameters.AddWithValue("@cupboard", tcupboard ?? "0");
                    cmd.Parameters.AddWithValue("@bed", tbed ?? "0");
                    cmd.Parameters.AddWithValue("@borrow", tborrow ?? "0");
                    cmd.Parameters.AddWithValue("@patientnum", tpatientnum ?? "0");
                    cmd.Parameters.AddWithValue("@other", tother ?? "");
                    cmd.ExecuteNonQuery();
                }
            }

            return Ok(new { status = "success" });
        }

        [HttpDelete("{id}")]
        public IActionResult Deletedata(string id, [FromQuery] string? tuserid)
        {
            using (SqlConnection conn = _db.GetConnection())
            {
                conn.Open();
                string sql = @"UPDATE LA_Ordercloth SET Orderdel = '0' WHERE Orderid = @id";

                using (var cmd = new SqlCommand(sql, conn))
                {
                    cmd.Parameters.AddWithValue("@id", id);
                    cmd.ExecuteNonQuery();
                }
            }

            return Ok(new { status = "deleted" });
        }
    }
}