using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Mng.API.Models;
using Mng.Core;
using Mng.Core.DTOs;
using Mng.Core.Entities;
using Mng.Core.IServices;
using Mng.Service.Services;
using System.Collections;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Mng.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeesController : ControllerBase
    {
        private readonly IEmployeeService _employeeService;
        private readonly IMapper _mapper;

        public EmployeesController(IEmployeeService employeeService, IMapper mapper)
        {
            _employeeService = employeeService;
            _mapper = mapper;
        }
        [HttpGet]
        public async Task<ActionResult> Get()
        {
            var employeeList = await _employeeService.GetListAsync();
            var filteredList = employeeList.Where(e => e.ActivityStatus == true); // סינון רק לעובדים שהמשתנה ActivityStatus שלהם true
            var listDTO = _mapper.Map<IEnumerable<EmployeeDTO>>(filteredList);
            return Ok(listDTO);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> Get(int id)
        {
            var employee = await _employeeService.GetByIdAsync(id);

            // בדיקה שהעובד קיים ושה-ActivityStatus שלו שווה ל־true
            if (employee == null || employee.ActivityStatus == false)
            {
                return NotFound();
            }

            return Ok(_mapper.Map<EmployeeDTO>(employee));
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] EmployeePostModel model)
        {
            var newEmployee = await _employeeService.AddAsync(_mapper.Map<Employee>(model));
            return Ok(_mapper.Map<EmployeeDTO>(newEmployee));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] EmployeePostModel model)
        {
            var employee = await _employeeService.GetByIdAsync(id);
            if (employee is null)
            {
                return NotFound();
            }
            _mapper.Map(model, employee);
            await _employeeService.UpdateAsync(employee);
            employee = await _employeeService.GetByIdAsync(id);
            return Ok(_mapper.Map<EmployeeDTO>(employee));

        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var employee = await _employeeService.GetByIdAsync(id);
            if (employee is null)
            {
                return NotFound();
            }

            // שינוי הערך של ActivityStatus ל־false
            employee.ActivityStatus = false;

            await _employeeService.UpdateAsync(employee); // עדכון העובד בבסיס הנתונים עם הערך החדש של ActivityStatus
            return NoContent();
        }
    }
}
