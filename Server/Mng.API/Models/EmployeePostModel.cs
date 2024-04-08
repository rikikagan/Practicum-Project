using Mng.Core.DTOs;
using Mng.Core.Entities;

namespace Mng.API.Models
{
    public class EmployeePostModel
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string TZ { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime DateOfBirth { get; set; }
        //public List<EmployeeRoleDTO> Roles { get; set; }
        public Gender Gender { get; set; }
       
    }
}
