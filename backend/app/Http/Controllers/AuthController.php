<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

/**
 * Controller handling user authentication (registration, login) and profile updates.
 */
class AuthController extends Controller
{
    /**
     * Handles new user registration.
     */
    public function register(Request $request)
    {
        // 1. Validate incoming request data
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users', // Must be unique in 'users' table
            'password' => 'required|string|min:6',
            'phone' => 'required|string|max:20',
            'gender' => 'required|in:Male,Female,Others',
            'dob' => 'required|date',
        ]);

        if ($validator->fails()) {
            // Return validation errors with a 422 status code
            return response()->json($validator->errors(), 422);
        }

        // 2. Create the new User record
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password), // Hash the password before saving
            'phone' => $request->phone,
            'gender' => $request->gender,
            'dob' => $request->dob,
        ]);

        // 3. Return success response
        return response()->json([
            'message' => 'User registered successfully',
            'user' => $user
        ], 201);
    }

    /**
     * Handles user login and token generation.
     */
    public function login(Request $request)
    {
        // 1. Find the user by the provided email address
        $user = User::where('email', $request->email)->first();

        // 2. Check if user exists and if the password is correct
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        // 3. Generate a Sanctum authentication token
        $token = $user->createToken('auth_token')->plainTextToken;

        // 4. Return user data and token
        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token
        ], 200);
    }

    /**
     * Handles updating the authenticated user's profile information.
     * Requires the user to be authenticated (token in header).
     */
    public function update(Request $request)
    {
        // 1. Get the currently authenticated user
        $user = $request->user();

        // 2. Validate update fields. 'sometimes' allows fields to be optional, but required if present.
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'phone' => 'sometimes|required|string|max:20',
            // Allow 'Other' for frontend compatibility, but convert to 'Others' for DB
            'gender' => 'sometimes|required|in:Male,Female,Others,Other', 
            'dob' => 'sometimes|required|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

        // 3. Prepare data for update (only include fields that are simple strings/dates)
        $data = $request->only(['name', 'phone', 'dob']);

        // 4. Custom logic for gender mapping (if input is 'Other', save as 'Others')
        if ($request->has('gender')) {
            $gender = $request->input('gender');
            if ($gender === 'Other') {
                $data['gender'] = 'Others';
            } else {
                $data['gender'] = $gender;
            }
        }

        // 5. Update the user record in the database
        $user->update($data);

        // 6. Return success response with the updated user object
        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'user' => $user
        ]);
    }
}