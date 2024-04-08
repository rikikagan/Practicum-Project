using Mng.Core.DTOs;
using Mng.Core.Entities;

namespace Mng.API.Models
{
    public class EmployeeRolePostModel
    {
        public int Id { get; set; }
        public int RoleId { get; set; }
        public DateTime StartDate { get; set; }
        public bool IsManagement { get; set; }
        public int EmployeeId { get; set; }
    }
}
