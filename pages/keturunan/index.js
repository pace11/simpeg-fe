import { useState } from 'react'
import dynamic from 'next/dynamic'
import {
  Card,
  Button,
  Table,
  Space,
  Modal,
  Input,
  notification,
} from 'antd'
import {
  PlusOutlined,
  ReloadOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import { HookSwr } from '@/lib/hooks/HookSwr'
import { deleteApi } from '@/helpers/utils'
import { SORTING } from '@/constants'
import dayjs from 'dayjs'

const Add = dynamic(() => import('./drawer/add'))
const Edit = dynamic(() => import('./drawer/edit'))

const { confirm } = Modal

const Keturunan = () => {
  const { data, isLoading, reloadData } = HookSwr({
    path: '/keturunan',
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
          endpoint: `/keturunan/delete/${params.id}`,
        })
          .then((res) => {
            reloadData('')
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
                description: err?.response?.statusText,
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
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Title',
      key: 'title',
      dataIndex: 'title',
      sorter: (a, b) => a.title - b.title,
    },
    {
      title: 'Tanggal Dibuat',
      key: 'created_at',
      dataIndex: 'created_at',
      render: (created_at) =>
        dayjs(created_at).format('DD MMMM YYYY') || '-',
    },
    {
      title: 'Aksi',
      render: (item) => (
        <Space direction="vertical">
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

  const onChange = (pagination, filters, sorter, extra) => {
    reloadData(
      `?sort=${sorter?.field}&direction=${
        sorter?.order ? SORTING[sorter?.order] : ''
      }`,
    )
  }

  return (
    <Card
      title="Keturunan"
      bordered={false}
      extra={[
        <Space key="action-keturunan">
          <Input.Search
            placeholder="Cari title ..."
            onSearch={(val) => reloadData(`?title=${val}`)}
            allowClear
            style={{
              width: 250,
            }}
          />
          <Button
            icon={<ReloadOutlined />}
            onClick={() => reloadData('')}
          >
            Refresh data
          </Button>
          <Button
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
        onChange={onChange}
      />
      {isOpenAdd && (
        <Add
          isOpenAdd={isOpenAdd}
          onClose={() => {
            setOpenAdd(false)
            reloadData('')
          }}
        />
      )}
      {isOpenEdit && (
        <Edit
          isOpen={isOpenEdit}
          onClose={() => {
            setOpenEdit(false)
            reloadData('')
          }}
        />
      )}
    </Card>
  )
}

export default Keturunan