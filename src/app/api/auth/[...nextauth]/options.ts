import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",

      credentials: {
        identifier: {
          label: "Email or Username",
          type: "text",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

       async authorize(credentials: any): Promise<any> {
        await dbConnect();

        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials?.identifier },
              { username: credentials?.identifier },
            ],
          });

          if (!user) {
            throw new Error(
              "No user found with the given email or username"
            );
          }

          if (!user.isVerified) {
            throw new Error("User is not verified");
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials!.password,
            user.password
          );

          if (!isPasswordCorrect) {
            throw new Error("Incorrect password");
          }

          return user;
        } catch (err: any) {
          throw new Error(err.message || "Authentication failed");
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessage = user.isAcceptingMessage;
        token.username = user.username;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user._id = token.id as string;
        session.user.isVerified = token.isVerified as boolean;
        session.user.isAcceptingMessage =
          token.isAcceptingMessage as boolean;
        session.user.username = token.username as string;
      }

      return session;
    },
  },

  pages: {
    signIn: "/sign-in",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};