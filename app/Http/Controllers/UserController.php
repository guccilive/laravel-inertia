<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Str;
use App\Http\Resources\TaskResource;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {     
        $sortFields = request('sort_field', 'name');
        $sortDirection = request('sort_direction', 'asc');

        $query = User::query();
        $query->when(request('name'), function ($q) {
            $q->where('name', 'LIKE', '%' . request('name') . '%');
        });
        $query->when(request('email'), function ($q) {
            $q->where('email', 'LIKE', '%' . request('email') . '%');
        });
        $users = $query->orderBy($sortFields, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);
            
        return inertia('User/Index',[
            'users' => UserResource::collection($users),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia("User/Create");
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        $validated = $request->validated();

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make(Str::random(16))

        ]);

        return to_route('user.index')->with('success', 'User created successfully.');

    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        $tasks = null;
        $query = $user->tasks();
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
        return inertia('User/Show', [
            'user' => new UserResource($user),
            'tasks' => TaskResource::collection($tasks),
            'queryParams' => request()->query() ?: null,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        return inertia('User/Edit', [
            'user' => new UserResource($user),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        $validated = $request->validated();

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],

        ]);

        return to_route('user.index')->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $name = $user->name;
        $user->delete();
        return to_route('user.index')->with('success', "User $name deleted successfully");
    }
}
