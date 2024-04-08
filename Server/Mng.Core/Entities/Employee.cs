using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Mng.Core.Entities
{
    public enum Gender
    {
        male=1,female=2
    }
    public class Employee
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "First name is required")]
        public string FirstName { get; set; }

        [Required(ErrorMessage = "Last name is required")]
        public string LastName { get; set; }

        [Required(ErrorMessage = "TZ is required")]
        [MinLength(9, ErrorMessage = "TZ must be 9 characters")]
        [MaxLength(9, ErrorMessage = "TZ must be 9 characters")]
        public string TZ { get; set; }

        [Required(ErrorMessage = "Start date is required")]
        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        [Display(Name = "Start Date")]
        public DateTime StartDate { get; set; }

        [Required(ErrorMessage = "Date of birth is required")]
        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        [Display(Name = "Date of Birth")]
        public DateTime DateOfBirth { get; set; }

        public List<EmployeeRoles> Roles { get; set; }
        [Required(ErrorMessage = "Gender is required")]

        public Gender Gender { get; set; }
        [Required(ErrorMessage = "Activity status is required")]

        public bool ActivityStatus { get; set; }
      
    }
}
