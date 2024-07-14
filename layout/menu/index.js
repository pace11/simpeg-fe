import {
  HeartOutlined,
  HomeOutlined,
  LinkOutlined,
  PaperClipOutlined,
  SafetyCertificateOutlined,
  StarOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons'

const path = ({ role }) => [
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
  role === 'admin' && {
    key: 'jabatan',
    icon: <SafetyCertificateOutlined />,
    label: 'Jabatan',
  },
  role === 'admin' && {
    key: 'golongan',
    icon: <StarOutlined />,
    label: 'Golongan',
  },
  role === 'admin' && {
    key: 'agama',
    icon: <HeartOutlined />,
    label: 'Agama',
  },
  role === 'admin' && {
    key: 'keturunan',
    icon: <LinkOutlined />,
    label: 'Keturunan',
  },
  role === 'admin' && {
    key: 'pendidikan-terakhir',
    icon: <PaperClipOutlined />,
    label: 'Pendidikan Terakhir',
  },
]

module.exports = {
  menu: ({ role }) => path({ role }),
}
