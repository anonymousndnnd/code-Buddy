import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";


const prisma=new PrismaClient();

export const authOptions:NextAuthOptions={
  providers:[
    CredentialsProvider({
      id:"Credentials",
      name: "Credentials",
      credentials: {
        identifier: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials:any):Promise<any>{
        try {
          //Finding the user 
          const user=await prisma.myUser.findUnique({
            where:{email:credentials.email}
          })
          console.log("File-Name:auth/options , User is:",user);
  
          if(!user){
            console.log("No user found with given email");
            throw new Error('No user found with this email')
          }
  
          //Checking the Password
          const isPasswordCorrect=await bcrypt.compare(credentials.password,user.password)
          if(isPasswordCorrect){
            console.log(" File-Name:auth/options, Login successful for user:", user.email);
            return user
          }
          else{
            throw new Error('Incorrect Password')
          }
        } catch (error:any) {
          console.log("Authentication error:",error.message);
          throw new Error(error);
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })
  ],
  callbacks: {

    // callback for sign-in
    async signIn({ user, account }) {
       if (account?.provider === "google") {
        console.log("Google login detected:", user.email);

        try {
          const existingUser = await prisma.myUser.findUnique({
            where: { email: user.email! },
          });
          if (!existingUser) {
            await prisma.myUser.create({
              data: {
                email: user.email!,
                username:
                  user.name?.replace(/\s+/g, "").toLowerCase() ||
                  `user_${Date.now()}`,
                password: "", // no password for Google auth
  
              },
            });
            console.log("New Google user created:", user.email);
          } else {
            console.log("ℹGoogle user already exists:", user.email);
          }

        } catch (error:any) {
          console.error("Error creating Google user:", error);
          return false; 
        }
       }
       return true;
    },
    async jwt({ token, user }) {
      //yaha pe jo user mil raha hai wo authorize ke andar jo user return kiye hai wo hai 
      if(user){
        token._id= user.id?.toString()
        token.username= user.username
      }
      
      return token
    },

    //This fuction will return session, 
    async session({ session,token }) {
      const Token = token as {
        _id?: string;
        isVerified?: boolean;
        username?: string;
        role?: string;
      };
      if(token){
        session.user._id=Token._id
        session.user.username=Token.username
      }
      console.log("Session is",session);
      return session;
    }
  },
  pages:{
    signIn:'/sign-in',
  },
  session: {
    strategy:"jwt"
  },
  secret:process.env.NEXTAUTH_SECRET
}