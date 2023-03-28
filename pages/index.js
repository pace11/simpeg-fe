import { Row, Col, Card, Statistic } from 'antd'
import {
  StarOutlined,
  SafetyCertificateOutlined,
  HeartOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons'
import BarChart from '@/components/bar-chart'
import PieChart from '@/components/pie-chart'
import { HookSwr } from '@/lib/hooks/HookSwr'
import { randomColor } from '@/helpers/utils'

export default function Home() {
  const { data: dataCharts } = HookSwr({ path: '/pegawai/charts' })
  const golongan = dataCharts?.data?.golongan ?? []
  const jabatan = dataCharts?.data?.jabatan ?? []
  const agama = dataCharts?.data?.agama ?? []
  const keturunan = dataCharts?.data?.keturunan ?? []
  const pendidikanTerakhir =
    dataCharts?.data?.pendidikan_terakhir ?? []
  const pegawai = dataCharts?.data?.pegawai ?? 0

  return (
    <>
      <Row gutter={14} style={{ marginBottom: '15px' }}>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Total Pegawai"
              value={pegawai}
              prefix={<UsergroupAddOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Total Golongan"
              value={golongan.length}
              prefix={<StarOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Total Jabatan"
              value={jabatan.length}
              prefix={<SafetyCertificateOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Total Agama"
              value={agama.length}
              prefix={<HeartOutlined />}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={14} style={{ marginBottom: '15px' }}>
        <Col span={8}>
          <Card title="Grafik Golongan" bordered={false}>
            <BarChart
              data={{
                labels:
                  !!golongan.length > 0
                    ? golongan.map((item) => item?.name)
                    : [],
                datasets: [
                  {
                    data:
                      !!golongan.length > 0
                        ? golongan.map((item) => item.value)
                        : [],
                    backgroundColor:
                      !!golongan.length > 0
                        ? golongan.map(() => randomColor())
                        : [],
                  },
                ],
              }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Grafik Jabatan" bordered={false}>
            <PieChart
              data={{
                labels:
                  !!jabatan.length > 0
                    ? jabatan.map((item) => item?.name)
                    : [],
                datasets: [
                  {
                    data:
                      !!jabatan.length > 0
                        ? jabatan.map((item) => item.value)
                        : [],
                    backgroundColor:
                      !!jabatan.length > 0
                        ? jabatan.map(() => randomColor())
                        : [],
                  },
                ],
              }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Grafik Agama" bordered={false}>
            <BarChart
              data={{
                labels:
                  !!agama.length > 0
                    ? agama.map((item) => item?.name)
                    : [],
                datasets: [
                  {
                    data:
                      !!agama.length > 0
                        ? agama.map((item) => item.value)
                        : [],
                    backgroundColor:
                      !!agama.length > 0
                        ? agama.map(() => randomColor())
                        : [],
                  },
                ],
              }}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={14}>
        <Col span={8}>
          <Card title="Grafik Keturunan" bordered={false}>
            <PieChart
              data={{
                labels:
                  !!keturunan.length > 0
                    ? keturunan.map((item) => item?.name)
                    : [],
                datasets: [
                  {
                    data:
                      !!keturunan.length > 0
                        ? keturunan.map((item) => item.value)
                        : [],
                    backgroundColor:
                      !!keturunan.length > 0
                        ? keturunan.map(() => randomColor())
                        : [],
                  },
                ],
              }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Grafik Pendidikan Terakhir" bordered={false}>
            <BarChart
              data={{
                labels:
                  !!pendidikanTerakhir.length > 0
                    ? pendidikanTerakhir.map((item) => item?.name)
                    : [],
                datasets: [
                  {
                    data:
                      !!pendidikanTerakhir.length > 0
                        ? pendidikanTerakhir.map((item) => item.value)
                        : [],
                    backgroundColor:
                      !!pendidikanTerakhir.length > 0
                        ? pendidikanTerakhir.map(() => randomColor())
                        : [],
                  },
                ],
              }}
            />
          </Card>
        </Col>
      </Row>
    </>
  )
}
