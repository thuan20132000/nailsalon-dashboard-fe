import { employeeAPI } from '@/apis/employeeAPI';
import { EmployeeType } from '@/types/user';
import { create } from 'zustand';



export type EmployeeStore = {
  employees: EmployeeType[];
  employee: EmployeeType | undefined;
  addEmployee: (employee: Omit<EmployeeType, 'id'>) => Promise<void>;
  removeEmployee: (id: number) => void;
  updateEmployee: (employee: EmployeeType) => Promise<EmployeeType>;
  getEmployees: () => Promise<EmployeeType[]>;
  setEmployees: (employees: EmployeeType[]) => void;
  getEmployeeById: (id: number) => Promise<EmployeeType>;
  selectedEmployees?: EmployeeType[];
  setSelectedEmployees: (employees: EmployeeType[]) => void;
};

export const useEmployeeStore = create<EmployeeStore>((set) => ({
  employees: [],
  employee: undefined,
  selectedEmployees: [],
  addEmployee: async (employee) => {
    const newEmployee = await employeeAPI.createEmployee(employee);
    set((state) => ({ employees: [...state.employees, newEmployee] }));
  },
  removeEmployee: (id) => set((state) => ({ employees: state.employees.filter(employee => employee.id !== id) })),
  updateEmployee: async (employee: EmployeeType): Promise<EmployeeType> => {
    // employees: state.employees.map(employee => employee.id === updatedEmployee.id ? updatedEmployee : employee)
    if (!employee.id) {
      throw new Error('Employee id is required');
    }

    const updatedEmployee = await employeeAPI.updateEmployeeById(employee.id, employee);
    console.log('updatedEmployee: ', updatedEmployee);
    return updatedEmployee

  },
  getEmployees: async (): Promise<EmployeeType[]> => {
    const data = await employeeAPI.getEmployees();
    console.log('getEmployees: ', data);

    set({ employees: data });
    return data;
  },
  getEmployeeById: async (id: number): Promise<EmployeeType> => {
    const data = await employeeAPI.getEmployeeById(id);
    console.log('getEmployeeById: ', data);
    set({ employee: data });
    return data;
  },
  setEmployees: (employees: EmployeeType[]) => set({ employees }),
  setSelectedEmployees: (employees) => set({ selectedEmployees: employees }),
}));