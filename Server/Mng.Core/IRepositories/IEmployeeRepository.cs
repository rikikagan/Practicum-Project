using Mng.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mng.Core.IRepositories
{
    public interface IEmployeeRepository
    {
        Task<IEnumerable<Employee>> GetListAsync();
        Task<Employee> GetByIdAsync(int employeeId);

        Task<Employee> AddAsync(Employee employee);

        Task<Employee> UpdateAsync(Employee employee);

        Task DeleteAsync(int employeeId);

    }
}
