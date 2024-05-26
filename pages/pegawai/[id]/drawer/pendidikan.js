import { updateApi } from '@/helpers/utils'
import { HookSwr } from '@/lib/hooks/HookSwr'
import { CloseOutlined, SaveOutlined } from '@ant-design/icons'
import {
  Button,
  DatePicker,
  Drawer,
  Form,
  Input,
  Select,
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

  const { data: dataPendidikanTerakhir } = HookSwr({
    path: '/pendidikan-terakhir',
  })
  const { data: detailPendidikan } = HookSwr({
    path: data?.id ? `/pendidikan/${data?.id}` : '',
  })

  const onSubmitClick = () => {
    refButton.current.click()
  }

  const onFinish = (values) => {
    setLoading(true)

    const payload = {
      nomor_ijazah: values?.nomor_ijazah || null,
      nama_instansi: values?.nama_instansi || null,
      jurusan: values?.jurusan || null,
      tanggal_lulus: values?.tanggal_lulus
        ? dayjs(new Date(values?.tanggal_lulus)).format('YYYY-MM-DD')
        : null,
      pegawai_id: id,
      pendidikan_terakhir_id: values.pendidikan_terakhir_id,
    }

    updateApi({
      endpoint: data?.id
        ? `/pendidikan/update/${data?.id}`
        : '/pendidikan',
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
    if (detailPendidikan?.data?.id) {
      form.setFieldsValue({
        nomor_ijazah: detailPendidikan?.data?.nomor_ijazah,
        nama_instansi: detailPendidikan?.data?.nama_instansi,
        jurusan: detailPendidikan?.data?.jurusan,
        tanggal_lulus: detailPendidikan?.data?.tanggal_lulus
          ? dayjs(detailPendidikan?.data?.tanggal_lulus)
          : null,
        pendidikan_terakhir_id: detailPendidikan?.data?.pendidikan_terakhir_id,
      })
    }
  }, [detailPendidikan, form])

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
        <Form.Item label="Nomor Ijazah" name="nomor_ijazah">
          <Input size="large" placeholder="Nomor Ijazah ..." />
        </Form.Item>
        <Form.Item
          label="Nama Instansi Pendidikan"
          name="nama_instansi"
        >
          <Input
            size="large"
            placeholder="Nama Instansi Pendidikan ..."
          />
        </Form.Item>
        <Form.Item
          label="Pendidikan"
          name="pendidikan_terakhir_id"
          rules={[
            {
              required: true,
              message: 'Harap isikan pendidikan!',
            },
          ]}
        >
          <Select
            size="large"
            showSearch
            placeholder="Pilih pendidikan ..."
            notFoundContent="Data tidak ditemukan"
            filterOption={(input, option) =>
              option.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
            filterSort={(optionA, optionB) =>
              optionA.children
                .toLowerCase()
                .localeCompare(optionB.children.toLowerCase())
            }
          >
            {dataPendidikanTerakhir?.data?.map((item) => (
              <Select.Option key={item?.id} value={item?.id}>
                {item?.title}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Jurusan" name="jurusan">
          <Input size="large" placeholder="Jurusan ..." />
        </Form.Item>
        <Form.Item label="Tanggal Lulus" name="tanggal_lulus">
          <DatePicker
            placeholder="Pilih tanggal"
            size="large"
            style={{ width: '100%' }}
          />
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
