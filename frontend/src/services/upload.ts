import { ApiUploadResponse, type Data } from '../types'
import { Api_Host } from '../config'

export const uploadFile = async (file: File): Promise<[Error?, Data?]> => {
  const formData = new FormData()
  formData.append('file', file)

  try {
    const res = await fetch(`${Api_Host}/api/files`, { method: 'POST', body: formData })

    if (!res.ok) return [new Error(`Error uploading file: ${res.statusText}`)]
    const json = (await res.json()) as ApiUploadResponse

    return [undefined, json.data]
  } catch (error) {
    if (error instanceof Error) return [error]
  }

  return [new Error('Unknown error')]
}
