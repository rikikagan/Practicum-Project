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
    public class RoleController : ControllerBase
    {
        private readonly IRoleService _roleService;
        public readonly IMapper _mapper;

        public RoleController(IRoleService roleService,IMapper mapper)
        {
            _roleService = roleService;
            _mapper = mapper;
        }
        // GET: api/<RoleController>
        [HttpGet]
        public async Task<ActionResult> Get()
        {
            var roleList = await _roleService.GetListAsync();
            var listDTO = _mapper.Map<IEnumerable<RoleDTO>>(roleList);
            return Ok(listDTO);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> Get(int id)
        {
            var role = await _roleService.GetByIdAsync(id);
            return Ok(_mapper.Map<RoleDTO>(role));
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] RolePostModel model)
        {
            var newRole = await _roleService.AddAsync(_mapper.Map<Role>(model));
            return Ok(_mapper.Map<RoleDTO>(newRole));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] RolePostModel model)
        {
            var role = await _roleService.GetByIdAsync(id);
            if (role is null)
            {
                return NotFound();
            }
            _mapper.Map(model, role);
            await _roleService.UpdateAsync(role);
            role = await _roleService.GetByIdAsync(id);
            return Ok(_mapper.Map<RoleDTO>(role));

        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var role = await _roleService.GetByIdAsync(id);
            if (role is null)
            {
                return NotFound();
            }
            await _roleService.DeleteAsync(id);
            return NoContent();
        }
    }
}

