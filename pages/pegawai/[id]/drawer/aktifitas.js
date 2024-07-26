import { updateApi } from '@/helpers/utils'
import { HookSwr } from '@/lib/hooks/HookSwr'
import { CloseOutlined, SaveOutlined } from '@ant-design/icons'
import {
  Button,
  DatePicker,
  Drawer,
  Form,
  Input,
  Space,
  notification,
} from 'antd'
import dayjs from 'dayjs'
import { useEffect, useRef, useState } from 'react'

export default function PendidikanModal({
  isMobile,
  onClose,
  id,
  data,
}) {
  const refButton = useRef(null)
  const [form] = Form.useForm()
  const [isLoading, setLoading] = useState(false)

  const { data: detail } = HookSwr({
    path: data?.id ? `/aktifitas/${data?.id}` : '',
  })

  const onSubmitClick = () => {
    refButton.current.click()
  }

  const onFinish = (values) => {
    setLoading(true)

    const payload = {
      tgl_aktifitas: values?.tgl_aktifitas
        ? dayjs(new Date(values?.tgl_aktifitas)).format('YYYY-MM-DD')
        : null,
      aktifitas: values?.aktifitas ?? null,
      pegawai_id: id,
    }

    updateApi({
      endpoint: data?.id
        ? `/aktifitas/update/${data?.id}`
        : '/aktifitas',
      payload,
      method: data?.id ? 'PATCH' : 'POST',
    })
      .then((res) => {
        form.resetFields()
        setLoading(false)
        notification.success({
          message: 'Info',
          description: res?.data?.message,
          duration: 1,
        })
        onClose()
      })
      .catch((err) => {
        setLoading(false)
        if ([400].includes(err?.response?.status)) {
          notification.warning({
            message: err?.response?.data?.message,
            description: JSON.stringify(err?.response?.data?.data),
            duration: 1,
          })
        }
        if ([500].includes(err?.response?.status)) {
          notification.error({
            message: 'Error',
            description: err?.response?.statusText,
            duration: 1,
          })
        }
      })
  }

  useEffect(() => {
    if (detail?.data?.id) {
      form.setFieldsValue({
        tgl_aktifitas: detail?.data?.tgl_aktifitas
          ? dayjs(detail?.data?.tgl_aktifitas)
          : null,
        aktifitas: detail?.data?.aktifitas,
      })
    }
  }, [detail, form])

  return (
    <Drawer
      title={data?.id ? 'Edit data' : 'Tambah data'}
      width={isMobile ? '100%' : 480}
      placement={isMobile ? 'bottom' : 'right'}
      onClose={() => {
        onClose()
        form.resetFields()
      }}
      open={data?.show}
      extra={
        <Space>
          <Button
            onClick={() => {
              onClose()
              form.resetFields()
            }}
            icon={<CloseOutlined />}
            disabled={isLoading}
          >
            Batal
          </Button>
          <Button
            onClick={() => onSubmitClick()}
            icon={<SaveOutlined />}
            type="primary"
            loading={isLoading}
          >
            Simpan
          </Button>
        </Space>
      }
    >
      <Form
        form={form}
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
        autoComplete="off"
        onFinish={onFinish}
        labelAlign="left"
      >
        <Form.Item label="Tanggal Aktifitas" name="tgl_aktifitas">
          <DatePicker
            placeholder="Pilih tanggal"
            size="large"
            style={{ width: '100%' }}
            format="YYYY-MM-DD"
          />
        </Form.Item>
        <Form.Item label="Aktifitas" name="aktifitas">
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item hidden>
          <Button ref={refButton} type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  )
}
