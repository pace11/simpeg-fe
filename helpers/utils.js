import { Alert } from 'antd'
import Axios from 'axios'
import dayjs from 'dayjs'
import Cookies from 'js-cookie'

export const getMeApi = async ({ token }) => {
  try {
    const result = await Axios({
      method: 'GET',
      url: `${process.env.NEXT_PUBLIC_API}/user/me`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return result
  } catch (error) {
    throw error
  }
}

export const updatePasswordApi = async ({ payload, token }) => {
  try {
    const result = await Axios({
      method: 'POST',
      url: `${process.env.NEXT_PUBLIC_API}/update-password`,
      data: payload,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return result
  } catch (error) {
    throw error
  }
}

export const authApi = async ({ endpoint, payload }) => {
  try {
    const result = await Axios({
      method: 'POST',
      url: `${process.env.NEXT_PUBLIC_API}${endpoint}`,
      data: payload,
    })
    return result
  } catch (error) {
    throw error
  }
}

export const logoutApi = async () => {
  try {
    const result = await Axios({
      method: 'GET',
      url: `${process.env.NEXT_PUBLIC_API}/logout`,
      headers: {
        Authorization: `Bearer ${Cookies.get('token_simpeg')}`,
      },
    })
    return result
  } catch (error) {
    throw error
  }
}

export const createApi = async ({ endpoint, payload }) => {
  try {
    const result = await Axios({
      method: 'POST',
      url: `${process.env.NEXT_PUBLIC_API}${endpoint}`,
      data: payload,
      headers: {
        Authorization: `Bearer ${Cookies.get('token_simpeg')}`,
      },
    })
    return result
  } catch (error) {
    throw error
  }
}

export const updateApi = async ({
  endpoint,
  payload,
  method = 'PATCH',
}) => {
  try {
    const result = await Axios({
      method,
      url: `${process.env.NEXT_PUBLIC_API}${endpoint}`,
      data: payload,
      headers: {
        Authorization: `Bearer ${Cookies.get('token_simpeg')}`,
      },
    })
    return result
  } catch (error) {
    throw error
  }
}

export const deleteApi = async ({ endpoint }) => {
  try {
    const result = await Axios({
      method: 'DELETE',
      url: `${process.env.NEXT_PUBLIC_API}${endpoint}`,
      headers: {
        Authorization: `Bearer ${Cookies.get('token_simpeg')}`,
      },
    })
    return result
  } catch (error) {
    throw error
  }
}

export const restoreApi = async ({ endpoint }) => {
  try {
    const result = await Axios({
      method: 'POST',
      url: `${process.env.NEXT_PUBLIC_API}${endpoint}`,
      headers: {
        Authorization: `Bearer ${Cookies.get('token_simpeg')}`,
      },
    })
    return result
  } catch (error) {
    throw error
  }
}

export const randomColor = () => {
  const color = [
    '#f9ca24',
    '#f0932b',
    '#f9ca24',
    '#6ab04c',
    '#5B8FF9',
    '#5B8FF9',
    '#eb4d4b',
    '#eb4d4b',
    '#be2edd',
    '#e056fd',
    '#7ed6df',
    '#30336b',
  ]
  const randomNumber = Math.round(
    Math.random() * (color.length - 0) + 0,
  )
  return color[randomNumber]
}

export const roleUser = ({ user = {} }) => {
  return String(user?.role || '').toLocaleLowerCase()
}

export const messageGolongan = ({ data = {} }) => {
  const diff = dayjs().diff(data?.tmt_golongan, 'year')

  if (diff >= 2)
    return (
      <Alert
        message="Sudah siap untuk naik golongan ke selanjutnya"
        type="success"
        showIcon
      />
    )
  return null
}

export const statusKinerja = ({ value = 0 }) => {
  if (value >= 90) {
    return <Alert message="Sangat Baik" type="success" showIcon />
  }

  if (value >= 75 && value < 90) {
    return <Alert message="Cukup Baik" type="success" showIcon />
  }

  if (value >= 60 && value < 75) {
    return <Alert message="Baik" type="success" showIcon />
  }

  return (
    <Alert message="Perlu ditingkatkan" type="warning" showIcon />
  )
}

export const getMonthId = ({ month = 0 }) => {
  const mapping = [
    '',
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ]
  return mapping?.[month]
}
