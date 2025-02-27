import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import SelectInput from '@/Components/SelectInput';
import TextAreaInput from '@/Components/TextAreaInput';
import TextInput from '@/Components/TextInput';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Create({ auth }) {
    const { data, setData, post, errors, reset } = useForm({
        email: '',
        name: '',
    })

    const onSubmit = (e) => {
        e.preventDefault();

        post(route('user.store'));
    }

    return (
        <Authenticated
            user = {auth.user}
            header = {
                <h2 className='font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight'>
                    Create New User
                </h2>
            }
        >
            <Head title='User' />

            <div className='py-12'>
                <div className='max-w-7xl mx-auto sm:px-6 lg:px-8'>
                    <div className='bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg'>
                        <form
                            onSubmit={onSubmit}
                            className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg"
                        >
                            <div className='mt-4'>
                                <InputLabel
                                    htmlFor='user_name'
                                    value='Name'
                                />
                                <TextInput
                                    id='user_name'
                                    type='text'
                                    name='name'
                                    value={data.name}
                                    className='mt-1 block w-full'
                                    isFocused={true}
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                                <InputError message={ errors.name } className='mt-2' />
                            </div>
                            <div className='mt-4'>
                                <InputLabel
                                    htmlFor='user_email'
                                    value='Email'
                                />
                                <TextInput
                                    id='user_email'
                                    type='text'
                                    name='email'
                                    value={data.email}
                                    className='mt-1 block w-full'
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                <InputError message={ errors.email } className='mt-2' />
                            </div>
                            <div className='mt-4 text-right'>
                                <Link
                                    href={route('user.index')}
                                    className='bg-gray-100 py-1 px-3 text-gray-800 rounded shadow transition-all hover:bg-gray-200 mr-2'
                                >
                                    Cancel
                                </Link>
                                <button className='bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600'>
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                    
            </div>
        </Authenticated>
    )
}