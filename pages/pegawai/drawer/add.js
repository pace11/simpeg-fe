import { useRef, useState } from 'react'
import {
  Drawer,
  Space,
  Button,
  Form,
  Input,
  notification,
  DatePicker,
  Switch,
  Select,
} from 'antd'
import { SaveOutlined, CloseOutlined } from '@ant-design/icons'
import { createApi } from '@/helpers/utils'
import dayjs from 'dayjs'
import { PENDIDIKAN_TERAKHIR, PD_PDP_NPD } from '@/constants'
import { HookSwr } from '@/lib/hooks/HookSwr'

export default function Add({ onClose, isOpenAdd }) {
  const { data: dataGolongan } = HookSwr({ path: '/golongan' })
  const { data: dataJabatan } = HookSwr({ path: '/jabatan' })
  const { data: dataAgama } = HookSwr({ path: '/agama' })
  const refButton = useRef(null)
  const [form] = Form.useForm()
  const [isLoading, setLoading] = useState(false)

  const onSubmitClick = () => {
    // `current` points to the mounted text input element
    refButton.current.click()
  }

  const onFinish = (values) => {
    setLoading(true)

    const payload = {
      nama: values?.nama,
      tempat_lahir: values?.tempat_lahir || null,
      tanggal_lahir: values?.tanggal_lahir
        ? dayjs(new Date(values?.tanggal_lahir)).format('YYYY-MM-DD')
        : null,
      nip_lama: values?.nip_lama || null,
      nip_baru: values?.nip_baru || null,
      tmt_golongan: values?.tmt_golongan
        ? dayjs(new Date(values?.tmt_golongan)).format('YYYY-MM-DD')
        : null,
      tmt_jabatan: values?.tmt_jabatan
        ? dayjs(new Date(values?.tmt_jabatan)).format('YYYY-MM-DD')
        : null,
      kepala_sekolah: values?.kepala_sekolah || false,
      pendidikan_terakhir: values?.pendidikan_terakhir || null,
      jurusan: values?.jurusan || null,
      tahun_lulus: values?.tahun_lulus
        ? dayjs(new Date(values?.tahun_lulus)).format('YYYY')
        : null,
      pd_pdp_npd: values?.pd_pdp_npd || null,
      keterangan: values?.keterangan || null,
      golongan_id: values?.golongan_id,
      jabatan_id: values?.jabatan_id,
      agama_id: values?.agama_id,
    }

    createApi({
      endpoint: '/pegawai',
      payload,
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

  return (
    <Drawer
      title="Tambah data"
      width={480}
      onClose={() => {
        onClose()
        form.resetFields()
      }}
      open={isOpenAdd}
      bodyStyle={{ paddingBottom: 80 }}
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
        // onFinishFailed={onFinishFailed}
        onFinish={onFinish}
        labelAlign="left"
      >
        <Form.Item
          label="Nama"
          name="nama"
          rules={[
            {
              required: true,
              message: 'Harap isikan nama!',
            },
          ]}
        >
          <Input size="large" placeholder="Nama ..." />
        </Form.Item>
        <Form.Item label="Tempat lahir" name="tempat_lahir">
          <Input size="large" placeholder="Tempat lahir ..." />
        </Form.Item>
        <Form.Item label="Tanggal lahir" name="tanggal_lahir">
          <DatePicker
            placeholder="Pilih tanggal"
            size="large"
            style={{ width: '100%' }}
          />
        </Form.Item>
        <Form.Item label="Nip lama" name="nip_lama">
          <Input
            size="large"
            placeholder="Nip lama ..."
            maxLength="15"
          />
        </Form.Item>
        <Form.Item label="Nip baru" name="nip_baru">
          <Input
            size="large"
            placeholder="Nip baru ..."
            maxLength="40"
          />
        </Form.Item>
        <Form.Item label="Tmt golongan" name="tmt_golongan">
          <DatePicker
            placeholder="Pilih tanggal"
            size="large"
            style={{ width: '100%' }}
          />
        </Form.Item>
        <Form.Item label="Tmt jabatan" name="tmt_jabatan">
          <DatePicker
            placeholder="Pilih tanggal"
            size="large"
            style={{ width: '100%' }}
          />
        </Form.Item>
        <Form.Item label="Kepala sekolah" name="kepala_sekolah">
          <Switch />
        </Form.Item>
        <Form.Item
          label="Pendidikan terakhir"
          name="pendidikan_terakhir"
          rules={[
            {
              required: true,
              message: 'Harap isikan pendidikan terakhir!',
            },
          ]}
        >
          <Select
            size="large"
            showSearch
            placeholder="Pilih pendidikan terakhir ..."
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
            {PENDIDIKAN_TERAKHIR?.map((item) => (
              <Select.Option key={item} value={item}>
                {item}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Jurusan" name="jurusan">
          <Input size="large" placeholder="Jurusan ..." />
        </Form.Item>
        <Form.Item label="Tahun lulus" name="tahun_lulus">
          <DatePicker
            placeholder="Pilih tahun"
            size="large"
            picker="year"
            style={{ width: '100%' }}
          />
        </Form.Item>
        <Form.Item
          label="PD/PDP/NPD"
          name="pd_pdp_npd"
          rules={[
            {
              required: true,
              message: 'Harap isikan salah satu!',
            },
          ]}
        >
          <Select
            size="large"
            showSearch
            placeholder="Pilih salah satu ..."
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
            {PD_PDP_NPD?.map((item) => (
              <Select.Option key={item} value={item}>
                {item}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Golongan"
          name="golongan_id"
          rules={[
            {
              required: true,
              message: 'Harap isikan golongan!',
            },
          ]}
        >
          <Select
            size="large"
            showSearch
            placeholder="Pilih golongan ..."
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
            {dataGolongan?.data?.map((item) => (
              <Select.Option key={item?.id} value={item?.id}>
                {item?.title}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Jabatan"
          name="jabatan_id"
          rules={[
            {
              required: true,
              message: 'Harap isikan jabatan!',
            },
          ]}
        >
          <Select
            size="large"
            showSearch
            placeholder="Pilih jabatan ..."
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
            {dataJabatan?.data?.map((item) => (
              <Select.Option key={item?.id} value={item?.id}>
                {item?.title}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Agama"
          name="agama_id"
          rules={[
            {
              required: true,
              message: 'Harap isikan agama!',
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
        <Form.Item label="Keterangan" name="keterangan">
          <Input.TextArea placeholder="Keterangan ..." />
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
