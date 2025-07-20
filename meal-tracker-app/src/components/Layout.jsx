import React from 'react'
import { Layout as AntLayout, Menu, Button, Avatar, Dropdown, Alert } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  DashboardOutlined, 
  ShoppingOutlined, 
  CoffeeOutlined, 
  UserOutlined,
  LogoutOutlined 
} from '@ant-design/icons'
import { signOut } from '../services/supabase'

const { Header, Content } = AntLayout

const Layout = ({ children, user }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/ingredients',
      icon: <ShoppingOutlined />,
      label: 'Ingredients',
    },
    {
      key: '/meals',
      icon: <CoffeeOutlined />,
      label: 'Meals',
    },
  ]

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: async () => {
        await signOut()
        navigate('/login')
      },
    },
  ]

  const handleMenuClick = ({ key }) => {
    navigate(key)
  }

  return (
    <AntLayout className="layout-container">
      <Header className="layout-header">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          height: '100%'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h1 style={{ 
              color: '#1890ff', 
              margin: 0, 
              marginRight: 48,
              fontSize: '20px',
              fontWeight: 'bold'
            }}>
              Meal Tracker
            </h1>
            <Menu
              mode="horizontal"
              selectedKeys={[location.pathname]}
              items={menuItems}
              onClick={handleMenuClick}
              style={{ 
                border: 'none', 
                backgroundColor: 'transparent',
                lineHeight: '64px'
              }}
            />
          </div>
          
          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            arrow
          >
            <Button 
              type="text" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 8,
                height: 'auto',
                padding: '8px 12px'
              }}
            >
              <Avatar 
                size="small" 
                src={user?.user_metadata?.avatar_url}
                icon={<UserOutlined />}
              />
              <span>{user?.user_metadata?.full_name || user?.email}</span>
            </Button>
          </Dropdown>
        </div>
      </Header>
      
      <Content className="layout-content">
        {children}
      </Content>
    </AntLayout>
  )
}

export default Layout 