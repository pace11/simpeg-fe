/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import { Button, Form, Input, Row, Card, notification } from 'antd'
import Link from 'next/link'
import { MailTwoTone } from '@ant-design/icons'
import Cookies from 'js-cookie'
import React, { useState } from 'react'
import { loginApi } from '@/helpers/utils'
import { useRouter } from 'next/router'

const ForgotPassword = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const onFinish = (values) => {
    setIsLoading(true)
    const expires = new Date()
    expires.setSeconds(expires.getSeconds() + 86400)
    loginApi({
      endpoint: '/login',
      payload: values,
    })
      .then((res) => {
        if (res?.status === 200) {
          setIsLoading(false)
          Cookies.set('token_simpeg', res?.data?.data?.token, {
            expires,
            path: '/',
          })
          notification.success({
            message: 'Info',
            description: res?.data?.message,
            duration: 1,
          })
          router.push({ pathname: '/' })
        }
      })
      .catch((err) => err)
  }

  // const onFinishFailed = (errorInfo) => {

  // 	console.log("Failed:", errorInfo);

  // };

  return (
    <Row
      justify="center"
      align="middle"
      style={{
        height: '100vh',
        background: '#f5f5f5',
        flexDirection: 'column',
      }}
    >
      <Card bordered={false} style={{ width: '350px' }}>
        <h2
          style={{
            textAlign: 'center',
            margin: '0 0 25px 0',
            padding: 0,
            fontWeight: 'bold',
          }}
        >
          FORGOT PASSWORD
        </h2>
        <Form
          name="basic"
          labelCol={{
            span: 24,
          }}
          wrapperCol={{
            span: 24,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          // onFinishFailed={onFinishFailed}
          autoComplete="off"
          labelAlign="left"
        >
          <Form.Item
            name="email"
            rules={[
              {
                type: 'email',
                required: true,
                message: 'Harap isikan format email valid!',
              },
            ]}
          >
            <Input
              prefix={<MailTwoTone twoToneColor="#1890FF" />}
              placeholder="Email ..."
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              loading={isLoading}
              type="primary"
              htmlType="submit"
              block
            >
              Submit
            </Button>
          </Form.Item>

          <Form.Item>
            <p style={{ textAlign: 'center' }}>
              Sudah punya akun ?{' '}
              <Link className="register" href="/login">
                Login disini
              </Link>
            </p>
          </Form.Item>
        </Form>
      </Card>
    </Row>
  )
}

export default ForgotPassword
