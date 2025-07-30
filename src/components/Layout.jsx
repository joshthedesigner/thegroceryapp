import React, { useState, useEffect } from 'react'
import { Layout as AntLayout, Menu, Button, Avatar, Dropdown, Drawer, Badge } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  DashboardOutlined, 
  ShoppingOutlined, 
  CoffeeOutlined, 
  UserOutlined,
  LogoutOutlined,
  MenuOutlined,
  CloseOutlined
} from '@ant-design/icons'
import { signOut } from '../services/supabase'

const { Header, Content, Footer } = AntLayout

const Layout = ({ children, user }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check screen size on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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
    setMobileMenuOpen(false) // Close mobile menu after navigation
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <AntLayout className="layout-container">
      <Header className="layout-header" style={{ position: 'sticky', top: 0, zIndex: 100, width: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          height: '100%'
        }}>
          {/* Logo and Desktop Menu */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h1 style={{ 
              color: '#1890ff', 
              margin: 0, 
              marginRight: isMobile ? 16 : 48,
              fontSize: isMobile ? '18px' : '20px',
              fontWeight: 'bold'
            }}>
              Grocery Tracker
            </h1>
            
            {/* Desktop Menu - Hidden on Mobile */}
            {!isMobile && (
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
            )}
          </div>
          
          {/* Desktop User Menu */}
          {!isMobile && (
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
          )}

          {/* Mobile Hamburger Menu Button */}
          {isMobile && (
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={toggleMobileMenu}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                padding: 0,
                background: 'none',
                border: 'none',
                color: '#666',
                fontSize: '18px'
              }}
            />
          )}
        </div>
      </Header>
      
      {/* Mobile Drawer Menu */}
      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <h2 style={{ margin: 0, color: '#1890ff', fontSize: '18px' }}>
              Grocery Tracker
            </h2>
          </div>
        }
        placement="right"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        width={280}
        styles={{
          body: { padding: 0 },
          header: { padding: '16px 24px', borderBottom: '1px solid #f0f0f0' }
        }}
        closeIcon={<CloseOutlined style={{ fontSize: '16px' }} />}
      >
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          height: '100%',
          padding: '16px 0'
        }}>
          {/* Mobile Navigation Menu */}
          <div style={{ flex: 1 }}>
            <Menu
              mode="vertical"
              selectedKeys={[location.pathname]}
              items={menuItems}
              onClick={handleMenuClick}
              style={{
                border: 'none',
                backgroundColor: 'transparent'
              }}
              className="mobile-menu"
            />
          </div>
          
          {/* Mobile User Section - Sticky at Bottom */}
          <div style={{ 
            padding: '16px 24px', 
            borderTop: '1px solid #f0f0f0',
            backgroundColor: '#fafafa',
            marginTop: 'auto'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 12, 
              marginBottom: 16 
            }}>
              <Avatar 
                size="default" 
                src={user?.user_metadata?.avatar_url}
                style={{ backgroundColor: '#1890ff', color: '#fff', fontWeight: 600 }}
              >
                {user?.user_metadata?.full_name
                  ? user.user_metadata.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2)
                  : user?.email?.[0]?.toUpperCase()}
              </Avatar>
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px' }}>
                  {user?.user_metadata?.full_name || user?.email}
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  {user?.email}
                </div>
              </div>
            </div>
            
            <Menu
              mode="vertical"
              items={userMenuItems}
              style={{
                border: 'none',
                backgroundColor: 'transparent'
              }}
              className="mobile-user-menu"
            />
          </div>
        </div>
      </Drawer>
      
      <Content className="layout-content">
        {children}
      </Content>

      <Footer style={{ 
        textAlign: 'center', 
        padding: '24px 0',
        backgroundColor: '#fafafa',
        borderTop: '1px solid #f0f0f0',
        fontSize: '14px',
        color: '#666'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: isMobile ? '0 12px' : '0 24px' }}>
          {/* Single line with slogans right-aligned and nav left-aligned */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            {/* Slogans - Left Aligned */}
            <div style={{ 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              flexShrink: 0,
              margin: 0,
              padding: 0
            }}>
              <div style={{ 
                marginBottom: '4px',
                padding: 0,
                fontSize: isMobile ? '11px' : '14px'
              }}>
                © 2025 Grocery Tracker. Made with ❤️ for better meal planning.
              </div>
              <div style={{ 
                fontSize: isMobile ? '10px' : '12px', 
                color: '#999',
                margin: 0,
                padding: 0
              }}>
                Track your ingredients, log your meals, and optimize your grocery spending.
              </div>
            </div>
            
            {/* Navigation Links - Right Aligned */}
            <div style={{ 
              display: 'flex', 
              gap: isMobile ? '16px' : '24px', 
              flexWrap: 'wrap'
            }}>
              <a 
                href="/dashboard" 
                style={{ 
                  color: '#666', 
                  textDecoration: 'none',
                  fontSize: isMobile ? '8px' : '10px',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => e.target.style.color = '#1890ff'}
                onMouseLeave={(e) => e.target.style.color = '#666'}
              >
                Dashboard
              </a>
              <a 
                href="/ingredients" 
                style={{ 
                  color: '#666', 
                  textDecoration: 'none',
                  fontSize: isMobile ? '8px' : '10px',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => e.target.style.color = '#1890ff'}
                onMouseLeave={(e) => e.target.style.color = '#666'}
              >
                Ingredients
              </a>
              <a 
                href="/meals" 
                style={{ 
                  color: '#666', 
                  textDecoration: 'none',
                  fontSize: isMobile ? '8px' : '10px',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => e.target.style.color = '#1890ff'}
                onMouseLeave={(e) => e.target.style.color = '#666'}
              >
                Meals
              </a>
            </div>
          </div>
        </div>
      </Footer>

      <style>{`
        .ant-btn-text:hover, .ant-btn-text:focus {
          background: none !important;
          color: inherit !important;
          text-decoration: none !important;
        }
        
        /* Mobile Menu Styles */
        .mobile-menu .ant-menu-item {
          height: 48px !important;
          line-height: 48px !important;
          margin: 0 !important;
          padding: 0 24px !important;
          font-size: 16px !important;
        }
        
        .mobile-menu .ant-menu-item-selected {
          background-color: #e6f7ff !important;
          color: #1890ff !important;
        }
        
        .mobile-user-menu .ant-menu-item {
          height: 40px !important;
          line-height: 40px !important;
          margin: 0 !important;
          padding: 0 16px !important;
          font-size: 14px !important;
        }
        
        /* Mobile Drawer Full Height */
        .ant-drawer-content-wrapper {
          height: 100vh !important;
        }
        
        .ant-drawer-body {
          height: calc(100vh - 64px) !important;
          display: flex !important;
          flex-direction: column !important;
        }
        

        

      `}</style>
    </AntLayout>
  )
}

export default Layout 