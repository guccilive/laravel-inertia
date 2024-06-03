<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Support\Str;
use App\Http\Resources\TaskResource;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\ProjectResource;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $sortFields = request('sort_field', 'created_at');
        $sortDirection = request('sort_direction', 'desc');

        $query = Project::query();
        $query->when(request('name'), function ($q) {
            $q->where('name', 'LIKE', '%' . request('name') . '%');
        });
        $query->when(request('status'), function ($q) {
            $q->where('status', request('status'));
        });
        $projects = $query->with(['createdBy', 'updatedBy'])
            ->orderBy($sortFields, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);
            
        return inertia('Project/Index',[
            'projects' => ProjectResource::collection($projects),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia("Project/Create");
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProjectRequest $request)
    {
        $validated = $request->validated();
        /** @var $image \Illuminate\Http\UploadedFile */
        $image = $validated['image'] ?? null;
        if($image)
        {
            $validated['image'] = $image->store('project/'. Str::uuid(), 'public');
        }

        $project = Project::create([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'status' => $validated['status'],
            'due_date' => $validated['due_date'],
            'image_path' => $validated['image'],
            'created_by' => Auth::id(),
            'updated_by' => Auth::id(),

        ]);

        return to_route('project.index')->with('success', 'Project created successfully.');

    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project)
    {
        $tasks = null;
        $query = $project->tasks();
        if ($query) {
            $sortFields = request('sort_field', 'created_at');
            $sortDirection = request('sort_direction', 'desc');

            $query->when(request('name'), function ($q) {
                $q->where('name', 'LIKE', '%' . request('name') . '%');
            });
            $query->when(request('status'), function ($q) {
                $q->where('status', request('status'));
            });
            $tasks = $query->with([
                'createdBy',
                'updatedBy',
                'assignedUser',
                ])
                ->orderBy($sortFields, $sortDirection)
                ->paginate(10)
                ->onEachSide(1);
            }

        $project->loadMissing(['createdBy', 'updatedBy']);
        return inertia('Project/Show', [
            'project' => new ProjectResource($project),
            'tasks' => TaskResource::collection($tasks),
            'queryParams' => request()->query() ?: null,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project)
    {
        return inertia('Project/Edit', [
            'project' => new ProjectResource($project),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProjectRequest $request, Project $project)
    {
        // dd($project);
        $validated = $request->validated();
        // /** @var $image \Illuminate\Http\UploadedFile */
        $image = $validated['image'] ?? null;
        if($image)
        {
            if ($project->image_path) {
                Storage::disk('public')->deleteDirectory(dirname($project->image_path));
            }
            $validated['image'] = $image->store('project/'. Str::uuid(), 'public');
        } else {
            $validated['image'] = $project->image_path;
        }

        $project->update([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'status' => $validated['status'],
            'due_date' => $validated['due_date'],
            'image_path' => $validated['image'],
            'created_by' => Auth::id(),
            'updated_by' => Auth::id(),

        ]);

        return to_route('project.index')->with('success', 'Project updated successfully.');

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        $project->loadMissing(['tasks']);
        if(count($project->tasks))
        {
            return to_route('project.index')->with('success', 'Project has tasks attached. Please delete tasks first');
        }
        $name = $project->name;
        if ($project->image_path) {
            Storage::disk('public')->deleteDirectory(dirname($project->image_path));
        }
        $project->delete();
        return to_route('project.index')->with('success', "Project $name deleted successfully");
    }
}
