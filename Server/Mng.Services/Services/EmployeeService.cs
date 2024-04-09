using Mng.Core.Entities;
using Mng.Core.IRepositories;
using Mng.Core.IServices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mng.Service.Services
{
    public class EmployeeService: IEmployeeService
    {
        public readonly IEmployeeRepository _employeeRepository;
        public EmployeeService(IEmployeeRepository employeeRepository)
        {
            _employeeRepository = employeeRepository;
        }
        public async Task<Employee> GetByIdAsync(int empRoleId)
        {
            return await _employeeRepository.GetByIdAsync(empRoleId);
        }
        public async Task<IEnumerable<Employee>> GetListAsync()
        {
            return await _employeeRepository.GetListAsync();
        }
        public async Task<Employee> AddAsync(Employee employee)
        {
            if (!IsValidEmployeeId(employee.TZ))
                throw new Exception("Invalid employee data.");
            if (IsDuplicateEmployeeId(employee.TZ))
                throw new Exception("Employee width the same identity number already exists");
            return await _employeeRepository.AddAsync(employee);
        }

        private bool IsValidEmployeeId(string tz)
        {
            return !string.IsNullOrEmpty(tz) && tz.Length == 9 && int.TryParse(tz, out _);
        }
        private bool IsDuplicateEmployeeId(string tz)
        {
            var existingEmployee = _employeeRepository.GetListAsync().Result.FirstOrDefault(e => e.TZ == tz);
            return existingEmployee != null && existingEmployee.ActivityStatus == true;
        }
        public async Task DeleteAsync(int employeeId)
        {
            await _employeeRepository.DeleteAsync(employeeId);
        }
        public async Task<Employee> UpdateAsync(Employee employee)
        {
            return await _employeeRepository.UpdateAsync(employee);
        }
    }
}
