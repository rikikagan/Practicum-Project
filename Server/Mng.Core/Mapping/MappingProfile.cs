using AutoMapper;
using Mng.Core.DTOs;
using Mng.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mng.Core.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Employee, EmployeeDTO>().ReverseMap();
            CreateMap<EmployeeRoles, EmployeeRoleDTO>().ReverseMap();
            CreateMap<Role, RoleDTO>().ReverseMap();
        }
    }
}
