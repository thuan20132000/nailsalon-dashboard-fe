'use client';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { GetRef, InputNumberProps, InputRef, StatisticProps, TableProps } from 'antd';
import { Button, Col, DatePicker, Flex, Form, Input, InputNumber, Popconfirm, Row, Space, Statistic, Table, Typography } from 'antd';
import dayjs from 'dayjs';
import { useSearchParams } from 'next/navigation';
import { PayrollStore, usePayrollStore } from '@/store/usePayrollStore';
import { EmployeePayrollTurn, PayrollTurn } from '@/types/payroll';
import { DeleteFilled, DeleteOutlined } from '@ant-design/icons';
type FormInstance<T> = GetRef<typeof Form<T>>;

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  key: string;
  turn: number;
  service: string;
  price: number;
}

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();

      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[{ required: true, message: `${title} is required.` }]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingInlineEnd: 24 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

interface DataType {
  key: React.Key;
  turn?: number;
  service: string;
  price: number;
}

type ColumnTypes = Exclude<TableProps<PayrollTurn>['columns'], undefined>;

const generateData = (): DataType[] => {
  const services = [''];

  return Array.from({ length: 20 }, (_, index) => ({
    key: index, // You can use a unique key generator as per your requirement
    turn: index + 1,
    service: services[index % services.length], // Cycling through services
    price: 0 // Random price between 10 and 109
  }));
};
const DEFAULT_TURN: DataType[] = generateData()

const PayrollTable: React.FC = () => {
  const [form] = Form.useForm();
  const [total, setTotal] = useState(0);
  const dateFormat = 'YYYY/MM/DD';
  const searchParams = useSearchParams()
  const turn_date = searchParams.get('date')
  const employee_id = searchParams.get('employee')
  const [employeeDateTurn, setEmployeeDateTurn] = useState<EmployeePayrollTurn>()

  const [totalTurnPrice, setTotalTurnPrice] = useState(0)

  const { getEmployeeTurns, getEmployeePayrollDailyTurns, getEmployeePayrollTurns, deletePayrollTurn, bulkUpdatePayrollTurn } = usePayrollStore((state: PayrollStore) => state)

  const [dataSource, setDataSource] = useState<PayrollTurn[]>([]);


  const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [

    {
      title: 'Turn',
      dataIndex: 'turn',
      width: '10%',
      render: (_, record, index) => <a href="">{Number(index) + 1}</a>
    },
    {
      title: 'Service',
      dataIndex: 'service_name',
      editable: true,
      width: '30%'
    },
    {
      title: 'Price',
      dataIndex: 'price',
      editable: true,
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDeleteRow(record)}>
            <DeleteFilled style={{ color: 'red' }} />
          </Popconfirm>
        ) : null,
      width: '15%'
    },
  ];


  const handleDeleteRow = (row: PayrollTurn) => {
    const newData = [...dataSource];
    if (row.id) {
      deletePayrollTurn(Number(row.id))
        .then(() => {
          setDataSource(newData.filter((item) => item.key != row.key));
        })
    } else {
      setDataSource(newData.filter((item) => item.key != row.key));
    }

  }

  const handleAddRow = () => {
    const newRow: PayrollTurn = {
      service_name: '',
      price: 0,
      employee_payroll_turn: Number(employee_id),
      key: dataSource.length
    };
    setDataSource([...dataSource, newRow]);
  };

  const handleUpdate = () => {
    console.log('====================================');
    console.log('dataSource: ', dataSource);
    console.log('====================================');
    if (employeeDateTurn) {
      bulkUpdatePayrollTurn(employeeDateTurn, dataSource)
        .then((res) => {
          console.log('====================================');
          console.log('bulkUpdatePayrollTurn: ', res);
          console.log('================================');
        })
    }

  }

  const getTotalTurnPrice = useCallback(() => {
    let total = 0
    total = dataSource?.map((e) => Number(e.price)).reduce((prev, cur) => Number(prev) + Number(cur), 0)
    setTotal(total)
    setTotalTurnPrice(total)
    return total
  }, [dataSource])

  const handleSave = (row: PayrollTurn) => {
    const newData = [...dataSource];
    const newDataSource = newData.map((item) => {
      if (item.key == row.key) {
        return row
      }
      return item
    });
    setDataSource(newDataSource);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: PayrollTurn,) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  useEffect(() => {
    getEmployeePayrollDailyTurns({
      employee: Number(employee_id),
      date: turn_date || undefined
    })
      .then((res) => {
        console.log('getEmployeeTurns: ', res);
        setTotalTurnPrice(Number(res.total_price))
        setEmployeeDateTurn(res)
        let data = res?.payroll_turns?.map((item, index) => {
          return {
            ...item,
            key: index
          }
        })
        setDataSource(data || [])
      })
  }, [turn_date, employee_id])


  return (
    <Form form={form} component={false}>
      <Flex className='mb-2'>
        <Flex>
          <DatePicker defaultValue={dayjs(turn_date, dateFormat)} format={dateFormat} disabled />
          {/* <Statistic
            value={totalTurnPrice}
            title='Total: '
            style={{ flex: 1, display: 'flex', alignItems: 'center', paddingLeft: 20 }}
            valueStyle={{ paddingLeft: 10 }}
          /> */}
        </Flex>
      </Flex>
      <Table<PayrollTurn>
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={dataSource}
        columns={columns as ColumnTypes}
        pagination={false}
        footer={
          () => (
            <Row>
              <Col span={12}>
                <Space>
                  <Button onClick={handleAddRow} >
                    Add a row
                  </Button>
                  <Button onClick={handleUpdate} >
                    Update
                  </Button>
                </Space>
              </Col>
              <Col span={12}>
                <Statistic
                  title='Total'
                  value={getTotalTurnPrice()}
                  precision={2}
                  valueStyle={{ color: '#cf1322' }}
                />
              </Col>
            </Row>
          )
        }
      />
    </Form>
  );
};

export default PayrollTable;