<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\User;
use App\Models\Project;
use Illuminate\Support\Str;
use App\Http\Resources\TaskResource;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Resources\ProjectResource;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\UpdateTaskRequest;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $sortFields = request('sort_field', 'created_at');
        $sortDirection = request('sort_direction', 'desc');

        $query = Task::query();
        $query->when(request('name'), function ($q) {
            $q->where('name', 'LIKE', '%' . request('name') . '%');
        });
        $query->when(request('status'), function ($q) {
            $q->where('status', request('status'));
        });
        $query->when(request('priority'), function ($q) {
            $q->where('priority', request('priority'));
        });
        $query->when(request('user'), function ($q) {
            $q->where('assigned_use_id', 'LIKE', '%' . request('user') . '%');
        });
        $tasks = $query->with(['createdBy', 'updatedBy'])
            ->orderBy($sortFields, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);

        return inertia('Task/Index', [
            'tasks' => TaskResource::collection($tasks),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $users = User::orderBy('name')->get();
        $projects = Project::orderBy('name')->get();
        return inertia("Task/Create", [
            'projects' => ProjectResource::collection($projects),
            'users' => UserResource::collection($users),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTaskRequest $request)
    {
        $validated = $request->validated();
        /** @var $image \Illuminate\Http\UploadedFile */
        $image = $validated['image'] ?? null;
        if ($image) {
            $validated['image'] = $image->store('task/' . Str::uuid(), 'public');
        }

        $task = Task::create([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'status' => $validated['status'],
            'due_date' => $validated['due_date'],
            'image_path' => $validated['image'],
            'project_id' => $validated['project_id'],
            'priority' => $validated['priority'],
            'assigned_user_id' => $validated['assigned_user_id'],
            'created_by' => Auth::id(),
            'updated_by' => Auth::id(),

        ]);

        return to_route('task.index')->with('success', 'Task created successfully.');

    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task)
    {
        // $tasks = null;
        // $query = $task->tasks();
        // if ($query) {
        //     $sortFields = request('sort_field', 'name');
        //     $sortDirection = request('sort_direction', 'asc');

        //     $query->when(request('name'), function ($q) {
        //         $q->where('name', 'LIKE', '%' . request('name') . '%');
        //     });
        //     $query->when(request('status'), function ($q) {
        //         $q->where('status', request('status'));
        //     });
        //     $query->when(request('priority'), function ($q) {
        //         $q->where('priority', request('priority'));
        //     });
        //     $query->when(request('user'), function ($q) {
        //         $q->where('assigned_use_id', 'LIKE', '%' . request('user') . '%');
        //     });
        //     $tasks = $query->with([
        //         'createdBy',
        //         'updatedBy',
        //         'assignedUser',
        //     ])
        //         ->orderBy($sortFields, $sortDirection)
        //         ->paginate(10)
        //         ->onEachSide(1);
        // }

        // $task->loadMissing(['createdBy', 'updatedBy']);
        // return inertia('Task/Show', [
        //     'tasks' => TaskResource::collection($tasks),
        //     'queryParams' => request()->query() ?: null,
        // ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Task $task)
    {
        $users = User::orderBy('name')->get();
        $projects = Project::orderBy('name')->get();
        return inertia("Task/Edit", [
            'task' => new TaskResource($task),
            'projects' => ProjectResource::collection($projects),
            'users' => UserResource::collection($users),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTaskRequest $request, Task $task)
    {
        $validated = $request->validated();
        // /** @var $image \Illuminate\Http\UploadedFile */
        $image = $validated['image'] ?? null;
        if ($image) {
            if ($task->image_path) {
                Storage::disk('public')->deleteDirectory(dirname($task->image_path));
            }
            $validated['image'] = $image->store('task/' . Str::uuid(), 'public');
        } else {
            $validated['image'] = $task->image_path;
        }

        $task->update([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'status' => $validated['status'],
            'due_date' => $validated['due_date'],
            'image_path' => $validated['image'],
            'project_id' => $validated['project_id'],
            'priority' => $validated['priority'],
            'assigned_user_id' => $validated['assigned_user_id'],
            'updated_by' => Auth::id(),

        ]);

        return to_route('task.index')->with('success', 'Task updated successfully.');

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        $name = $task->name;
        if ($task->image_path) {
            Storage::disk('public')->deleteDirectory(dirname($task->image_path));
        }
        $task->delete();
        return to_route('task.index')->with('success', "Task $name deleted successfully");
    }
}