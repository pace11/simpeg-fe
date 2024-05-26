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

export default function KeluargaModal({
  isMobile,
  onClose,
  id,
  data,
}) {
  const refButton = useRef(null)
  const [form] = Form.useForm()
  const [isLoading, setLoading] = useState(false)

  const { data: dataAgama } = HookSwr({ path: '/agama' })
  const { data: dataPendidikanKk } = HookSwr({
    path: '/pendidikan-kk',
  })
  const { data: dataStatusPerkawinanKk } = HookSwr({
    path: '/status-perkawinan-kk',
  })
  const { data: dataStatusHubunganKk } = HookSwr({
    path: '/status-hubungan-kk',
  })
  const { data: dataJenisPekerjaanKk } = HookSwr({
    path: '/jenis-pekerjaan-kk',
  })
  const { data: detailKeluarga } = HookSwr({
    path: data?.id ? `/keluarga/${data?.id}` : '',
  })

  const onSubmitClick = () => {
    refButton.current.click()
  }

  const onFinish = (values) => {
    setLoading(true)

    const payload = {
      nik: values?.nik || null,
      nama_lengkap: values?.nama_lengkap || null,
      jenis_kelamin: values?.jenis_kelamin || null,
      tempat_lahir: values?.tempat_lahir || null,
      tanggal_lahir: values?.tanggal_lahir
        ? dayjs(new Date(values?.tanggal_lahir)).format('YYYY-MM-DD')
        : null,
      tanggal_perkawinan: values?.tanggal_perkawinan
        ? dayjs(new Date(values?.tanggal_perkawinan)).format(
            'YYYY-MM-DD',
          )
        : null,
      golongan_darah: values?.golongan_darah || null,
      kewarganegaraan: values?.kewarganegaraan || null,
      pegawai_id: id,
      agama_id: values.agama_id,
      pendidikan_kk_id: values.pendidikan_kk_id,
      status_perkawinan_kk_id: values.status_perkawinan_kk_id,
      status_hubungan_kk_id: values.status_hubungan_kk_id,
      jenis_pekerjaan_kk_id: values.jenis_pekerjaan_kk_id,
    }

    updateApi({
      endpoint: data?.id
        ? `/keluarga/update/${data?.id}`
        : '/keluarga',
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
    if (detailKeluarga?.data?.id) {
      form.setFieldsValue({
        nik: detailKeluarga?.data?.nik,
        nama_lengkap: detailKeluarga?.data?.nama_lengkap,
        jenis_kelamin: detailKeluarga?.data?.jenis_kelamin,
        tempat_lahir: detailKeluarga?.data?.tempat_lahir,
        tanggal_lahir: detailKeluarga?.data?.tanggal_lahir
          ? dayjs(detailKeluarga?.data?.tanggal_lahir)
          : null,
        tanggal_perkawinan: detailKeluarga?.data?.tanggal_perkawinan
          ? dayjs(detailKeluarga?.data?.tanggal_perkawinan)
          : null,
        golongan_darah: detailKeluarga?.data?.golongan_darah,
        kewarganegaraan: detailKeluarga?.data?.kewarganegaraan,
        agama_id: detailKeluarga?.data?.agama_id,
        pendidikan_kk_id: detailKeluarga?.data?.pendidikan_kk_id,
        status_perkawinan_kk_id:
          detailKeluarga?.data?.status_perkawinan_kk_id,
        status_hubungan_kk_id:
          detailKeluarga?.data?.status_hubungan_kk_id,
        jenis_pekerjaan_kk_id:
          detailKeluarga?.data?.jenis_pekerjaan_kk_id,
      })
    }
  }, [detailKeluarga, form])

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
        <Form.Item label="NIK" name="nik">
          <Input size="large" placeholder="NIK ..." />
        </Form.Item>
        <Form.Item label="Nama Lengkap" name="nama_lengkap">
          <Input size="large" placeholder="Nama Lengkap ..." />
        </Form.Item>
        <Form.Item label="Jenis Kelamin" name="jenis_kelamin">
          <Select
            size="large"
            showSearch
            placeholder="Pilih jenis kelamin ..."
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
            <Select.Option value="L">Laki-Laki</Select.Option>
            <Select.Option value="P">Perempuan</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Tempat Lahir" name="tempat_lahir">
          <Input size="large" placeholder="Tempat Lahir ..." />
        </Form.Item>
        <Form.Item label="Tanggal Lahir" name="tanggal_lahir">
          <DatePicker
            placeholder="Pilih tanggal"
            size="large"
            style={{ width: '100%' }}
          />
        </Form.Item>
        <Form.Item label="Golongan Darah" name="golongan_darah">
          <Select
            size="large"
            showSearch
            placeholder="Pilih golongan darah ..."
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
            <Select.Option value="A">A</Select.Option>
            <Select.Option value="B">B</Select.Option>
            <Select.Option value="AB">AB</Select.Option>
            <Select.Option value="O">O</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Kewarganegaraan" name="kewarganegaraan">
          <Select
            size="large"
            showSearch
            placeholder="Pilih kewarganegaraan ..."
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
            <Select.Option value="WNI">WNI</Select.Option>
            <Select.Option value="WNA">WNA</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Agama"
          name="agama_id"
          rules={[
            {
              required: true,
              message: 'Harap pilih salah satu opsi!',
            },
          ]}
        >
          <Select
            size="large"
            showSearch
            placeholder="Pilih agama ..."
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
            {dataAgama?.data?.map((item) => (
              <Select.Option key={item?.id} value={item?.id}>
                {item?.title}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Pendidikan"
          name="pendidikan_kk_id"
          rules={[
            {
              required: true,
              message: 'Harap pilih salah satu opsi!',
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
            {dataPendidikanKk?.data?.map((item) => (
              <Select.Option key={item?.id} value={item?.id}>
                {item?.title}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Status Perkawinan"
          name="status_perkawinan_kk_id"
          rules={[
            {
              required: true,
              message: 'Harap pilih salah satu opsi!',
            },
          ]}
        >
          <Select
            size="large"
            showSearch
            placeholder="Pilih status perkawinan ..."
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
            {dataStatusPerkawinanKk?.data?.map((item) => (
              <Select.Option key={item?.id} value={item?.id}>
                {item?.title}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Tanggal Perkawinan"
          name="tanggal_perkawinan"
        >
          <DatePicker
            placeholder="Pilih tanggal"
            size="large"
            style={{ width: '100%' }}
          />
        </Form.Item>
        <Form.Item
          label="Status Hubungan"
          name="status_hubungan_kk_id"
          rules={[
            {
              required: true,
              message: 'Harap pilih salah satu opsi!',
            },
          ]}
        >
          <Select
            size="large"
            showSearch
            placeholder="Pilih status hubungan ..."
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
            {dataStatusHubunganKk?.data?.map((item) => (
              <Select.Option key={item?.id} value={item?.id}>
                {item?.title}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Jenis Pekerjaan"
          name="jenis_pekerjaan_kk_id"
          rules={[
            {
              required: true,
              message: 'Harap pilih salah satu opsi!',
            },
          ]}
        >
          <Select
            size="large"
            showSearch
            placeholder="Pilih jenis pekerjaan ..."
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
            {dataJenisPekerjaanKk?.data?.map((item) => (
              <Select.Option key={item?.id} value={item?.id}>
                {item?.title}
              </Select.Option>
            ))}
          </Select>
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
