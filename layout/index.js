import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import {
  Breadcrumb,
  Layout,
  Menu,
  theme,
  Typography,
  Dropdown,
  Row,
  Tag,
} from 'antd'
import { DatabaseOutlined, UserOutlined } from '@ant-design/icons'
import { HookSwr } from '@/lib/hooks/HookSwr'
import Menus from './menu'

const { Title } = Typography
const { Header, Content, Footer, Sider } = Layout

const LayoutApp = ({ children }) => {
  const router = useRouter()
  const { data: userDetail, isLoading } = HookSwr({
    path: '/user/me',
  })
  const [collapsed, setCollapsed] = useState(false)
  const [selectedKeys, setSelectedKeys] = useState(null)
  const [itemBreadcrumbs, setItemBreadcrumbs] = useState([
    { href: '/', title: 'Beranda' },
  ])
  const {
    token: { colorBgContainer },
  } = theme.useToken()

  const HandleMenuSelect = ({ key, selectedKeys, keyPath }) => {
    switch (keyPath.length) {
      case 2:
        router.replace(
          `${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/${
            keyPath[keyPath.length - 1]
          }/${key}`,
        )
        break
      default:
        router.replace(
          `${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/${key}`,
        )
    }
    if (selectedKeys.toString() !== '/') {
      setItemBreadcrumbs((itemBreadcrumbs) => [
        { ...itemBreadcrumbs[0] },
        { title: selectedKeys.toString() },
      ])
    } else {
      setItemBreadcrumbs([{ href: '/', title: 'Beranda' }])
    }
    setSelectedKeys(selectedKeys)
  }

  const onMenuClick = (e) => {
    if (e?.key === 'logout') {
      router.replace(`${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/logout`)
    }
  }

  const items = [
    {
      key: 'logout',
      label: 'Logout',
    },
  ]

  useEffect(() => {
    const newRouter = router?.asPath.replace('/', '').split('/')
    const arrRouter =
      router?.asPath === '/' ? router?.asPath : newRouter
    setSelectedKeys(arrRouter)
    if (arrRouter !== '/') {
      setItemBreadcrumbs((itemBreadcrumbs) => [
        { ...itemBreadcrumbs[0] },
        { title: arrRouter.toString() },
      ])
    } else {
      setItemBreadcrumbs([{ href: '/', title: 'Beranda' }])
    }
  }, [router.asPath])

  return (
    <>
      <Head>
        <title>Dashboard SIMPEG - SMKN 2 Jayapura</title>
        <meta
          name="description"
          content="Generated by create next app"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout
        style={{
          height: '100vh',
        }}
      >
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          style={{ background: colorBgContainer }}
        >
          <Menu
            onSelect={HandleMenuSelect}
            selectedKeys={selectedKeys}
            mode="inline"
            items={Menus}
          />
        </Sider>
        <Layout>
          <Header
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 20px',
              background: colorBgContainer,
            }}
          >
            <Title style={{ margin: 0, padding: 0 }} level={5}>
              <DatabaseOutlined /> DASHBOARD SIMPEG
            </Title>
            <Row>
              <Dropdown.Button
                size="large"
                loading={isLoading}
                menu={{
                  items,
                  onClick: onMenuClick,
                }}
              >
                {userDetail?.data?.email}
                <Tag
                  color="green"
                  icon={<UserOutlined />}
                  style={{ marginLeft: '5px' }}
                >
                  Admin
                </Tag>
              </Dropdown.Button>
            </Row>
          </Header>
          <Content
            className="content-dashboard"
            style={{
              margin: '0 15px',
              overflowY: 'scroll',
            }}
          >
            <Breadcrumb
              style={{
                margin: '16px 0',
              }}
              items={itemBreadcrumbs}
            />
            {children}
          </Content>
          <Footer
            style={{
              textAlign: 'center',
            }}
          >
            SIMPEG - SMKN 2 Jayapura -
            <b>{` v${process.env.NEXT_PUBLIC_APP_VERSION}`}</b>
          </Footer>
        </Layout>
      </Layout>
    </>
  )
}
export default LayoutApp
