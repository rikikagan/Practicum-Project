using Mng.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mng.Core.IServices
{
    public interface IRoleService
    {
        Task<IEnumerable<Role>> GetListAsync();
        Task<Role> GetByIdAsync(int role);
        Task<Role> AddAsync(Role role);

        Task<Role> UpdateAsync(Role role);

        Task DeleteAsync(int roleId);

    }
}
