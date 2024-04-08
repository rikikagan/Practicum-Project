using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mng.Core.Entities
{
    public class EmployeeRoles
    { 
        public int Id { get; set; }
        public int RoleId { get; set; }
        [Required(ErrorMessage = "Role is required")]
        public Role? Role { get; set; }
        [Required(ErrorMessage = "Start date is required")]
        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        public DateTime StartDate { get; set; }
        public bool IsManagement { get; set; }
        [Required(ErrorMessage = "Employee is required")]
        //private Employee Employee;
        public int EmployeeId { get; set; }
        public Employee Employee { get; set; }
    }
}
