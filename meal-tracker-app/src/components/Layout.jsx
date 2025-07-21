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
      label: 'Dashboard',
    },
    {
      key: '/ingredients',
      label: 'Ingredients',
    },
    {
      key: '/meals',
      label: 'Meals',
    },
  ]

  const userMenuItems = [
    {
      key: 'profile',
      label: 'Profile',
    },
    {
      key: 'logout',
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
      <Header className="layout-header" style={{ position: 'sticky', top: 0, zIndex: 100, width: '100%' }}>
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
              Grocery Tracker
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
            trigger={['click']}
            overlayStyle={{ marginTop: -4 }}
          >
            <Button 
              type="text" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 8,
                height: 'auto',
                padding: '8px 12px',
                background: 'none',
                boxShadow: 'none',
                outline: 'none',
                border: 'none',
                transition: 'none',
              }}
            >
              <Avatar 
                size="small" 
                src={user?.user_metadata?.avatar_url}
                style={{ backgroundColor: '#1890ff', color: '#fff', fontWeight: 600 }}
              >
                {user?.user_metadata?.full_name
                  ? user.user_metadata.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2)
                  : user?.email?.[0]?.toUpperCase()}
              </Avatar>
              <span>{user?.user_metadata?.full_name || user?.email}</span>
              <span style={{ fontSize: 12, marginLeft: 4, color: '#888' }}>▼</span>
            </Button>
          </Dropdown>
        </div>
      </Header>
      
      <Content className="layout-content">
        {children}
      </Content>
      <style>{`
        .ant-btn-text:hover, .ant-btn-text:focus {
          background: none !important;
          color: inherit !important;
          text-decoration: none !important;
        }
      `}</style>
    </AntLayout>
  )
}

export default Layout 