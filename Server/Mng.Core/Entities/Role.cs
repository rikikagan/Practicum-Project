using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mng.Core.Entities
{
    public class Role
    {
       
        public int Id { get; set; }
        [Required(ErrorMessage = "Role name is required")]
        [StringLength(15, MinimumLength = 3, ErrorMessage = "Role name must be between 3 and 15 characters")]
        public string RoleName { get; set; }

    }
}
