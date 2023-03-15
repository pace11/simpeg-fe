import dynamic from 'next/dynamic'
import { Tabs } from 'antd'

const Pegawai = dynamic(() => import('./component/pegawai'))
const Jabatan = dynamic(() => import('./component/jabatan'))
const Golongan = dynamic(() => import('./component/golongan'))
const Agama = dynamic(() => import('./component/agama'))

const Trash = () => {
  return (
    <Tabs
      defaultActiveKey="pegawai"
      items={[
        { key: 'pegawai', label: 'Pegawai', children: <Pegawai /> },
        { key: 'jabatan', label: 'Jabatan', children: <Jabatan /> },
        {
          key: 'golongan',
          label: 'Golongan',
          children: <Golongan />,
        },
        { key: 'agama', label: 'Agama', children: <Agama /> },
      ]}
    />
  )
}

export default Trash
