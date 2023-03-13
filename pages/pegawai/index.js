import { useState } from 'react'
import dynamic from 'next/dynamic'
import {
  Card,
  Button,
  Table,
  Space,
  Modal,
  notification,
  Tag,
} from 'antd'
import {
  PlusOutlined,
  ReloadOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons'
import { HookSwr } from '@/lib/hooks/HookSwr'
import { deleteApi } from '@/helpers/utils'
import dayjs from 'dayjs'

const Add = dynamic(() => import('./drawer/add'))
const Edit = dynamic(() => import('./drawer/edit'))

const { confirm } = Modal

const Pegawai = () => {
  const { data, isLoading, reloadData } = HookSwr({
    path: '/pegawai',
  })
  const [isOpenAdd, setOpenAdd] = useState(false)
  const [isOpenEdit, setOpenEdit] = useState(false)

  const showConfirmDelete = (params) => {
    confirm({
      title: 'Hapus data',
      content: (
        <p>
          Kamu yakin akan menghapus data ini `<b>{params.nama}</b>` ?
        </p>
      ),
      icon: <ExclamationCircleOutlined />,
      okText: 'Ya, Hapus',
      cancelText: 'Tidak',
      onOk: () => {
        deleteApi({
          endpoint: `/pegawai/delete/${params.id}`,
        })
          .then((res) => {
            reloadData()
            notification.success({
              message: 'Info',
              description: res?.data?.message,
              duration: 1,
            })
          })
          .catch((err) => {
            if ([400].includes(err?.response?.status)) {
              notification.warning({
                message: err?.response?.data?.message,
                description: JSON.stringify(
                  err?.response?.data?.data,
                ),
                duration: 1,
              })
            }
            if ([500].includes(err?.response?.status)) {
              notification.error({
                message: 'Error',
                description: 'Internal server error',
                duration: 1,
              })
            }
          })
      },
      onCancel: () => {},
    })
  }

  const columns = [
    {
      title: 'Nama',
      key: 'nama',
      dataIndex: 'nama',
    },
    {
      title: 'Kepala Sekolah',
      key: 'kepala_sekolah',
      dataIndex: 'kepala_sekolah',
      render: (kepala_sekolah) =>
        kepala_sekolah ? (
          <Tag color="green" icon={<CheckCircleOutlined />}>
            Ya
          </Tag>
        ) : (
          <Tag color="magenta" icon={<CloseCircleOutlined />}>
            Tidak
          </Tag>
        ),
    },
    {
      title: 'Nip Lama',
      key: 'nip_lama',
      dataIndex: 'nip_lama',
      render: (nip_lama) => nip_lama || '-',
    },
    {
      title: 'Nip Baru',
      key: 'nip_baru',
      dataIndex: 'nip_baru',
      render: (nip_baru) => nip_baru || '-',
    },
    {
      title: 'Tmt Golongan',
      key: 'tmt_golongan',
      dataIndex: 'tmt_golongan',
      render: (tmt_golongan) =>
        tmt_golongan
          ? dayjs(tmt_golongan).format('DD MMMM YYYY')
          : '-',
    },
    {
      title: 'Tmt Jabatan',
      key: 'tmt_jabatan',
      dataIndex: 'tmt_jabatan',
      render: (tmt_jabatan) =>
        tmt_jabatan ? dayjs(tmt_jabatan).format('DD MMMM YYYY') : '-',
    },
    {
      title: 'Pendidikan Terakhir',
      key: 'pendidikan_terakhir',
      dataIndex: 'pendidikan_terakhir',
      render: (pendidikan_terakhir) => pendidikan_terakhir || '-',
    },
    {
      title: 'Jurusan',
      key: 'jurusan',
      dataIndex: 'jurusan',
      render: (jurusan) => jurusan || '-',
    },
    {
      title: 'Tahun Lulus',
      key: 'tahun_lulus',
      dataIndex: 'tahun_lulus',
      render: (tahun_lulus) => tahun_lulus || '-',
    },
    {
      title: 'PD/PDP/NPD',
      key: 'pd_pdp_npd',
      dataIndex: 'pd_pdp_npd',
      render: (pd_pdp_npd) => pd_pdp_npd || '-',
    },
    {
      title: 'Golongan',
      key: 'golongan',
      dataIndex: 'golongan',
      render: (golongan) => golongan?.title || '-',
    },
    {
      title: 'Jabatan',
      key: 'jabatan',
      dataIndex: 'jabatan',
      render: (jabatan) => jabatan?.title || '-',
    },
    {
      title: 'Agama',
      key: 'agama',
      dataIndex: 'agama',
      render: (agama) => agama?.title || '-',
    },
    {
      title: 'Keterangan',
      key: 'keterangan',
      dataIndex: 'keterangan',
      render: (keterangan) => keterangan || '-',
    },
    {
      title: 'Aksi',
      render: (item) => (
        <Space>
          <Button
            type="dashed"
            icon={<EditOutlined />}
            onClick={() => setOpenEdit(item?.id)}
          >
            Ubah
          </Button>
          <Button
            danger
            type="primary"
            icon={<DeleteOutlined />}
            onClick={() => showConfirmDelete(item)}
          >
            Hapus
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <Card
      title="Pegawai"
      bordered={false}
      extra={[
        <Space key="action-jabatan">
          <Button icon={<ReloadOutlined />} onClick={reloadData}>
            Refresh data
          </Button>
          <Button
            style={{ marginLeft: '10px' }}
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setOpenAdd(true)}
          >
            Tambah data
          </Button>
        </Space>,
      ]}
    >
      <Table
        rowKey="key"
        dataSource={data?.data}
        columns={columns}
        loading={isLoading}
        style={{ width: '100%' }}
        scroll={{ x: 1300 }}
      />
      {isOpenAdd && (
        <Add
          isOpenAdd={isOpenAdd}
          onClose={() => {
            setOpenAdd(false)
            reloadData()
          }}
        />
      )}
      {isOpenEdit && (
        <Edit
          isOpen={isOpenEdit}
          onClose={() => {
            setOpenEdit(false)
            reloadData()
          }}
        />
      )}
    </Card>
  )
}

export default Pegawai
