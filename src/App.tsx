import { useEffect, useState } from 'react';
import { ConfigProvider, Layout, Typography, Card, Row, Col, Button, Space, Spin, Alert, Breadcrumb, message } from 'antd';
import { 
  SearchOutlined, 
  UnorderedListOutlined, 
  BankOutlined, 
  FormOutlined,
  UserOutlined,
  BarChartOutlined,
  WifiOutlined,
  DisconnectOutlined,
  HomeOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import { electoralTheme } from './utils/theme';
import { initializeStores, useAuthSelectors, useAppConfigSelectors } from './stores';
import './App.css';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

function App() {
  // Telegram WebApp Add to Home Screen state
  const [canAddToHome, setCanAddToHome] = useState(false);

  // Initialize Telegram WebApp and stores on app startup
  useEffect(() => {
    // Initialize Telegram WebApp
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      
      // Basic initialization
      tg.ready();
      tg.expand();
      
      // Set theme colors
      tg.headerColor = '#001529';
      tg.backgroundColor = '#f5f5f5';
      
      // Check home screen status (using any to bypass TypeScript limitations)
      const tgAny = tg as any;
      if (tgAny.checkHomeScreenStatus) {
        try {
          tgAny.checkHomeScreenStatus((status: string) => {
            // Status can be 'unsupported', 'unknown', 'not_added', 'added'
            setCanAddToHome(status === 'not_added' || status === 'unknown');
          });
        } catch (e) {
          // Fallback: show add to home option
          setCanAddToHome(true);
        }
      } else {
        // Fallback: show add to home option if method doesn't exist
        setCanAddToHome(true);
      }
    }
    
    initializeStores();
  }, []);

  // Handle Add to Home Screen using Telegram WebApp API
  const handleAddToHome = () => {
    const tgAny = window.Telegram?.WebApp as any;
    if (tgAny?.addToHomeScreen) {
      try {
        tgAny.addToHomeScreen();
        message.success('Adding Electoral Management App to home screen...');
      } catch (e) {
        message.info('Add to Home Screen: Use your browser menu or Telegram settings');
      }
    } else {
      // Fallback message
      message.info('Add to Home Screen: Use your browser menu or Telegram settings');
    }
  };

  // Get auth and config state
  const { 
    isAuthenticated, 
    user, 
    telegramUser, 
    isLoading: authLoading,
    error: authError 
  } = useAuthSelectors();
  
  const { 
    isOffline
  } = useAppConfigSelectors();

  // Show loading screen during initialization
  if (authLoading) {
    return (
      <ConfigProvider theme={electoralTheme}>
        <Layout style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <Spin size="large" />
            <div style={{ marginTop: 16 }}>
              <Text>Initializing Electoral Management System...</Text>
            </div>
          </div>
        </Layout>
      </ConfigProvider>
    );
  }

  // Show error if authentication failed
  if (authError && !isAuthenticated) {
    return (
      <ConfigProvider theme={electoralTheme}>
        <Layout style={{ minHeight: '100vh', padding: '24px' }}>
          <div style={{ maxWidth: 400, margin: '0 auto', marginTop: '20%' }}>
            <Alert
              message="Authentication Error"
              description={authError}
              type="error"
              showIcon
              action={
                <Button size="small" danger>
                  Retry
                </Button>
              }
            />
          </div>
        </Layout>
      </ConfigProvider>
    );
  }

  return (
    <ConfigProvider theme={electoralTheme}>
      <Layout style={{ minHeight: '100vh' }}>
        {/* Fixed Header */}
        <Header style={{ 
          position: 'fixed', 
          zIndex: 1, 
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Title level={3} style={{ color: '#fff', margin: 0 }}>
              Electoral Management
            </Title>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', color: '#fff' }}>
            {/* Offline/Online Indicator */}
            {isOffline ? (
              <DisconnectOutlined style={{ color: '#faad14', marginRight: 16 }} />
            ) : (
              <WifiOutlined style={{ color: '#52c41a', marginRight: 16 }} />
            )}
            
            {/* User Info */}
            <UserOutlined style={{ marginRight: 8 }} />
            <Text style={{ color: '#fff' }}>
              {user?.firstName || telegramUser?.first_name || 'Electoral Officer'}
            </Text>
          </div>
        </Header>
        
        <Content style={{ 
          marginTop: 64, 
          padding: '24px',
          background: '#f5f5f5'
        }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            {/* Breadcrumb Navigation */}
            <Breadcrumb 
              style={{ marginBottom: 16 }}
              items={[
                {
                  title: (
                    <span>
                      <HomeOutlined />
                      <span style={{ marginLeft: 8 }}>Dashboard</span>
                    </span>
                  )
                },
                ...(canAddToHome ? [{
                  title: (
                    <Button 
                      type="link" 
                      icon={<DownloadOutlined />} 
                      onClick={handleAddToHome}
                      style={{ padding: 0, height: 'auto', color: '#52c41a' }}
                    >
                      Add to Home
                    </Button>
                  )
                }] : [])
              ]}
            />
            
            {/* Welcome Section */}
            <Card style={{ marginBottom: 24 }}>
              <Title level={2}>🗳️ Electoral Management System</Title>
              <Text type="secondary">
                Production-grade Telegram Web App for comprehensive voter management, 
                survey collection, and electoral operations.
              </Text>
            </Card>

            {/* Quick Actions Grid */}
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Card 
                  hoverable
                  style={{ textAlign: 'center', height: '200px' }}
                  bodyStyle={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}
                >
                  <SearchOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: 16 }} />
                  <Title level={4} style={{ marginBottom: 8 }}>Voter Search</Title>
                  <Text type="secondary">Search and manage voter database</Text>
                  <Button type="primary" style={{ marginTop: 12 }}>
                    Search Voters
                  </Button>
                </Card>
              </Col>

              <Col xs={24} sm={12} md={8} lg={6}>
                <Card 
                  hoverable
                  style={{ textAlign: 'center', height: '200px' }}
                  bodyStyle={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}
                >
                  <UnorderedListOutlined style={{ fontSize: '48px', color: '#52c41a', marginBottom: 16 }} />
                  <Title level={4} style={{ marginBottom: 8 }}>Voter Lists</Title>
                  <Text type="secondary">Generate booth and area-wise lists</Text>
                  <Button type="primary" style={{ marginTop: 12 }}>
                    View Lists
                  </Button>
                </Card>
              </Col>

              <Col xs={24} sm={12} md={8} lg={6}>
                <Card 
                  hoverable
                  style={{ textAlign: 'center', height: '200px' }}
                  bodyStyle={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}
                >
                  <BankOutlined style={{ fontSize: '48px', color: '#faad14', marginBottom: 16 }} />
                  <Title level={4} style={{ marginBottom: 8 }}>Booth Management</Title>
                  <Text type="secondary">Manage polling booths and assignments</Text>
                  <Button type="primary" style={{ marginTop: 12 }}>
                    Manage Booths
                  </Button>
                </Card>
              </Col>

              <Col xs={24} sm={12} md={8} lg={6}>
                <Card 
                  hoverable
                  style={{ textAlign: 'center', height: '200px' }}
                  bodyStyle={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}
                >
                  <FormOutlined style={{ fontSize: '48px', color: '#722ed1', marginBottom: 16 }} />
                  <Title level={4} style={{ marginBottom: 8 }}>Surveys</Title>
                  <Text type="secondary">Conduct voter surveys and collect data</Text>
                  <Button type="primary" style={{ marginTop: 12 }}>
                    Start Survey
                  </Button>
                </Card>
              </Col>

              <Col xs={24} sm={12} md={8} lg={6}>
                <Card 
                  hoverable
                  style={{ textAlign: 'center', height: '200px' }}
                  bodyStyle={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}
                >
                  <BarChartOutlined style={{ fontSize: '48px', color: '#eb2f96', marginBottom: 16 }} />
                  <Title level={4} style={{ marginBottom: 8 }}>Analytics</Title>
                  <Text type="secondary">View statistics and reports</Text>
                  <Button type="primary" style={{ marginTop: 12 }}>
                    View Analytics
                  </Button>
                </Card>
              </Col>
            </Row>

            {/* Statistics Section */}
            <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
              <Col xs={24} md={8}>
                <Card>
                  <div style={{ textAlign: 'center' }}>
                    <Title level={2} style={{ color: '#1890ff', margin: 0 }}>50,000+</Title>
                    <Text type="secondary">Total Voters</Text>
                  </div>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card>
                  <div style={{ textAlign: 'center' }}>
                    <Title level={2} style={{ color: '#52c41a', margin: 0 }}>150</Title>
                    <Text type="secondary">Polling Booths</Text>
                  </div>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card>
                  <div style={{ textAlign: 'center' }}>
                    <Title level={2} style={{ color: '#faad14', margin: 0 }}>85%</Title>
                    <Text type="secondary">Survey Completion</Text>
                  </div>
                </Card>
              </Col>
            </Row>

            {/* Footer Info */}
            <Card style={{ marginTop: 24, textAlign: 'center' }}>
              <Space direction="vertical">
                <Title level={4}>📱 Telegram Web App Features</Title>
                <Text>✅ Offline-first architecture with IndexedDB storage</Text>
                <Text>✅ Multi-language support (Telugu, English, Hindi)</Text>
                <Text>✅ Real-time synchronization and conflict resolution</Text>
                <Text>✅ Role-based access control and audit logging</Text>
                <Text>✅ Production-grade performance for 50,000+ voters</Text>
              </Space>
            </Card>
          </div>
        </Content>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
