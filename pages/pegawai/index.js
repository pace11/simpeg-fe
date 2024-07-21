import DownloadPegawai from '@/components/download-pegawai'
import DownloadPegawaiDetail from '@/components/download-pegawai-detail'
import RoleComponentRender from '@/components/role-component-render'
import { SORTING } from '@/constants'
import { ProfileContext } from '@/context/profileContextProvider'
import { deleteApi, messageGolongan, roleUser } from '@/helpers/utils'
import { HookSwr } from '@/lib/hooks/HookSwr'
import { useGeneratePDF } from '@/lib/hooks/useGeneratePDF'
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  MoreOutlined,
  PlusOutlined,
  PrinterOutlined,
  ReloadOutlined,
  SelectOutlined,
} from '@ant-design/icons'
import {
  Button,
  Card,
  Input,
  Modal,
  Space,
  Table,
  Tag,
  notification,
} from 'antd'
import dayjs from 'dayjs'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react'

const Add = dynamic(() => import('./drawer/add'))
const Edit = dynamic(() => import('./drawer/edit'))

const Pegawai = ({ isMobile }) => {
  const {
    generatePDF,
    isLoading: isLoadingDownload,
    setLoading,
    filename,
  } = useGeneratePDF({
    onSuccess: ({ preview }) => {
      Modal.success({
        title: 'Preview',
        width: 900,
        content: (
          <>
            {preview && (
              <iframe
                title={preview}
                src={preview}
                width="100%"
                height={500}
                onError={() => setLoading('')}
                onLoad={() => setLoading('')}
              />
            )}
          </>
        ),
      })
    },
  })
  const profileUser = useContext(ProfileContext)
  const { data, isLoading, reloadData } = HookSwr({
    path: '/pegawai',
  })
  const [isOpenAdd, setOpenAdd] = useState(false)
  const [isOpenEdit, setOpenEdit] = useState(false)
  const router = useRouter()

  const showConfirmDelete = (params) => {
    Modal.confirm({
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
      title: 'Nama',
      key: 'nama',
      dataIndex: 'nama',
      sorter: (a, b) => a.nama - b.nama,
    },
    {
      title: 'Kepala Sekolah',
      key: 'kepala_sekolah',
      dataIndex: 'kepala_sekolah',
      render: (kepala_sekolah) => (
        <Tag
          color={kepala_sekolah ? 'green' : 'magenta'}
          icon={
            kepala_sekolah ? (
              <CheckCircleOutlined />
            ) : (
              <CloseCircleOutlined />
            )
          }
        >
          {kepala_sekolah ? 'Ya' : 'Tidak'}
        </Tag>
      ),
    },
    {
      title: 'Tanggal Lahir',
      key: 'tanggal_lahir',
      dataIndex: 'tanggal_lahir',
      render: (tanggal_lahir) =>
        tanggal_lahir
          ? dayjs(tanggal_lahir).locale('id').format('DD MMMM YYYY')
          : '-',
    },
    {
      title: 'Nip Baru',
      key: 'nip_baru',
      dataIndex: 'nip_baru',
      render: (nip_baru) => nip_baru || '-',
    },
    {
      title: 'Pendidikan Terakhir',
      render: ({ pendidikan_terakhir, jurusan }) =>
        `${pendidikan_terakhir?.title || '-'} ${jurusan || ''}`,
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
      title: 'Status',
      width: 300,
      render: (item) => messageGolongan({ data: item }),
    },
    {
      title: 'Aksi',
      fixed: 'right',
      render: (item) => (
        <Space direction="vertical">
          <Button
            icon={<EyeOutlined />}
            onClick={() => router.push(`/pegawai/${item?.id}`)}
          >
            Detail
          </Button>
          <RoleComponentRender
            condition={['admin'].includes(
              roleUser({ user: profileUser }),
            )}
          >
            <Button
              type="dashed"
              icon={<EditOutlined />}
              onClick={() => setOpenEdit(item?.id)}
            >
              Ubah
            </Button>
          </RoleComponentRender>
          <Button
            type="dashed"
            icon={<PrinterOutlined />}
            loading={
              isLoadingDownload &&
              filename === `cetak-pegawai-${item?.id}.pdf`
            }
            onClick={() => {
              generatePDF({
                filename: `cetak-pegawai-${item?.id}.pdf`,
                items: [
                  {
                    template: <DownloadPegawaiDetail detail={item} />,
                  },
                ],
                margin: [25, 10],
              })
            }}
          >
            Cetak
          </Button>
          <RoleComponentRender
            condition={['admin'].includes(
              roleUser({ user: profileUser }),
            )}
          >
            <Button
              danger
              type="primary"
              icon={<DeleteOutlined />}
              onClick={() => showConfirmDelete(item)}
            >
              Hapus
            </Button>
          </RoleComponentRender>
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

  const extraMobilePopup = () => {
    Modal.info({
      title: 'Aksi',
      content: (
        <Space key="mobile-action-jabatan" direction="vertical">
          <Input.Search
            placeholder="Cari title ..."
            onSearch={(val) => reloadData(`?nama=${val}`)}
            allowClear
            style={{
              width: 250,
            }}
          />
          <Button
            icon={<ReloadOutlined />}
            onClick={() => reloadData('')}
            block
          >
            Refresh data
          </Button>
          <RoleComponentRender
            condition={['admin'].includes(
              roleUser({ user: profileUser }),
            )}
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setOpenAdd(true)}
              block
            >
              Tambah data
            </Button>
          </RoleComponentRender>
        </Space>
      ),
      icon: <SelectOutlined />,
    })
  }

  const extraDesktop = [
    <Space key="descktop-action-pegawai">
      <Input.Search
        placeholder="Cari nama ..."
        onSearch={(val) => reloadData(`?nama=${val}`)}
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
        type="dashed"
        icon={<DownloadOutlined />}
        loading={isLoadingDownload && filename === 'download.pdf'}
        onClick={() => {
          generatePDF({
            filename: 'download.pdf',
            items: [
              {
                template: <DownloadPegawai data={data?.data} />,
              },
            ],
            margin: [25, 10],
          })
        }}
        block
      >
        Download
      </Button>
      <RoleComponentRender
        condition={['admin'].includes(
          roleUser({ user: profileUser }),
        )}
      >
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setOpenAdd(true)}
        >
          Tambah data
        </Button>
      </RoleComponentRender>
    </Space>,
  ]

  const extraMobile = [
    <Space key="action-pegawai">
      <Button
        onClick={() => extraMobilePopup()}
        icon={<MoreOutlined />}
        size="middle"
      />
    </Space>,
  ]

  return (
    <Card
      title="Pegawai"
      bordered={false}
      extra={isMobile ? extraMobile : extraDesktop}
    >
      <Table
        rowKey="key"
        dataSource={data?.data}
        columns={columns}
        loading={isLoading}
        onChange={onChange}
        style={{ width: '100%' }}
        scroll={{ x: 1300, y: 500 }}
        pagination={{
          showTotal: (total) => `${total} data`,
        }}
      />
      {isOpenAdd && (
        <Add
          isMobile={isMobile}
          isOpenAdd={isOpenAdd}
          onClose={() => {
            setOpenAdd(false)
            Modal.destroyAll()
            reloadData('')
          }}
        />
      )}
      {isOpenEdit && (
        <Edit
          isMobile={isMobile}
          isOpen={isOpenEdit}
          onClose={() => {
            setOpenEdit(false)
            Modal.destroyAll()
            reloadData('')
          }}
        />
      )}
      <div style={{ display: 'none' }}>
        <DownloadPegawai />
        <DownloadPegawaiDetail />
      </div>
    </Card>
  )
}

export default Pegawai
