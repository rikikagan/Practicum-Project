using Mng.Core.Entities;
using Mng.Core.IRepositories;
using Mng.Core.IServices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Transactions;

namespace Mng.Service.Services
{
    public class EmployeeRolesService: IEmployeeRolesService
    {
        public readonly IEmployeeRolesRepository _empRoleRepository;
        public EmployeeRolesService(IEmployeeRolesRepository empRoleRepository)
        {
            _empRoleRepository = empRoleRepository;
        }
        public async Task<EmployeeRoles> GetByIdAsync(int empRoleId)
        {
            return await _empRoleRepository.GetByIdAsync( empRoleId );
        }
        public async Task<IEnumerable<EmployeeRoles>> GetListAsync()
        {
            return await _empRoleRepository.GetListAsync();
        }
        public async Task<EmployeeRoles> AddAsync(EmployeeRoles empRole)
        {
            return await _empRoleRepository.AddAsync(empRole);
        }

        public async Task DeleteAsync(int empRoleId)
        {
            await _empRoleRepository.DeleteAsync(empRoleId);
        }
        public async Task<EmployeeRoles> UpdateAsync(EmployeeRoles empRole)
        {
            return await _empRoleRepository.UpdateAsync(empRole);
        }
    }
}
