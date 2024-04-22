import {
  HeartOutlined,
  HomeOutlined,
  LinkOutlined,
  PaperClipOutlined,
  SafetyCertificateOutlined,
  StarOutlined,
  UsergroupAddOutlined
} from '@ant-design/icons'

module.exports = [
  {
    key: '/',
    icon: <HomeOutlined />,
    label: 'Beranda',
  },
  {
    key: 'pegawai',
    icon: <UsergroupAddOutlined />,
    label: 'Pegawai',
  },
  {
    key: 'jabatan',
    icon: <SafetyCertificateOutlined />,
    label: 'Jabatan',
  },
  {
    key: 'golongan',
    icon: <StarOutlined />,
    label: 'Golongan',
  },
  {
    key: 'agama',
    icon: <HeartOutlined />,
    label: 'Agama',
  },
  {
    key: 'keturunan',
    icon: <LinkOutlined />,
    label: 'Keturunan',
  },
  {
    key: 'pendidikan-terakhir',
    icon: <PaperClipOutlined />,
    label: 'Pendidikan Terakhir',
  },
]
