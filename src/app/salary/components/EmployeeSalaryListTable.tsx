'use client';

import React, { useEffect, useState } from 'react';
import { Button, Space, Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import { CalendarFilled, DeleteOutlined, EditOutlined, PayCircleOutlined } from '@ant-design/icons';
import { EmployeeStore, useEmployeeStore } from '@/store/useEmployeeStore';
import { EmployeeType } from '@/types/user';
import { useRouter } from 'next/navigation';

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

const EmployeeSalaryListTable: React.FC = () => {
  const {
    employees,
    getEmployees,
    setEmployees,
    setSelectedEmployees,
    selectedEmployees
  } = useEmployeeStore((state: EmployeeStore) => state);
  const router = useRouter();

  const showEmployeeSalary = (employee: EmployeeType) => {
    console.log('showEmployeeSalary: ', employee);
    router.push(`/salary/payroll-calendar?employee_id=${employee.id}`);

  }

  const showEmployeeDetail = (employee: EmployeeType) => {
    console.log('showEmployeeDetail: ', employee);
    router.push(`/employees/detail?employee_id=${employee.id}`);
    
  }


  const columns: TableProps<EmployeeType>['columns'] = [
    // {
    //   title: 'ID',
    //   dataIndex: 'id',
    //   key: 'id',
    //   render: (text) => <a>{text}</a>,
    // },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => <a onClick={() => showEmployeeDetail(record)}>{text}</a>,
    },
    {
      title: 'Nickname',
      dataIndex: 'nickname',
      key: 'nickname',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Phonenumber',
      dataIndex: 'phone_number',
      key: 'phone_number',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Commission Rate',
      dataIndex: 'commission_rate',
      key: 'commission_rate',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => {
        return (
          <Space size="middle">
            {/* <Button icon={<EditOutlined />} onClick={() => showEmployeeDetail(record)} /> */}
            <Button icon={<CalendarFilled />} onClick={() => showEmployeeSalary(record)} />
            {/* <Button icon={<DeleteOutlined />} /> */}
          </Space>
        )
      }

    },
  ];

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const onSelectChange = (newSelectedRowKeys: React.Key[], data: EmployeeType[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedEmployees(data);
  };

  const rowSelection: TableRowSelection<EmployeeType> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };


  useEffect(() => {
    getEmployees();
    // setEmployees(EMPLOYEES)
  }, [])

  const dataSource = employees.map<EmployeeType>((_, i) => ({
    ..._,
    key: i,
  }));

  return (
    <>
      <Table
        columns={columns}
        dataSource={dataSource}
        rowSelection={rowSelection}
      />
    </>
  )
};

export default EmployeeSalaryListTable;