import useSWR from 'swr'
import Cookies from 'js-cookie'

const fetcher = (...args) =>
  fetch(...args, {
    headers: {
      Authorization: `Bearer ${Cookies.get('token_simpeg')}`,
    },
  }).then((res) => res.json())

export const HookSwr = ({ path }) => {
  const { data, error, mutate, isValidating } = useSWR(
    `${process.env.NEXT_PUBLIC_API}${path || `/user/me`}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  )

  return {
    data: data || null,
    isLoading: isValidating,
    isError: error,
    reloadData: () => mutate(),
  }
}
