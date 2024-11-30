import { employeeAPI } from '@/apis/employeeAPI';
import { CreateEmployeePayrollTurnRequest, EmployeePayrollStatisticsRequest, EmployeePayrollTurnRequestParams, EmployeeTurnRquestParams, payrollTurnAPI } from '@/apis/payrollTurnAPI';
import { EmployeePayrollTurn, PayrollTurnResponse, PayrollTurn, EmployeePayrollTurnResponse, EmployeePayrollStatisticsResponse } from '@/types/payroll';
import { EmployeeType } from '@/types/user';
import { create } from 'zustand';



export type PayrollStore = {
  isLoading?: boolean;
  setLoading?: (loading: boolean) => void;
  employees: EmployeeType[];
  employee: EmployeeType | undefined;
  employeePayrollTurns: EmployeePayrollTurn[];
  getEmployeePayrollTurns: (params: EmployeePayrollTurnRequestParams) => Promise<EmployeePayrollTurnResponse>;
  getEmployeeTurns: (params: EmployeeTurnRquestParams) => Promise<PayrollTurnResponse>;
  deletePayrollTurn: (id: number) => Promise<any>;
  bulkUpdatePayrollTurn: (employeePayrollTurn: EmployeePayrollTurn, payrollTurn: PayrollTurn[]) => Promise<any>;
  getEmployeePayrollDailyTurns: (params: EmployeePayrollTurnRequestParams) => Promise<EmployeePayrollTurn>;
  createEmployeePayrollTurnByDate: (params: CreateEmployeePayrollTurnRequest) => Promise<EmployeePayrollTurn>;
  getEmployeePayrollStatistics: (params: EmployeePayrollStatisticsRequest) => Promise<EmployeePayrollStatisticsResponse>;
};

export const usePayrollStore = create<PayrollStore>((set) => ({
  employees: [],
  employee: undefined,
  employeePayrollTurns: [],
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
  getEmployeePayrollTurns: async (params) => {
    const data = await payrollTurnAPI.getEmployeePayrollTurn(params);
    set({ employeePayrollTurns: data.data });
    return data;
  },
  getEmployeePayrollDailyTurns: async (params) => {
    const data = await payrollTurnAPI.getEmployeePayrollDailyTurns(params);
    return data;
  },
  getEmployeeTurns: async (params) => {
    const data = await payrollTurnAPI.getEmployeeTurns(params);
    return data;
  },
  deletePayrollTurn: async (id) => {
    const data = await payrollTurnAPI.deletePayrollTurn(id);
    return data;
  },
  bulkUpdatePayrollTurn: async (empPayrollTurn, payrollTurn) => {
    try {
      set({ isLoading: true });

      const data = await payrollTurnAPI.bulkUpdatePayrollTurn(empPayrollTurn, payrollTurn);
      return data;

    } catch (error) {
      throw error;
    } finally {
      setTimeout(() => {
        set({ isLoading: false });
      }, 1200);
    }
  },
  createEmployeePayrollTurnByDate: async (params: CreateEmployeePayrollTurnRequest) => {
    const data = await payrollTurnAPI.createEmployeePayrollTurnByDate(params);
    return data;
  },
  getEmployeePayrollStatistics: async (params) => {
    const data = await payrollTurnAPI.getEmployeePayrollStatistics(params);
    return data;
  },

}));