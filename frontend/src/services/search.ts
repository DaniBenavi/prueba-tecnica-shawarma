import { type ApiSearchResponse, type Data } from '../types'
import { Api_Host } from '../config'

export const searchData = async (search: string): Promise<[Error?, Data?]> => {
  try {
    const res = await fetch(`${Api_Host}/api/users?q=${search}`)

    if (!res.ok) return [new Error(`Error searching data: ${res.statusText}`)]
    const json = (await res.json()) as ApiSearchResponse

    return [undefined, json.data]
  } catch (error) {
    if (error instanceof Error) return [error]
  }

  return [new Error('Unknown error')]
}
