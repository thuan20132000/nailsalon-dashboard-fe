// employee = models.ForeignKey(
//   Employee,
//   on_delete=models.SET_NULL,
//   null=True,
// )
// date = models.DateField()
// total_price = models.DecimalField(max_digits=10, decimal_places=2)
// created_at = models.DateTimeField(auto_now_add=True)
// updated_at = models.DateTimeField(auto_now=True)

import { EmployeeType } from "./user";

// convert to typescript


export type EmployeePayrollTurn = {
  id: number;
  employee: number | EmployeeType;
  date: Date;
  total_price: string;
  created_at?: Date;
  updated_at?: Date;
  payroll_turns?: PayrollTurn[];
};

export type EmployeePayrollStatisticsResponse = {
  data: EmployeePayrollTurn[];
  date_range_after: string;
  date_range_before: string;
  total_price: number;
};

export type PayrollTurn = {
  id?: number;
  service_name: string;
  price: number;
  employee_payroll_turn: number | EmployeePayrollTurn;
  created_at?: Date;
  updated_at?: Date;
  key?: number;
};

export type PayrollTurnResponse = {
  total: number;
  total_turn_price: number;
  data: PayrollTurn[];
}

export type EmployeePayrollTurnResponse = {
  total: number;
  data: EmployeePayrollTurn[];
  total_price: number;
}


export type PayslipType = {
  id?: number;
  pay_period_start?: string;
  pay_period_end?: string;
  gross_salary?: string;
  net_salary?: string;
  share?: string;
  bonus?: string | null;
  created_at?: Date;
  updated_at?: Date;
  employee?: EmployeeType;
};

export type IncomeType = {
  employee_id?: string;
  employee_name?: string;
  total_income?: number;
  total_deduction?: number;
  net_pay?: number;
  gross_pay?: number;
  pay_period_start?: Date;
  pay_period_end?: Date;
  employee_commission_rate?: number;
  total_tip?: number;
}

