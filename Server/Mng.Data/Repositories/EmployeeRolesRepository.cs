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
    public class EmployeeRolesRepository : IEmployeeRolesRepository
    {
        private readonly DataContext _context;
        public EmployeeRolesRepository(DataContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<EmployeeRoles>> GetListAsync()
        {
            return await _context.EmployeeRoles.ToListAsync();
        }
        public async Task<EmployeeRoles> GetByIdAsync(int empRoleId)
        {
            return await _context.EmployeeRoles.Include(c => c.Role).Include(c => c.Employee).FirstAsync(c => c.Id == empRoleId);
        }
        public async Task<EmployeeRoles> UpdateAsync(EmployeeRoles empRole)
        {

            var existEmpRole = await GetByIdAsync(empRole.Id);
            if (empRole.StartDate < existEmpRole.Employee.StartDate)
            {
                // Throw an exception or handle the validation error here (e.g., return null)
                throw new ArgumentException("Employee role start date must be after or equal to employee start date");
            }
            _context.Entry(existEmpRole).CurrentValues.SetValues(empRole);
            await _context.SaveChangesAsync();
            return existEmpRole;
        }
        public async Task<EmployeeRoles> AddAsync(EmployeeRoles empRole)
        {
            // בדיקה שהתפקיד לא נבחר פעמיים לאותו עובד
            var existingRole = await _context.EmployeeRoles
                .FirstOrDefaultAsync(er => er.EmployeeId == empRole.EmployeeId && er.RoleId == empRole.RoleId);

            // If such a record exists, throw an exception
            if (existingRole != null)
            {
                throw new ArgumentException("Employee already has a role with the same role");
            }


            // בדיקה שהתאריך של תחילת העבודה של העובד הוא לפני תאריך תחילת העבודה של התפקיד
            var roleStartDate = await _context.EmployeeRoles
                .Where(er => er.EmployeeId == empRole.EmployeeId && er.RoleId == empRole.RoleId)
                .Select(er => er.StartDate)
                .FirstOrDefaultAsync();

            if (roleStartDate != default && empRole.StartDate < roleStartDate)
            {
                throw new ArgumentException("Role start date cannot be before employee start date");
            }
            _context.EmployeeRoles.Add(empRole);
            await _context.SaveChangesAsync();
            return empRole;
        }
        public async Task DeleteAsync(int empRoleId)
        {
            var empRole = await GetByIdAsync(empRoleId);
            _context.EmployeeRoles.Remove(empRole);
            await _context.SaveChangesAsync();
        }
    }
}
