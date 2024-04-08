using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Mng.API.Models;
using Mng.Core.DTOs;
using Mng.Core.Entities;
using Mng.Core.IServices;
using Mng.Service.Services;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Mng.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeRoleController : ControllerBase
    {
        private readonly IEmployeeRolesService _employeeRolesService;
        public readonly IMapper _mapper;
        public EmployeeRoleController(IEmployeeRolesService employeeRolesService, IMapper mapper)
        {
            _employeeRolesService = employeeRolesService;
            _mapper = mapper;
        }
        [HttpGet]
        public async Task<ActionResult> Get()
        {
            var empRoleList = await _employeeRolesService.GetListAsync();
            var listDTO = _mapper.Map<IEnumerable<EmployeeRoleDTO>>(empRoleList);
            return Ok(listDTO);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> Get(int id)
        {
            var eRole = await _employeeRolesService.GetByIdAsync(id);
            return Ok(_mapper.Map<EmployeeRoleDTO>(eRole));
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] EmployeeRolePostModel model)
        {
            var newEmpRole = await _employeeRolesService.AddAsync(_mapper.Map<EmployeeRoles>(model));
            return Ok(_mapper.Map<EmployeeRoleDTO>(newEmpRole));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] EmployeeRolePostModel model)
        {
            var empRole = await _employeeRolesService.GetByIdAsync(id);
            if (empRole is null)
            {
                return NotFound();
            }
            _mapper.Map(model, empRole);
            await _employeeRolesService.UpdateAsync(empRole);
            empRole = await _employeeRolesService.GetByIdAsync(id);
            return Ok(_mapper.Map<EmployeeRoleDTO>(empRole));

        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var empRole = await _employeeRolesService.GetByIdAsync(id);
            if (empRole is null)
            {
                return NotFound();
            }
            await _employeeRolesService.DeleteAsync(id);
            return NoContent();     
        }
    }
}
