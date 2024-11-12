"use server";

import User from "@/app/lib/models/user.model";
import { UserInterface } from "@/app/lib/types";
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

export async function findRecipeOwner(id: string): Promise<UserInterface | null>{
    try{
        const owner = await User.findById(id).lean().exec() as UserInterface | null;
        if(!owner) return null;
        return owner;
    } catch(error){
        console.log(error);
        return null
    }
}

