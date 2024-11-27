import { UserOutlined } from '@ant-design/icons'
import { Avatar, Space } from 'antd'
import React from 'react'

type Props = {}

const UserAvatar = (props: Props) => {
  return (
    <Space className='bg-slate-400 border-r-form-input'>
      <Avatar size={22} icon={<UserOutlined />} />
      <h2>Name</h2>
    </Space>
  )
}

export default UserAvatar