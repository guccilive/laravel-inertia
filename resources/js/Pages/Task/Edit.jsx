import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import SelectInput from '@/Components/SelectInput';
import TextAreaInput from '@/Components/TextAreaInput';
import TextInput from '@/Components/TextInput';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Create({ auth, task, users, projects }) {
    const { data, setData, post, errors, reset } = useForm({
        image: '',
        name: task.name || '',
        status: task.status || '',
        description: task.description || '',
        due_date: task.due_date || '',
        priority: task.priority || '',
        assigned_user_id: task.assigned_user_id || '',
        project_id: task.project_id || '',
        _method: 'PUT',
    })
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    const handleImageChange = (e) => {
        setData('image', e.target.files[0]);
    };

    const onSubmit = (e) => {
        console.log(task.id)
        e.preventDefault();
        post(route('task.update', task.id));
    };

    return (
        <Authenticated
            user = {auth.user}
            header = {
                <h2 className='font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight'>
                    Edit Task {task.name}
                </h2>
            }
        >
            <Head title='Task' />

            <div className='py-12'>
                <div className='max-w-7xl mx-auto sm:px-6 lg:px-8'>
                    <div className='bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg'>
                        <form
                            onSubmit={onSubmit}
                            className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg"
                        >
                            {task.image_path && <div>
                                <img src={task.image_path} className='w-64' />
                            </div>}
                            <div className='mt-4'>
                                <InputLabel
                                    htmlFor='task_image_path'
                                    value='Task Image'
                                />
                                <TextInput
                                    id='task_image_path'
                                    type='file'
                                    name='image'
                                    className='mt-1 block w-full'
                                    onChange={handleImageChange}
                                />
                                <InputError message={ errors.image } className='mt-2' />
                            </div>
                            <div className='mt-4'>
                                <InputLabel
                                    htmlFor='task_name'
                                    value='Name'
                                />
                                <TextInput
                                    id='task_name'
                                    type='text'
                                    name='name'
                                    value={data.name}
                                    className='mt-1 block w-full'
                                    isFocused={true}
                                    onChange={handleChange}
                                />
                                <InputError message={ errors.name } className='mt-2' />
                            </div>
                            <div className='mt-4'>
                                <InputLabel
                                    htmlFor='task_description'
                                    value='Description'
                                />
                                <TextAreaInput
                                    id='task_description'
                                    name='description'
                                    value={data.description}
                                    className='mt-1 block w-full'
                                    onChange={handleChange}
                                />
                                <InputError message={ errors.description } className='mt-2' />
                            </div>
                            <div className='mt-4'>
                                <InputLabel
                                    htmlFor='task_due_date'
                                    value='Due Date'
                                />
                                <TextInput
                                    id='task_due_date'
                                    type='date'
                                    name='due_date'
                                    value={data.due_date}
                                    className='mt-1 block w-full'
                                    isFocused={true}
                                    onChange={handleChange}
                                />
                                <InputError message={ errors.due_date } className='mt-2' />
                            </div>
                            <div className='mt-4'>
                                <InputLabel
                                    htmlFor='task_status'
                                    value='Priority'
                                />
                                <SelectInput
                                    id='task_status'
                                    name='status'
                                    value={data.status}
                                    className='mt-1 block w-full'
                                    onChange={handleChange}
                                >
                                    <option value=''>Select Priority</option>
                                    <option value='pending'>Pending</option>
                                    <option value='in_progress'>In Progress</option>
                                    <option value='completed'>Completed</option>
                                </SelectInput>
                                <InputError message={ errors.status } className='mt-2' />
                            </div>
                            <div className='mt-4'>
                                <InputLabel
                                    htmlFor='task_priority'
                                    value='Priority'
                                />
                                <SelectInput
                                    id='task_priority'
                                    name='priority'
                                    value={data.priority}
                                    className='mt-1 block w-full'
                                    onChange={handleChange}
                                >
                                    {/* <option value=''>Select Priority</option> */}
                                    <option value='low'>Low</option>
                                    <option value='medium'>Medium</option>
                                    <option value='high'>High</option>
                                </SelectInput>
                                <InputError message={ errors.priority } className='mt-2' />
                            </div>
                            <div className='mt-4'>
                                <InputLabel
                                    htmlFor='task_assigned_user'
                                    value='Assigned User'
                                />
                                <SelectInput
                                    id='task_assigned_user'
                                    name='assigned_user_id'
                                    value={task.user}
                                    className='mt-1 block w-full'
                                    onChange={handleChange}
                                >
                                    {/* <option value=''>Select Priority</option> */}
                                    {users && users.data.map((user) => (
                                        <option key={user.id} value={user.id}>{user.name}</option>
                                    ))}
                                </SelectInput>
                                <InputError message={ errors.usassigned_user_ider } className='mt-2' />
                            </div>
                            <div className='mt-4'>
                                <InputLabel
                                    htmlFor='task_project'
                                    value='Project'
                                />
                                <SelectInput
                                    id='task_project'
                                    name='project_id'
                                    value={task.project_id}
                                    className='mt-1 block w-full'
                                    onChange={handleChange}
                                >
                                    {/* <option value=''>Select Priority</option> */}
                                    {projects && projects.data.map((project) => (
                                        <option key={project.id} value={project.id}>{project.name}</option>
                                    ))}
                                </SelectInput>
                                <InputError message={ errors.project_id } className='mt-2' />
                            </div>
                            <div className='mt-4 text-right'>
                                <Link
                                    href={route('task.index')}
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