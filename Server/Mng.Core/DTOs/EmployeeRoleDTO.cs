using Mng.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Mng.Core.DTOs
{
    public class EmployeeRoleDTO
    {
        public int Id { get; set; }
        public int RoleId { get; set; }
        public DateTime StartDate { get; set; }
        public bool IsManagement { get; set; }
        public int EmployeeId { get; set; }
    }
}
