import React, { useRef, useEffect } from 'react';
import TaskTable from './TaskTable';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import useNotification from '@/useNotification';
import NotificationContainer from '@/NotificationContainer';

export default function Index({ auth, tasks, queryParams = null, success }) {
    
    const notificationRef = useNotification(success);

    return (
        <Authenticated
            user = {auth.user}
            header = {
                
                <div className='flex justify-between items-center'>
                    <h2 className='font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight'>
                        Tasks
                    </h2>
                    <Link href={route('task.create')} className='bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all'>
                        Add New
                    </Link>
                </div>
            }
        > 
            <NotificationContainer ref={notificationRef} />
        
            <Head title='Tasks' />
            <div className='py-12'>
                <div className='max-w-7xl mx-auto sm:px-6 lg:px-8'>
                    <div className='bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg'>
                        <div className='p-6 text-gray-900 dark:text-gray-100'>
                            <TaskTable
                                tasks={tasks}
                                queryParams={queryParams}
                            />
                        </div>
                    </div>
                </div>
            </div>

        </Authenticated>
    )
}