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
    public class RoleRepository : IRoleRepository
    {
        private readonly DataContext _context;

        public RoleRepository(DataContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<Role>> GetListAsync()
        {
            return await _context.Roles.ToListAsync();
        }
        public async Task<Role> GetByIdAsync(int roleId)
        {
            return await _context.Roles.FirstAsync(c => c.Id == roleId);
        }
        public async Task<Role> UpdateAsync(Role role)
        {
            var existRole = await GetByIdAsync(role.Id);
            _context.Entry(existRole).CurrentValues.SetValues(existRole);
            await _context.SaveChangesAsync();
            return existRole;
        }
        public async Task<Role> AddAsync(Role role)
        {
            _context.Roles.Add(role);
            await _context.SaveChangesAsync();
            return role;
        }

        public async Task DeleteAsync(int roleId)
        {
            var role = await GetByIdAsync(roleId);
            _context.Roles.Remove(role);
            await _context.SaveChangesAsync();
        }
    }
}
