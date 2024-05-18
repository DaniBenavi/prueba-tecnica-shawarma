import { useEffect, useState } from 'react'
import { Data } from '../types'
import { searchData } from '../services/search'
import { toast } from 'sonner'
import { useDebounce } from '@uidotdev/usehooks'

const debounceTime = 300
export const Search = ({ initialData }: { initialData: Data }) => {
  const [data, setData] = useState<Data>(initialData)
  const [search, setSearch] = useState<string>(() => {
    const searchParams = new URLSearchParams(window.location.search)
    return searchParams.get('q') ?? ''
  })

  const [isEmpty, setIsEmpty] = useState<boolean>(false)

  const debounceSearch = useDebounce(search, debounceTime)

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
  }

  useEffect(() => {
    const newPathname = debounceSearch === '' ? window.location.pathname : `?q=${debounceSearch}`

    window.history.replaceState({}, '', newPathname)
  }, [debounceSearch])

  useEffect(() => {
    if (!debounceSearch) {
      setData(initialData)
      return
    }
    searchData(debounceSearch).then(response => {
      const [error, newData] = response
      if (error) {
        toast.error(error.message)
        return
      }

      if (newData && newData.length > 0) {
        setData(newData)
        setIsEmpty(false)
      } else {
        setData([])
        setIsEmpty(true)
      }
    })
  }, [debounceSearch, initialData])

  return (
    <div className='relative overflow-x-auto'>
      <h1>Search</h1>
      <form className='pb-4'>
        <input
          className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
          onChange={handleSearch}
          type='search'
          placeholder='Buscar información'
        />
      </form>
      {isEmpty ? (
        <p>No se encontro informacion</p>
      ) : (
        <table className='w-full text-lg text-left rtl:text-right text-gray-500 dark:text-gray-400'>
          <thead className='text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
            <tr>
              {Object.keys(data[0]).map(key => (
                <th scope='col' className='px-6 py-3' key={key}>
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map(row => (
              <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700' key={row.id}>
                {Object.entries(row).map(([key, value]) => (
                  <td className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white' key={key}>
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
