import { useState } from 'react'
import './App.css'
import { uploadFile } from './services/upload'
import { Toaster, toast } from 'sonner'
import { type Data } from './types'
import { Search } from './steps/Search'

const APP_STATUS = {
  Idle: 'idle',
  Error: 'error',
  Ready_Upload: 'ready_upload',
  Uploading: 'uploading',
  Ready_Usage: 'ready_usage'
} as const

const BUTTON_TEXT = {
  [APP_STATUS.Ready_Upload]: 'Subir Archivo',
  [APP_STATUS.Uploading]: 'Subiendo...'
}

type appStatusType = (typeof APP_STATUS)[keyof typeof APP_STATUS]
function App() {
  const [appStatus, setAppStatus] = useState<appStatusType>(APP_STATUS.Idle)
  const [data, setData] = useState<Data>([])
  const [file, setFile] = useState<File | null>(null)

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const [file] = event.target.files ?? []

    if (file) {
      setFile(file)
      setAppStatus(APP_STATUS.Ready_Upload)
    }
  }
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (appStatus !== APP_STATUS.Ready_Upload || !file) {
      return
    }

    setAppStatus(APP_STATUS.Uploading)

    const [error, newData] = await uploadFile(file)

    console.log({ newData })

    if (error) {
      setAppStatus(APP_STATUS.Error)
      toast.error(error.message)
      return
    }

    setAppStatus(APP_STATUS.Ready_Usage)
    if (newData) setData(newData)

    toast.success('File uploaded successfully')
  }

  const showButton = appStatus === APP_STATUS.Ready_Upload || appStatus === APP_STATUS.Uploading
  const showInput = appStatus !== APP_STATUS.Ready_Usage

  return (
    <>
      <Toaster />
      <h3 className='text-3xl font-bold dark:text-white pb-3'>Challenge: Upload CSV + Search</h3>
      {showInput && (
        <form className='max-w-md mx-auto' onSubmit={handleSubmit}>
          <label htmlFor='default-search' className='mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white'>
            Search
          </label>
          <div className='relative'>
            <div className='absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none'>
              <svg
                className='w-4 h-4 text-gray-500 dark:text-gray-400'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 20 20'
              >
                <path
                  stroke='currentColor'
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  stroke-width='2'
                  d='m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z'
                />
              </svg>
            </div>
            <input
              className='block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              placeholder='search...'
              required
              disabled={appStatus === APP_STATUS.Uploading}
              onChange={handleInputChange}
              name='file'
              type='file'
              accept='.csv'
            />
          </div>
          {showButton && <button disabled={appStatus === APP_STATUS.Uploading}>{BUTTON_TEXT[appStatus]}</button>}
        </form>
      )}
      {appStatus === APP_STATUS.Ready_Usage && <Search initialData={data} />}
    </>
  )
}

export default App
