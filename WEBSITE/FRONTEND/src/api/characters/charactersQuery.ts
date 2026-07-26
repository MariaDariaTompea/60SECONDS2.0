import axiosClient from '../../lib/axios'
import { useQuery } from '@tanstack/vue-query'
import { toValue, type MaybeRefOrGetter } from 'vue'

interface Character {
  id: number
  name: string
  photo: string
  photoType: string
}

interface CharacterWithDetails {
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

interface NameEntry {
  id: number
  name: string
  mention: string
  type: 'character' | 'item'
}

const getAllCharacter = async (search: string): Promise<Character[]> => {
  const response = await axiosClient.get('character/get-all-character', {
    params: { search },
  })
  return response.data
}

export const useGetAllCharacter = (search: MaybeRefOrGetter<string>) => {
  return useQuery({
    queryKey: ['characters', search],
    queryFn: () =>  getAllCharacter(toValue(search)),
  })
}

const getCharacter = async (id: number): Promise<CharacterWithDetails> => {
  const response = await axiosClient.get(`character/get-character/${id}`)
  const character = response.data

  if (typeof character.data === 'string') {
    character.data = JSON.parse(character.data)
  }

  return character
}

export const useGetCharacter = (
  id: MaybeRefOrGetter<number>,
  enabled: MaybeRefOrGetter<boolean>,
) => {
  return useQuery({
    queryKey: ['character', id],
    queryFn: () => getCharacter(toValue(id)),
    enabled: enabled,
  })
}

const getAllNames = async (): Promise<NameEntry[]> => {
  const response = await axiosClient.get('character/get-names')
  return response.data
}

export const useGetAllNames = () => {
  return useQuery({
    queryKey: ['names'],
    queryFn: getAllNames,
  })
}
