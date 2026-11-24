using System.Globalization;

namespace Laundry.Models
{
    public class functionDate
    {
        public static string ConvertTodate(string inputDate)
        {
            if (string.IsNullOrWhiteSpace(inputDate))
                return null;

            DateTime date;

            // ลอง parse แบบปกติ (ค.ศ.)
            if (DateTime.TryParseExact(inputDate, "dd/MM/yyyy",
                CultureInfo.InvariantCulture,
                DateTimeStyles.None, out date))
            {
                // ถ้าปี > 2400 ให้ถือว่าเป็น พ.ศ.
                if (date.Year > 2400)
                {
                    date = date.AddYears(-543);
                }

                return date.ToString("dd/MM/yyyy");
            }

            return null; // parse ไม่ได้
        }
    }
}
