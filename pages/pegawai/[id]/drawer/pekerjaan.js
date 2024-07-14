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

export default function PekerjaanModal({
  isMobile,
  onClose,
  id,
  data,
}) {
  const refButton = useRef(null)
  const [form] = Form.useForm()
  const [isLoading, setLoading] = useState(false)

  const { data: detailPekerjaan } = HookSwr({
    path: data?.id ? `/pekerjaan/${data?.id}` : '',
  })

  const onSubmitClick = () => {
    refButton.current.click()
  }

  const onFinish = (values) => {
    setLoading(true)

    const payload = {
      nomor_sk: values?.nomor_sk || null,
      tanggal_sk: values?.tanggal_sk
        ? dayjs(new Date(values?.tanggal_sk)).format('YYYY-MM-DD')
        : null,
      ttd_sk: values?.ttd_sk || null,
      keterangan: values?.keterangan || null,
      pegawai_id: id,
    }

    updateApi({
      endpoint: data?.id
        ? `/pekerjaan/update/${data?.id}`
        : '/pekerjaan',
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
    if (detailPekerjaan?.data?.id) {
      form.setFieldsValue({
        nomor_sk: detailPekerjaan?.data?.nomor_sk,
        tanggal_sk: detailPekerjaan?.data?.tanggal_sk
          ? dayjs(detailPekerjaan?.data?.tanggal_sk)
          : null,
        ttd_sk: detailPekerjaan?.data?.ttd_sk,
        keterangan: detailPekerjaan?.data?.keterangan,
      })
    }
  }, [detailPekerjaan, form])

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
        <Form.Item label="Nomor SK" name="nomor_sk">
          <Input size="large" placeholder="Nomor SK ..." />
        </Form.Item>
        <Form.Item label="Tanggal SK/Terbit SK" name="tanggal_sk">
          <DatePicker
            placeholder="Pilih tanggal"
            size="large"
            style={{ width: '100%' }}
          />
        </Form.Item>
        <Form.Item label="Yang menandatangani SK" name="ttd_sk">
          <Input size="large" placeholder="Nip lama ..." />
        </Form.Item>
        <Form.Item label="Keterangan" name="keterangan">
          <Input.TextArea size="large" placeholder="Keterangan ..." />
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
