import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Space, Table, Tag, Drawer, Statistic, Flex, DatePicker, Card } from 'antd';
import type { TableProps } from 'antd';
import { EmployeeType } from '@/types/user';
import { IncomeType } from '@/types/payroll';
import { EmployeeIncomeRequestParams, payrollTurnAPI } from '@/apis/payrollTurnAPI';
import { EditOutlined, PrinterFilled, SaveFilled } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import { EmployeeStore } from '../../../store/useEmployeeStore';
import { useRouter } from 'next/navigation';

const { RangePicker } = DatePicker;

type Props = {}

const ShowSalariesDrawer = (props: Props) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [childrenDrawer, setChildrenDrawer] = useState(false);
  const [salaries, setSalaries] = useState<IncomeType[]>([]);
  const { selectedEmployees } = useEmployeeStore((state: EmployeeStore) => state);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const showChildrenDrawer = () => {
    setChildrenDrawer(true);
  };

  const onChildrenDrawerClose = () => {
    setChildrenDrawer(false);
  };

  const showEmployeePayroll = (employee: EmployeeType) => {
    router.push(`/salary/payroll-calendar?employee_id=${employee.id}`);
  }

  const columns: TableProps<IncomeType>['columns'] = [
    // {
    //   title: 'ID',
    //   dataIndex: 'employee_id',
    //   key: 'employee_id',
    //   render: (text) => <a>{text}</a>,
    // },
    {
      title: 'Name',
      dataIndex: 'employee__name',
      key: 'employee__name',
    },
    {
      title: 'Commission Rate',
      dataIndex: 'employee__commission_rate',
      key: 'employee__commision_rate',
      className:'text-sm',
    },
    {
      title: 'Gross Pay',
      dataIndex: 'gross_pay',
      key: 'gross_pay',
      render: (text) => <Statistic value={text} precision={2} valueStyle={{ fontSize: 14 }} />,

    },
    {
      title: 'Net Pay',
      dataIndex: 'net_pay',
      key: 'net_pay',
      render: (text) => <Statistic value={text} precision={2} valueStyle={{ fontSize: 14 }} />,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => {
        return (
          <Space size="middle">
            <Button icon={<PrinterFilled />} />
            <Button icon={<EditOutlined />}
              onClick={() => showEmployeePayroll({
                id: Number(record?.employee_id)
              })}
            />
            <Button icon={<SaveFilled />} />

          </Space>
        )
      }

    },
  ];


  const getEmployeeIncome = async () => {
    try {

      let employeeIds = selectedEmployees?.map((employee: EmployeeType) => employee.id).join(',');
      let params: EmployeeIncomeRequestParams = {
        employee_ids: employeeIds,
        start_date: salaryDateRange?.start_date,
        end_date: salaryDateRange?.end_date
      }
      const res = await payrollTurnAPI.getEmployeeIncome(params);
      setSalaries(res);
      console.log(res);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  }

  const [salaryDateRange, setSalaryDateRange] = useState<{ start_date: string | undefined, end_date: string | undefined } | undefined>(undefined);

  const onChangeSalaryDateRange = (dates: any, dateStrings: [string, string]) => {
    console.log('onChangeSalaryDateRange: ', dates, dateStrings);
    if (dateStrings[0] === '' || dateStrings[1] === '') {
      setSalaryDateRange({
        start_date: undefined,
        end_date: undefined
      });

      return;
    }
    setSalaryDateRange({
      start_date: dateStrings[0],
      end_date: dateStrings[1]
    });
  }

  useEffect(() => {
    if (open) {
      getEmployeeIncome()
    } else {
      setSalaries([])
    }

  }, [open, salaryDateRange])

  const getTotalGrossPay = useMemo(() => {
    return salaries.reduce((acc, salary) => acc + Number(salary?.gross_pay), 0).toFixed(2);
  }, [salaries])

  const getTotalNetPay = useMemo(() => {
    return salaries.reduce((acc, salary) => acc + Number(salary?.net_pay), 0).toFixed(2);
  }, [salaries])

  const getRevenue = useMemo(() => {
    let revenue = Number(getTotalGrossPay) - Number(getTotalNetPay);
    return revenue.toFixed(2);
  }, [salaries])

  const onChangeSalaryWeekRange = (dates: any, dateStrings: [string, string]) => {
    console.log('onChangeSalaryWeekRange: ', dates, dateStrings);
    let start_date = dates[0];
    let end_date = dates[1];

    setSalaryDateRange({
      start_date: dayjs(start_date).format('YYYY-MM-DD'),
      end_date: dayjs(end_date).format('YYYY-MM-DD')
    });

  }

  const printTable = () => {
    console.log('print table');
    window.print();
  }


  return (
    <div>
      <Flex>
        <RangePicker
          className="mr-2"
          onChange={onChangeSalaryDateRange}
          value={[dayjs(salaryDateRange?.start_date), dayjs(salaryDateRange?.end_date)]}
        />
        <Button onClick={showDrawer}>
          Show Salaries
        </Button>
      </Flex>
      <Drawer
        width={'80%'} closable={false} onClose={onClose} open={open}
      >
        <Flex className='mb-2 justify-end'>
          <RangePicker
            className="mr-2"
            onChange={onChangeSalaryDateRange}
            value={[dayjs(salaryDateRange?.start_date), dayjs(salaryDateRange?.end_date)]}
          />
          {/* <RangePicker onChange={onChangeSalaryWeekRange} picker="week"
            value={[dayjs(salaryDateRange?.start_date), dayjs(salaryDateRange?.end_date)]}
          /> */}

        </Flex>

        <Table
          columns={columns}
          rowClassName={'cursor-pointer hover:bg-gray-100 hover:shadow-lg'}
          dataSource={salaries}
          footer={() => (
            <Flex flex={1} justify='space-around'>
              <Statistic
                title="Total Gross"
                value={getTotalGrossPay}
                precision={2}
                valueStyle={{ fontSize: 18, fontWeight: "bold" }}
                prefix="$"
              />
              <Statistic
                title="Total Net"
                value={getTotalNetPay}
                precision={2} valueStyle={{ fontSize: 18, fontWeight: "bold" }}
                prefix="$"

              />
              <Statistic
                title="Revenue"
                value={getRevenue}
                precision={2}
                valueStyle={{ fontSize: 18, fontWeight: "bold" }}
                prefix="$"
              />
              <Button onClick={printTable}>Print</Button>
            </Flex>
          )}
          pagination={false}
        />
        {/* <Button onClick={showChildrenDrawer}>
          Two-level drawer
        </Button>
        <Drawer
          title="Two-level Drawer"
          width={320}
          closable={false}
          onClose={onChildrenDrawerClose}
          open={childrenDrawer}
        >
          This is two-level drawer
        </Drawer> */}
      </Drawer>
    </div>
  )
}

export default ShowSalariesDrawer