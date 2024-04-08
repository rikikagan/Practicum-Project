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
    public class RoleService: IRoleService
    {
        public readonly IRoleRepository _roleRepository;

        public RoleService(IRoleRepository roleRepository)
        {
            _roleRepository = roleRepository;
        }
        public async Task<Role> GetByIdAsync(int RoleId)
        {
            return await _roleRepository.GetByIdAsync(RoleId);
        }
        public async Task<IEnumerable<Role>> GetListAsync()
        {
            return await _roleRepository.GetListAsync();
        }
        public async Task<Role> AddAsync(Role role)
        {
            return await _roleRepository.AddAsync(role);
        }

        public async Task DeleteAsync(int roleId)
        {
            await _roleRepository.DeleteAsync(roleId);
        }
        public async Task<Role> UpdateAsync(Role role)
        {
            return await _roleRepository.UpdateAsync(role);
        }

    }
}
