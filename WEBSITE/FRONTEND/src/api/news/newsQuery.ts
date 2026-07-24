import axiosClient from '../../lib/axios'
import { useQuery, useInfiniteQuery } from '@tanstack/vue-query'
import { toValue, type MaybeRefOrGetter } from 'vue'

interface News {
  id: number
  title: string
  excerpt: string
  createdAt: string
  updatedAt: string
}

interface NewsBlock {
  type: 'heading' | 'paragraph' | 'list'
  text?: string
  items?: string[]
}

interface News {
  id: number
  title: string
  excerpt: string
  content: {
    blocks: NewsBlock[]
  }
  createdAt: string
  updatedAt: string
}

const getNews = async (): Promise<News[]> => {
  const response = await axiosClient.get('news/get-news')
  return response.data
}

export const useGetNews = () => {
  return useQuery({
    queryKey: ['news'],
    queryFn: getNews,
  })
}

const getAllNews = async (offset: number, search: string) => {
  const response = await axiosClient.get('news/get-all-news', {
    params: { limit: 10, offset, search },
  })
  return response.data
}

export const useGetAllNews = (search: MaybeRefOrGetter<string>) => {
  return useInfiniteQuery({
    queryKey: ['all-news', search],
    queryFn: ({ pageParam }) => getAllNews(pageParam, toValue(search)),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.length * 10
      return loaded < lastPage.total ? loaded : undefined
    },
  })
}
