import { useState } from 'react'
import { Card, Button, Table, Space, Modal, notification } from 'antd'
import {
  PlusOutlined,
  ReloadOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import { HookSwr } from '@/lib/hooks/HookSwr'
import { deleteApi } from '@/helpers/utils'
import moment from 'moment'
import Add from './drawer/add'
import Edit from './drawer/edit'

const { confirm } = Modal

const Jabatan = () => {
  const { data, isLoading, reloadData } = HookSwr({
    path: '/jabatan',
  })
  const [isOpenAdd, setOpenAdd] = useState(false)
  const [isOpenEdit, setOpenEdit] = useState(false)

  const showConfirmDelete = (params) => {
    confirm({
      title: 'Hapus data',
      content: (
        <p>
          Kamu yakin akan menghapus data ini `<b>{params.title}</b>` ?
        </p>
      ),
      icon: <ExclamationCircleOutlined />,
      okText: 'Ya, Hapus',
      cancelText: 'Tidak',
      onOk: () => {
        deleteApi({
          endpoint: `/jabatan/delete/${params.id}`,
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
      title: 'ID',
      key: 'id',
      dataIndex: 'id',
    },
    {
      title: 'Title',
      key: 'title',
      dataIndex: 'title',
    },
    {
      title: 'Tanggal Dibuat',
      key: 'created_at',
      dataIndex: 'created_at',
      render: (created_at) =>
        moment(created_at).format('DD MMMM YYYY') || '-',
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
      title="Jabatan"
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
      />
      <Add
        isOpenAdd={isOpenAdd}
        onClose={() => {
          setOpenAdd(false)
          reloadData()
        }}
      />
      <Edit
        isOpen={isOpenEdit}
        onClose={() => {
          setOpenEdit(false)
          reloadData()
        }}
      />
    </Card>
  )
}

export default Jabatan