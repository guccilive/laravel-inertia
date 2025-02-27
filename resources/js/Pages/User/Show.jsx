import Authenticated from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import TaskTable from '../Task/TaskTable';

export default function Show({ auth, user, tasks, queryParams}) {
    return (
        <Authenticated
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-right">
                    {`User "${user.name}"`}
                </h2>
            }
        >
            <Head title={`User "${user.name}"`} />

            <div className='py-12'>
                <div className='max-w-7xl mx-auto sm:px-6 lg:px-8'>
                    <div className='bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg'>
                        <div className='p-6 text-gray-900 dark:text-gray-100'>
                            <div className='grid gap-1 grid-cols-2 mt-2'>
                                <div>
                                    <div>
                                        <label className='font-bold text-lg'>User ID</label>
                                        <p className='mt-1'>{user.id}</p>
                                    </div>
                                    <div className='mt-4'>
                                        <label className='font-bold text-lg'>User Name</label>
                                        <p className='mt-1'>{user.name}</p>
                                    </div>
                                    <div className='mt-4'>
                                        <label className='font-bold text-lg'>Status</label>
                                        <p className='mt-1'>{user.email}</p>
                                    </div>
                                    <div className='mt-4'>
                                        <label className='font-bold text-lg'>Created At</label>
                                        <p className='mt-1'>{user.created_at}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                    
            </div>
            <div className='pb-6'>
                <div className='max-w-7xl mx-auto sm:px-6 lg:px-8'>
                    <div className='bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg'>
                        <div className='p-6 text-gray-900 dark:text-gray-100'>
                            {tasks.data && tasks.data.length > 0 ? (
                                <TaskTable tasks={tasks} queryParams={queryParams} hideUserColumn={true}/>
                            ) : (
                                <div className='text-gray-800 text-center'>No Task available</div>
                            )}
                        </div>
                    </div>
                </div>
                    
            </div>
        </Authenticated>
    )
}