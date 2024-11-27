import { EmployeeType } from '@/types/user';
import axiosInstance from './base';
import { EmployeePayrollStatisticsResponse, EmployeePayrollTurn, EmployeePayrollTurnResponse, IncomeType, PayrollTurn, PayrollTurnResponse } from '@/types/payroll';

export type EmployeePayrollTurnRequestParams = {
  employee?: number;
  date?: string;
  year?: number;
  month?: number;
};

export type EmployeePayrollStatisticsRequest = {
  employee: number;
  date_range_after?: string;
  date_range_before?: string;
};


export type EmployeeTurnRquestParams = {
  employee: number;
  date: any;
};

export type CreateEmployeePayrollTurnRequest = {
  employee?: number;
  date: string;
};


const getEmployeePayrollTurn = async (params: EmployeePayrollTurnRequestParams): Promise<EmployeePayrollTurnResponse> => {
  try {

    const response = await axiosInstance.get('/employee-payroll-turn/', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
};

const createEmployeePayrollTurnByDate = async (data: CreateEmployeePayrollTurnRequest): Promise<EmployeePayrollTurn> => {
  try {

    const response = await axiosInstance.post('/employee-payroll-turn/', data);
    return response.data;
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
};

const getEmployeeTurns = async (params: EmployeeTurnRquestParams): Promise<PayrollTurnResponse> => {
  try {
    const response = await axiosInstance.get(`/payroll-turn/turns/`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
}

const deletePayrollTurn = async (id: number) => {
  try {
    const response = await axiosInstance.delete(`/payroll-turn/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
}

const bulkUpdatePayrollTurn = async (empPayrollTurn: EmployeePayrollTurn, payrollTurn: PayrollTurn[]) => {
  try {
    const response = await axiosInstance.put(`/employee-payroll-turn/${empPayrollTurn.id}/bulk-update-turn/`, payrollTurn);
    return response.data;
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
}

const getEmployeePayrollDailyTurns = async (params: EmployeePayrollTurnRequestParams): Promise<EmployeePayrollTurn> => {
  try {
    const response = await axiosInstance.get('/employee-payroll-turn/daily-turn/', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
}

const getEmployeePayrollStatistics = async (params: EmployeePayrollStatisticsRequest): Promise<EmployeePayrollStatisticsResponse> => {
  try {
    const response = await axiosInstance.get('/employee-payroll-turn/statistics/', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
}
export type EmployeeIncomeRequestParams = {
  employee_ids?: string;
  end_date?: string;
  start_date?: string;
};

const getEmployeeIncome = async (params: EmployeeIncomeRequestParams): Promise<IncomeType[]> => {
  try {
    const response = await axiosInstance.get('/employee-payroll-turn/income/', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
}

export const payrollTurnAPI = {
  getEmployeePayrollTurn,
  getEmployeeTurns,
  deletePayrollTurn,
  bulkUpdatePayrollTurn,
  getEmployeePayrollDailyTurns,
  createEmployeePayrollTurnByDate,
  getEmployeePayrollStatistics,
  getEmployeeIncome
};