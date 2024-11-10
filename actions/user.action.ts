"use server";

import User from "@/app/lib/models/user.model";
import { connect } from '@/app/lib/db';

export async function createUser(user: any){
    try{
        await connect();
        const newUser = await User.create(user);
        return JSON.parse(JSON.stringify(newUser))
    } catch (error){
        console.log(error);
    }
}

// Update user
export async function updateUser(clerkId: string, updatedData: any) {
    try {
      await connect();
      const user = await User.findOneAndUpdate({ clerkId }, updatedData, { new: true });
      return JSON.parse(JSON.stringify(user));
    } catch (error) {
      console.log(error);
    }
  }
  
  // Delete user
  export async function deleteUser(clerkId: string) {
    try {
      await connect();
      await User.findOneAndDelete({ clerkId });
      return { message: "User deleted successfully" };
    } catch (error) {
      console.log(error);
    }
  }