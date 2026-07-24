import axiosClient from '../../lib/axios'
import { useQuery } from '@tanstack/vue-query'
import { toValue, type MaybeRefOrGetter } from 'vue'

interface Item {
  id: number
  name: string
  photo: string
  photoType: string
}

interface ItemWithDetails {
  id: number
  name: string
  photo: string
  photoType: string
  data: {
    story?: string
    stats?: Record<string, number>
    perks?: string[]
    tags?: string[]
  } | null
}

const getAllItem = async (search: string): Promise<Item[]> => {
  const response = await axiosClient.get('item/get-all-item', {
    params: { search },
  })
  return response.data
}

export const useGetAllItem = (search: MaybeRefOrGetter<string>) => {
  return useQuery({
    queryKey: ['items', search],
    queryFn: () => getAllItem(toValue(search)),
  })
}

const getItem = async (id: number): Promise<ItemWithDetails> => {
  const response = await axiosClient.get(`item/get-item/${id}`)
  const item = response.data

  if (typeof item.data === 'string') {
    item.data = JSON.parse(item.data)
  }

  return item
}

export const useGetItem = (id: MaybeRefOrGetter<number>, enabled: MaybeRefOrGetter<boolean>) => {
  return useQuery({
    queryKey: ['item', id],
    queryFn: () => getItem(toValue(id)),
    enabled: enabled,
  })
}
