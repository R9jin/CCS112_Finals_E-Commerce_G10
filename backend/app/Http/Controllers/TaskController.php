<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

/**
 * Controller handling standard CRUD operations for the Task model 📝.
 */
class TaskController extends Controller
{
    /**
     * Retrieves all tasks.
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        // Fetches all records from the 'tasks' table
        return response()->json(Task::all());
    }

    /**
     * Creates a new task.
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        // Creates a new Task instance using only the specified fields from the request
        $task = Task::create($request->only(['title', 'description', 'status', 'due_date']));
        // Returns the created task with a 201 Created status
        return response()->json($task, 201);
    }

    /**
     * Retrieves a single task by its ID.
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        // Finds the task by ID or throws a 404 exception (Model Not Found)
        return response()->json(Task::findOrFail($id));
    }

    /**
     * Updates an existing task by its ID.
     * @param \Illuminate\Http\Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        // Finds the task
        $task = Task::findOrFail($id);
        // Updates the task with the specified fields from the request
        $task->update($request->only(['title', 'description', 'status', 'due_date']));
        // Returns the updated task
        return response()->json($task);
    }

    /**
     * Deletes a task by its ID.
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        // Finds and deletes the task
        Task::findOrFail($id)->delete();
        // Returns a 204 No Content status, typically used for successful deletions
        return response()->json(null, 204);
    }
}