using Microsoft.AspNetCore.Mvc;
using Laundry.Configs;
using System.Text;
using System.Data.SqlClient;
using Laundry.Models;

namespace Laundry.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WithdrawadminController : ControllerBase
    {
        private readonly dbConnect _db;

        public WithdrawadminController(dbConnect db)
        {
            _db = db;
        }

        [HttpGet]
        public IActionResult Getorder(string? officeid, string? datestart, string? datestop)
        {
            var result = new List<object>();

            using (SqlConnection conn = _db.GetConnection()) // ✅ ใช้ตัวนี้
            {
                conn.Open();

                var sql = new StringBuilder();
                sql.Append(@"SELECT TOP(1000) oc.Orderid, CONVERT(varchar, oc.Orderdate, 103) AS Orderdate, CONVERT(varchar, oc.Orderdate, 108) AS Ordertime,");
                sql.Append(" o.Officename, RTRIM(t.Tname) + '' + RTRIM(p.Fname) + ' ' + RTRIM(p.Lname) AS fullname, oc.Orderstatus, COUNT(od.ID) AS Num, oc.Orderseason");
                sql.Append(" FROM LA_Ordercloth oc");
                sql.Append(" INNER JOIN Office o ON oc.Orderofficeid = o.Officeid");
                sql.Append(" LEFT JOIN LA_Orderdetail od ON od.Orderid = oc.Orderid");
                sql.Append(" LEFT JOIN Personnalite p ON oc.Orderusersend = p.Pid");
                sql.Append(" LEFT JOIN Titlename t ON t.Tid = p.Tname");
                sql.Append(" WHERE oc.Orderdel = '1' AND oc.Orderstatus <= '1'");

                var cmd = new SqlCommand();
                cmd.Connection = conn;

                // 👉 filter วันที่
                if (!string.IsNullOrEmpty(datestart) && !string.IsNullOrEmpty(datestop))
                {
                    DateTime start = Convert.ToDateTime(functionDate.ConvertTodate(datestart));
                    DateTime stop = Convert.ToDateTime(functionDate.ConvertTodate(datestop));

                    sql.Append(" AND oc.Orderdate BETWEEN @start AND @stop ");

                    cmd.Parameters.AddWithValue("@start", start);
                    cmd.Parameters.AddWithValue("@stop", stop);
                }

                sql.Append(@" GROUP BY oc.Orderid, oc.Orderdate, o.Officename, t.Tname,");
                sql.Append(" p.Fname, p.Lname, oc.Orderstatus, oc.Orderseason ORDER BY oc.Orderid DESC");

                cmd.CommandText = sql.ToString();

                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        result.Add(new
                        {
                            Orderid = reader["Orderid"],
                            Orderdate = reader["Orderdate"],
                            Ordertime = reader["Ordertime"],
                            Officename = reader["Officename"],
                            fullname = reader["fullname"],
                            Orderstatus = reader["Orderstatus"],
                            Num = reader["Num"],
                            Orderseason = reader["Orderseason"]
                        });
                    }
                }
            }

            return Ok(result);
        }

        [HttpGet("links")]
        public async Task<IActionResult> GetLinks()
        {
            var result = new List<object>();

            using (SqlConnection conn = _db.GetConnection()) // ✅ ใช้ตัวนี้
            {
                conn.Open();

                var sql = new StringBuilder();
                sql.Append(@"SELECT Officeid, Officename, LA_Str FROM Office");

                var cmd = new SqlCommand();
                cmd.Connection = conn;
                cmd.CommandText = sql.ToString();
                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        result.Add(new
                        {
                            Officeid = reader["Officeid"],
                            Officename = reader["Officename"],
                            LA_Str = reader["LA_Str"],
                        });
                    }
                }
            }

            return Ok(result);
        }


    }
}