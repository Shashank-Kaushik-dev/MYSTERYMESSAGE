import dbConnect from "@/lib/dbConnect";// always need db coonection before any database operation
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, email, password } = await request.json();
        const existingUserVerififedByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })
        if (existingUserVerififedByUsername) {
            return Response.json({
                success: false,
                message: "Username already exists"
            }, {
                status: 400
            });
        }
       const existingUserByEmail = await UserModel.findOne({
            email,
        })
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit code 

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "User already exists with this email"
                }, {
                    status: 400
                });
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 60 * 60 * 1000);// 1 hour from now
                await existingUserByEmail.save(); 

            } 
        }else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date(); // new gives an object which can be changed and manipulated
            expiryDate.setHours(expiryDate.getHours() + 1);

             const newUser = new UserModel({
                 username,
                 email,
                 password: hashedPassword,
                 verifyCode,
                 verifyCodeExpiry: expiryDate,
                 isVerified: false,
                 isAcceptingMessage: true,
                 messages: []
            })
            await newUser.save();
            
        }
        // Send verification email
        const emailResponse = await sendVerificationEmail(email, username, verifyCode);
        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message || "Failed to send verification email"
            }, {
                status: 500
            });
        }
        return Response.json({
            success: true,
            message: "User signed up successfully. Verification email sent."},
            {status: 201}
        );
    } catch (error) {
        console.error('Error during sign-up:', error);
        return Response.json({
            success: false,
            message: "Failed to sign up user"
        }, {
            status: 500
        });   
    }
}