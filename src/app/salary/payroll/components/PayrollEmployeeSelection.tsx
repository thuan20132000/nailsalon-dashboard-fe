import React, { useEffect, useState } from 'react'
import { Select } from 'antd';
import type { SelectProps } from 'antd';
import { EmployeeType } from '@/types/user';
import { EmployeeStore, useEmployeeStore } from '@/store/useEmployeeStore';

type Props = {
  initialEmployee?: EmployeeType
  onChange?: (employee: EmployeeType) => void
}

const EmployeeSelection = (props: Props) => {
  const {
    employees,
  } = useEmployeeStore((state: EmployeeStore) => state);
  const [employeeData, setEmployeeData] = useState<SelectProps['options']>([]);
  const [value, setValue] = useState<string>();
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeType>();

  const handleSearch = (newValue: string) => {

  };

  const handleChange = (newValue: string) => {
    setValue(newValue);
    if(props.onChange){
      props.onChange({id: Number(newValue)});
    }
  };

  useEffect(() => {
    setEmployeeData(employees.map((employee) => ({
      value: employee.id,
      text: employee.name,
    })));

  }, [props.initialEmployee])

  const getDefaultNameValue = () => {
    let employee: EmployeeType | undefined;
    if (props.initialEmployee?.id) {
      employee = employees?.find((item) => item.id === props.initialEmployee?.id)
    }
    return employee?.name;
  }

  return (
    <div className='ml-6'>
      <Select
        value={value}
        defaultValue={getDefaultNameValue()}

        // placeholder={props.placeholder}
        // style={props.style}
        defaultActiveFirstOption={false}
        suffixIcon={null}
        filterOption={false}
        // onSearch={handleSearch}
        onChange={handleChange}
        notFoundContent={null}
        options={(employeeData || []).map((d) => ({
          value: d.value,
          label: d.text,
        }))}
        style={{
          minWidth: '200px',
        }}
      />
    </div>
  )
}

export default EmployeeSelection