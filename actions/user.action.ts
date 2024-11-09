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