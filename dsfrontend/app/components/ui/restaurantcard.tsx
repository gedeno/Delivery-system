import React from 'react'
import { MapPin } from 'lucide-react'
import Link from 'next/link'

type Props = {}

export default function Restaurantcard({}: Props) {
  return (
    <Link href="/restaurants/1" className=' dark:text-white dark:bg-gray-800 md:flex md:flex-row bg-gray-200 border border-gray-300 rounded-2xl  flex-col hover:shadow-2xl hover:-translate-y-1 transition hover:border-orange-500 '>
        <div className='bg-amber-500 rounded-t-2xl md:rounded-l-2xl md:w-40  mx-1 my-1 h-30'></div>
        <div className='dark:text-white w-full p-4 flex-col items-center justify-center'>
            <div className='flex justify-between'>
                <h1 className='font-bold text-xl'>Jeles Food</h1>
                 <h1 className='bg-green-200 rounded-2xl flex items-center self-start px-2 text-green-600 text-sm'>Active</h1>

            </div>
            <div className='mt-5 flex gap-2 items-center self-end text-black'>
                <MapPin size={20} className="dark:text-white" />
                <span className="dark:text-white" >menahariya jebra </span>
            </div>
           
        </div>
    </Link>
  )
}