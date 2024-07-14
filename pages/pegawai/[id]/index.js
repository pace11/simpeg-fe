import RoleComponentRender from '@/components/role-component-render'
import { ProfileContext } from '@/context/profileContextProvider'
import { deleteApi, roleUser } from '@/helpers/utils'
import { HookSwr } from '@/lib/hooks/HookSwr'
import { toMappingDetailPegawai } from '@/mapping'
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import {
  Button,
  Card,
  Descriptions,
  Flex,
  Modal,
  Row,
  Space,
  Table,
  Typography,
  notification,
} from 'antd'
import dayjs from 'dayjs'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react'

const Pekerjaan = dynamic(() => import('./drawer/pekerjaan'))
const Keluarga = dynamic(() => import('./drawer/keluarga'))
const Pendidikan = dynamic(() => import('./drawer/pendidikan'))

const { Title } = Typography

const PegawaiDetail = () => {
  const profileUser = useContext(ProfileContext)
  const router = useRouter()
  const { id } = router?.query || {}
  const [pekerjaan, setPekerjaan] = useState({
    show: false,
    id: '',
  })
  const [keluarga, setKeluarga] = useState({
    show: false,
    id: '',
  })
  const [pendidikan, setPendidikan] = useState({
    show: false,
    id: '',
  })

  const { data: detailPegawai } = HookSwr({
    path: id ? `/pegawai/${id}` : '',
  })
  const {
    data: dataPekerjaan,
    isLoading: isLoadingPekerjaan,
    reloadData: reloadDataPekerjaan,
  } = HookSwr({
    path: id ? `/pekerjaan?pegawai_id=${id}` : '',
  })
  const {
    data: dataKeluarga,
    isLoading: isLoadingKeluarga,
    reloadData: reloadDataKeluarga,
  } = HookSwr({
    path: id ? `/keluarga?pegawai_id=${id}` : '',
  })
  const {
    data: dataPendidikan,
    isLoading: isLoadingPendidikan,
    reloadData: reloadDataPendidikan,
  } = HookSwr({
    path: id ? `/pendidikan?pegawai_id=${id}` : '',
  })

  const showConfirmDelete = ({ endpoint, fetchingData }) => {
    Modal.confirm({
      title: 'Hapus data',
      content: <p>Kamu yakin akan menghapus data ini ?</p>,
      icon: <ExclamationCircleOutlined />,
      okText: 'Ya, Hapus',
      cancelText: 'Tidak',
      onOk: () => {
        deleteApi({
          endpoint,
        })
          .then((res) => {
            fetchingData()
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

  const columnsPekerjaan = [
    {
      title: 'Nomor SK',
      key: 'nomor_sk',
      dataIndex: 'nomor_sk',
      render: (nomor_sk) => nomor_sk || '-',
    },
    {
      title: 'Tanggal SK',
      key: 'tanggal_sk',
      dataIndex: 'tanggal_sk',
      render: (tanggal_sk) =>
        tanggal_sk
          ? dayjs(tanggal_sk).locale('id').format('DD MMMM YYYY')
          : '-',
    },
    {
      title: 'TTD SK',
      key: 'ttd_sk',
      dataIndex: 'ttd_sk',
      render: (ttd_sk) => ttd_sk || '-',
    },
    {
      title: 'Keterangan',
      key: 'keterangan',
      dataIndex: 'keterangan',
      render: (keterangan) => keterangan || '-',
    },
    {
      title: 'Aksi',
      fixed: 'right',
      render: (item) => (
        <Space direction="vertical">
          <Button
            size="small"
            type="dashed"
            icon={<EditOutlined />}
            onClick={() =>
              setPekerjaan((prevValue) => ({
                ...prevValue,
                show: true,
                id: item?.id,
              }))
            }
          >
            Ubah
          </Button>
          <Button
            danger
            size="small"
            type="primary"
            icon={<DeleteOutlined />}
            onClick={() =>
              showConfirmDelete({
                endpoint: `/pekerjaan/delete/${item?.id}`,
                fetchingData: () => reloadDataPekerjaan(''),
              })
            }
          >
            Hapus
          </Button>
        </Space>
      ),
    },
  ]

  const columnsKeluarga = [
    {
      title: 'NIK',
      key: 'nik',
      dataIndex: 'nik',
    },
    {
      title: 'Nama Lengkap',
      key: 'nama_lengkap',
      dataIndex: 'nama_lengkap',
    },
    {
      title: 'Jenis Kelamin',
      key: 'jenis_kelamin',
      dataIndex: 'jenis_kelamin',
      render: (jenis_kelamin) => jenis_kelamin || '-',
    },
    {
      title: 'TTL',
      render: ({ tempat_lahir, tanggal_lahir }) =>
        `${tempat_lahir ? `${tempat_lahir}, ` : ''}${
          tanggal_lahir
            ? dayjs(tanggal_lahir).locale('id').format('DD MMMM YYYY')
            : ''
        }`,
    },
    {
      title: 'Golongan Darah',
      key: 'golongan_darah',
      dataIndex: 'golongan_darah',
      render: (golongan_darah) => golongan_darah || '-',
    },
    {
      title: 'Kewarganegaraan',
      key: 'kewarganegaraan',
      dataIndex: 'kewarganegaraan',
      render: (kewarganegaraan) => kewarganegaraan || '-',
    },
    {
      title: 'Agama',
      key: 'agama',
      dataIndex: 'agama',
      render: (agama) => agama?.title || '-',
    },
    {
      title: 'Pendidikan',
      key: 'pendidikan_kk',
      dataIndex: 'pendidikan_kk',
      render: (pendidikan_kk) => pendidikan_kk?.title || '-',
    },
    {
      title: 'Status Perkawinan',
      key: 'status_perkawinan_kk',
      dataIndex: 'status_perkawinan_kk',
      render: (status_perkawinan_kk) =>
        status_perkawinan_kk?.title || '-',
    },
    {
      title: 'Tanggal Perkawinan',
      key: 'tanggal_perkawinan',
      dataIndex: 'tanggal_perkawinan',
      render: (tanggal_perkawinan) =>
        tanggal_perkawinan
          ? dayjs(tanggal_perkawinan)
              .locale('id')
              .format('DD MMMM YYYY')
          : '-',
    },
    {
      title: 'Status Hubungan',
      key: 'status_hubungan_kk',
      dataIndex: 'status_hubungan_kk',
      render: (status_hubungan_kk) =>
        status_hubungan_kk?.title || '-',
    },
    {
      title: 'Jenis Pekerjaan',
      key: 'jenis_pekerjaan_kk',
      dataIndex: 'jenis_pekerjaan_kk',
      render: (jenis_pekerjaan_kk) =>
        jenis_pekerjaan_kk?.title || '-',
    },
    {
      title: 'Aksi',
      fixed: 'right',
      render: (item) => (
        <Space direction="vertical">
          <Button
            size="small"
            type="dashed"
            icon={<EditOutlined />}
            onClick={() =>
              setKeluarga((prevValue) => ({
                ...prevValue,
                show: true,
                id: item?.id,
              }))
            }
          >
            Ubah
          </Button>
          <Button
            danger
            size="small"
            type="primary"
            icon={<DeleteOutlined />}
            onClick={() =>
              showConfirmDelete({
                endpoint: `/keluarga/delete/${item?.id}`,
                fetchingData: () => reloadDataKeluarga(''),
              })
            }
          >
            Hapus
          </Button>
        </Space>
      ),
    },
  ]

  const columnsPendidikan = [
    {
      title: 'Nomor Ijazah',
      key: 'nomor_ijazah',
      dataIndex: 'nomor_ijazah',
      render: (nomor_ijazah) => nomor_ijazah || '-',
    },
    {
      title: 'Nama Instansi Pendidikan',
      key: 'nama_instansi',
      dataIndex: 'nama_instansi',
      render: (nama_instansi) => nama_instansi || '-',
    },
    {
      title: 'Pendidikan',
      key: 'pendidikan_terakhir',
      dataIndex: 'pendidikan_terakhir',
      render: (pendidikan_terakhir) =>
        pendidikan_terakhir?.title || '-',
    },
    {
      title: 'Jurusan',
      key: 'jurusan',
      dataIndex: 'jurusan',
      render: (jurusan) => jurusan || '-',
    },
    {
      title: 'Tanggal Lulus',
      key: 'tanggal_lulus',
      dataIndex: 'tanggal_lulus',
      render: (tanggal_lulus) =>
        tanggal_lulus
          ? dayjs(tanggal_lulus).locale('id').format('DD MMMM YYYY')
          : '-',
    },
    {
      title: 'Aksi',
      fixed: 'right',
      render: (item) => (
        <Space direction="vertical">
          <Button
            size="small"
            type="dashed"
            icon={<EditOutlined />}
            onClick={() =>
              setPendidikan((prevValue) => ({
                ...prevValue,
                show: true,
                id: item?.id,
              }))
            }
          >
            Ubah
          </Button>
          <Button
            danger
            size="small"
            type="primary"
            icon={<DeleteOutlined />}
            onClick={() =>
              showConfirmDelete({
                endpoint: `/pendidikan/delete/${item?.id}`,
                fetchingData: () => reloadDataPendidikan(''),
              })
            }
          >
            Hapus
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <Card title="Detail Pegawai" bordered={false}>
      <Descriptions
        bordered
        size="small"
        column={4}
        layout="vertical"
        items={toMappingDetailPegawai({
          data: detailPegawai?.data || {},
        })?.map((item, idx) => ({
          key: `${idx}`,
          label: item?.label,
          children: item?.value,
        }))}
      />
      <Row>
        <Flex
          style={{ width: '100%', paddingTop: '20px' }}
          align="center"
          justify="space-between"
        >
          <Title level={5}>Data Pekerjaan</Title>
          <RoleComponentRender
            condition={['admin'].includes(
              roleUser({ user: profileUser }),
            )}
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() =>
                setPekerjaan((prevValue) => ({
                  ...prevValue,
                  show: true,
                  id: '',
                }))
              }
            >
              Tambah Data
            </Button>
          </RoleComponentRender>
        </Flex>
        <Table
          rowKey="data-pekerjaan"
          dataSource={dataPekerjaan?.data}
          columns={columnsPekerjaan}
          loading={isLoadingPekerjaan}
          style={{ width: '100%' }}
          scroll={{ x: 1300 }}
          pagination={{
            pageSize: 5,
            showTotal: (total) => `${total} data`,
          }}
          size="small"
        />
      </Row>
      <Row>
        <Flex
          style={{ width: '100%', paddingTop: '20px' }}
          align="center"
          justify="space-between"
        >
          <Title level={5}>Data Keluarga</Title>
          <RoleComponentRender
            condition={['admin'].includes(
              roleUser({ user: profileUser }),
            )}
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() =>
                setKeluarga((prevValue) => ({
                  ...prevValue,
                  show: true,
                  id: '',
                }))
              }
            >
              Tambah Data
            </Button>
          </RoleComponentRender>
        </Flex>
        <Table
          rowKey="data-keluarga"
          dataSource={dataKeluarga?.data}
          columns={columnsKeluarga}
          loading={isLoadingKeluarga}
          style={{ width: '100%' }}
          scroll={{ x: 1300 }}
          pagination={{
            pageSize: 5,
            showTotal: (total) => `${total} data`,
          }}
          size="small"
        />
      </Row>
      <Row>
        <Flex
          style={{ width: '100%', paddingTop: '20px' }}
          align="center"
          justify="space-between"
        >
          <Title level={5}>Data Pendidikan</Title>
          <RoleComponentRender
            condition={['admin'].includes(
              roleUser({ user: profileUser }),
            )}
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() =>
                setPendidikan((prevValue) => ({
                  ...prevValue,
                  show: true,
                  id: '',
                }))
              }
            >
              Tambah Data
            </Button>
          </RoleComponentRender>
        </Flex>
        <Table
          rowKey="data-pendidikan"
          dataSource={dataPendidikan?.data}
          columns={columnsPendidikan}
          loading={isLoadingPendidikan}
          style={{ width: '100%' }}
          scroll={{ x: 1300 }}
          pagination={{
            pageSize: 5,
            showTotal: (total) => `${total} data`,
          }}
          size="small"
        />
      </Row>
      {pekerjaan?.show && (
        <Pekerjaan
          id={id}
          data={pekerjaan}
          onClose={() => {
            setPekerjaan((prevValue) => ({
              ...prevValue,
              show: false,
              id: '',
            }))
            reloadDataPekerjaan('')
          }}
        />
      )}
      {keluarga?.show && (
        <Keluarga
          id={id}
          data={keluarga}
          onClose={() => {
            setKeluarga((prevValue) => ({
              ...prevValue,
              show: false,
              id: '',
            }))
            reloadDataKeluarga('')
          }}
        />
      )}
      {pendidikan?.show && (
        <Pendidikan
          id={id}
          data={pendidikan}
          onClose={() => {
            setPendidikan((prevValue) => ({
              ...prevValue,
              show: false,
              id: '',
            }))
            reloadDataPendidikan('')
          }}
        />
      )}
    </Card>
  )
}

export default PegawaiDetail
