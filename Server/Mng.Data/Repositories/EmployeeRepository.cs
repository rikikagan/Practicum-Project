using Microsoft.EntityFrameworkCore;
using Mng.Core.Entities;
using Mng.Core.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mng.Data.Repositories
{
    public class EmployeeRepository : IEmployeeRepository
    {
        private readonly DataContext _context;

        public EmployeeRepository(DataContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<Employee>> GetListAsync()
        {
            return await _context.Employees.Include(e => e.Roles).ThenInclude(j => j.Role).ToListAsync();
        }
        public async Task<Employee> GetByIdAsync(int empRoleId)
        {
            return await _context.Employees.Include(e=>e.Roles).ThenInclude(j=>j.Role).FirstAsync(c => c.Id == empRoleId);
        }

        public async Task<Employee> UpdateAsync(Employee employee)
        {
            var existEmployee = await GetByIdAsync(employee.Id);
            _context.Entry(existEmployee).CurrentValues.SetValues(existEmployee);
            await _context.SaveChangesAsync();
            return existEmployee;
        }
        public async Task<Employee> AddAsync(Employee employee)
        {
            employee.ActivityStatus = true;
            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();
            return employee;
        }

        public async Task DeleteAsync(int employeeId)
        {
            var employee = await GetByIdAsync(employeeId);
            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();
        }
    }
}
