using AutoMapper;
using Mng.API.Models;
using Mng.Core.Entities;


namespace Marketplace.API.Mapping
{
    public class PostModelsMappingProfile : Profile
    {
        public PostModelsMappingProfile()
        {
            CreateMap<RolePostModel, Role>().ReverseMap();
            CreateMap<EmployeePostModel, Employee>().ReverseMap();
            CreateMap<EmployeeRolePostModel, EmployeeRoles>().ReverseMap();

        }
    }
}
