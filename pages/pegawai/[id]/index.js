import RoleComponentRender from '@/components/role-component-render'
import { ProfileContext } from '@/context/profileContextProvider'
import {
  deleteApi,
  getMonthId,
  messageGolongan,
  roleUser,
  statusKinerja,
} from '@/helpers/utils'
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
  Col,
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
const Absensi = dynamic(() => import('./drawer/absensi'))
const Aktifitas = dynamic(() => import('./drawer/aktifitas'))

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
  const [absensi, setAbsensi] = useState({
    show: false,
    id: '',
  })
  const [aktifitas, setAktifitas] = useState({
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
  const {
    data: dataAbsensi,
    isLoading: isLoadingAbsensi,
    reloadData: reloadDataAbsensi,
  } = HookSwr({
    path: id ? `/absensi?pegawai_id=${id}` : '',
  })
  const {
    data: dataAktifitas,
    isLoading: isLoadingAktifitas,
    reloadData: reloadDataAktifitas,
  } = HookSwr({
    path: id ? `/aktifitas?pegawai_id=${id}` : '',
  })
  const { data: dataKinerja, isLoading: isLoadingKinerja } = HookSwr({
    path: id ? `/absensi/filter?pegawai_id=${id}` : '',
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

  const columnsAbsensi = [
    {
      title: 'Tanggal Masuk',
      key: 'tgl_masuk',
      dataIndex: 'tgl_masuk',
      render: (tgl_masuk) =>
        tgl_masuk
          ? dayjs(tgl_masuk).locale('id').format('DD MMMM YYYY HH:mm')
          : '-',
    },
    {
      title: 'Tanggal Pulang',
      key: 'tgl_pulang',
      dataIndex: 'tgl_pulang',
      render: (tgl_pulang) =>
        tgl_pulang
          ? dayjs(tgl_pulang)
              .locale('id')
              .format('DD MMMM YYYY HH:mm')
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
              setAbsensi((prevValue) => ({
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
                endpoint: `/absensi/delete/${item?.id}`,
                fetchingData: () => reloadDataAbsensi(''),
              })
            }
          >
            Hapus
          </Button>
        </Space>
      ),
    },
  ]

  const columnsAktifitas = [
    {
      title: 'Tanggal Aktifitas',
      key: 'tgl_aktifitas',
      dataIndex: 'tgl_aktifitas',
      render: (tgl_aktifitas) =>
        tgl_aktifitas
          ? dayjs(tgl_aktifitas)
              .locale('id')
              .format('DD MMMM YYYY HH:mm')
          : '-',
    },
    {
      title: 'Aktifitas',
      key: 'aktifitas',
      dataIndex: 'aktifitas',
      render: (aktifitas) => (
        <Typography.Text>{aktifitas}</Typography.Text>
      ),
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
              setAktifitas((prevValue) => ({
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
                endpoint: `/aktifitas/delete/${item?.id}`,
                fetchingData: () => reloadDataAktifitas(''),
              })
            }
          >
            Hapus
          </Button>
        </Space>
      ),
    },
  ]

  const columnsKinerja = [
    {
      title: 'Periode',
      render: ({ year, month }) => (
        <Typography.Text>{`${year} ${getMonthId({
          month,
        })}`}</Typography.Text>
      ),
    },
    {
      title: 'Nilai',
      render: ({ count }) => (
        <Typography.Text>
          {count ? `${Math.round((count / 20) * 100)}%` : 0}
        </Typography.Text>
      ),
    },
    {
      title: 'Status',
      width: 500,
      render: ({ count }) => (
        <Typography.Text>
          {statusKinerja({ value: Math.round((count / 20) * 100) })}
        </Typography.Text>
      ),
    },
  ]

  return (
    <Card title="Detail Pegawai" bordered={false}>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          {messageGolongan({ data: detailPegawai?.data ?? {} })}
        </Col>
        <Col span={24}>
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
        </Col>
      </Row>
      <Row>
        <Flex
          style={{ width: '100%', paddingTop: '20px' }}
          align="center"
          justify="space-between"
        >
          <Title level={5}>Data Absensi</Title>
          <RoleComponentRender
            condition={['admin'].includes(
              roleUser({ user: profileUser }),
            )}
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() =>
                setAbsensi((prevValue) => ({
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
          dataSource={
            Array.isArray(dataAbsensi?.data) ? dataAbsensi?.data : []
          }
          columns={columnsAbsensi}
          loading={isLoadingAbsensi}
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
          <Title level={5}>Data Kinerja</Title>
        </Flex>
        <Table
          rowKey="data-pekerjaan"
          dataSource={
            Array.isArray(dataKinerja?.data) ? dataKinerja?.data : []
          }
          columns={columnsKinerja}
          loading={isLoadingKinerja}
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
          <Title level={5}>Data Aktifitas</Title>
          <RoleComponentRender
            condition={['admin'].includes(
              roleUser({ user: profileUser }),
            )}
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() =>
                setAktifitas((prevValue) => ({
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
          dataSource={
            Array.isArray(dataAktifitas?.data)
              ? dataAktifitas?.data
              : []
          }
          columns={columnsAktifitas}
          loading={isLoadingAktifitas}
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
          dataSource={
            Array.isArray(dataPekerjaan?.data)
              ? dataPekerjaan?.data
              : []
          }
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
          dataSource={
            Array.isArray(dataKeluarga?.data)
              ? dataKeluarga?.data
              : []
          }
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
          dataSource={
            Array.isArray(dataPendidikan?.data)
              ? dataPendidikan?.data
              : []
          }
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
      {absensi?.show && (
        <Absensi
          id={id}
          data={absensi}
          onClose={() => {
            setAbsensi((prevValue) => ({
              ...prevValue,
              show: false,
              id: '',
            }))
            reloadDataAbsensi('')
          }}
        />
      )}
      {aktifitas?.show && (
        <Aktifitas
          id={id}
          data={aktifitas}
          onClose={() => {
            setAktifitas((prevValue) => ({
              ...prevValue,
              show: false,
              id: '',
            }))
            reloadDataAktifitas('')
          }}
        />
      )}
    </Card>
  )
}

export default PegawaiDetail
