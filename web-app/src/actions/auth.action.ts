'use server';
import bcrypt from "bcryptjs";
import { SignupType, signupSchema } from "@/lib/validators/auth.validator"; 
import { generateVerificationCode } from "@/lib/generate-otp"; 
import { Resend } from "resend";
import prisma from "@/lib/database";
import { EmailTemplate } from "@/components/email-template";
import { SuccessResponse } from "@/lib/response/success";
import { ErrorHandler } from "@/lib/response/error";
import { ServerActionReturnType, withServerActionAsyncCatcher } from "@/lib/aync-catch";

const RESEND_API_KEY = process.env.RESEND_API_KEY || ""
console.log(RESEND_API_KEY)
const resend = new Resend(RESEND_API_KEY);

interface SingupReturnType {
  userId : string
}

export const signup = withServerActionAsyncCatcher<SignupType, ServerActionReturnType<SingupReturnType>>( async(userDetails) => {
    const { success, data } = signupSchema.safeParse(userDetails);
    if (!success || !data) {
      throw new ErrorHandler('Invalid Data', 'UNPROCESSABLE_ENTITY');
    }
    const user = await prisma.user.findUnique({
      where: { email: data.email, isVerified: true },
    });
    if (user)
      throw new ErrorHandler('User already exists', 'BAD_REQUEST');
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(data.password, salt);
    const verifyCode = generateVerificationCode();
    const verifyExpiry = new Date(Date.now() + 3600000); // 60 mins
    const res = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
      },
    });
    await prisma.user.update({
      where: { email: res.email },
      data: {
        verifyCode: verifyCode,
        verifyExpiry: verifyExpiry,
      },
    });

     await resend.emails.send({
      from: "test@resend.devsharmacode.com",
      to: [res.email],
      subject: "Verify Code",
      react: EmailTemplate({ verifyCode: verifyCode }),
    });
  
    return new SuccessResponse(
      "Signed up successfully!",
      200,
      {userId : res.id}
    ).serialize();

})

interface VerifyEmailType {
  userId: string,
  verificationCode: string
}

export const verifyEmail = withServerActionAsyncCatcher<VerifyEmailType,ServerActionReturnType >( async ({userId, verificationCode})=>{
  const user = await prisma.user.findFirst({ where: { id:  userId } });

  const nowTime = new Date();

  if (user?.isVerified) {
  throw new ErrorHandler("User already verified!", "BAD_REQUEST")  
  }

  if (user?.verifyExpiry) {
    if (user?.verifyExpiry < nowTime)
      throw new ErrorHandler("User already verified!", "BAD_REQUEST")  
  }

  if (verificationCode === user?.verifyCode) {
    await prisma.user.update({
      where: { id: userId },
      data: { isVerified: true, verifyCode: null, verifyExpiry: null },
    });
  }

  return new SuccessResponse(
    'Email verified successfully!',
    202
  ).serialize();
} )


