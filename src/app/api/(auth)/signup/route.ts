'use client'
import {PrismaClient} from '@prisma/client';
import bcrypt from 'bcryptjs';
import {NextResponse} from 'next/server';

const prisma = new PrismaClient();

export async function POST(req : Request) {
    const {username , email , password} = await req.json();

   
    const existingUser = await prisma.user.findUnique({
        where : {email}

    })
    if(existingUser){
        return NextResponse.json({message : 'User already exists'},{status : 400});
    }
    const hashPassword = await bcrypt.hash(password,10);

    const user = await prisma.user.create({
        data : {username , email , password : hashPassword}
    
    })
    return NextResponse.json({user},{status : 201});
 }
