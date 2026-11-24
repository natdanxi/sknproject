using System.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace Laundry.Configs
{
    public class dbConnect
    {
        private readonly string _connectionString;

        public dbConnect(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        // ✅ ต้องมี method นี้
        public SqlConnection GetConnection()
        {
            return new SqlConnection(_connectionString);
        }
    }
}