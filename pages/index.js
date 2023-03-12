import { Card, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons';

export default function Home() {
  return (
    <Card
      title="Beranda"
      bordered={false}
      extra={<Button type="primary" icon={<PlusOutlined />}>Tambah data</Button>}
    >
      <p>Card content</p>
    </Card>
  )
}
