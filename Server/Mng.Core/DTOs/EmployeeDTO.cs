using Mng.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mng.Core.DTOs
{
    public class EmployeeDTO
    {
        public int Id { get; set; } 
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string TZ { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime DateOfBirth { get; set; }
        public List<EmployeeRoleDTO> Roles { get; set; }
        public Gender Gender { get; set; }
    }
}
