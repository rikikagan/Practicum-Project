using Mng.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mng.Core.IRepositories
{
    public interface IEmployeeRolesRepository
    {
        Task<IEnumerable<EmployeeRoles>> GetListAsync();
        Task<EmployeeRoles> GetByIdAsync(int empRoleId);
        Task<EmployeeRoles> AddAsync(EmployeeRoles empRoleId);

        Task<EmployeeRoles> UpdateAsync(EmployeeRoles empRoleId);

        Task DeleteAsync(int empRoleId);

    }
}
