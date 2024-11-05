"use client";
import React, { useState } from 'react';
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"
 
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Button } from '@/components/ui/button';
import { redirect, useParams, useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { verifyEmail } from '@/actions/auth.action';
import { Loader } from 'lucide-react';

const PAGE   = () => {
  const {userId} = useParams()
  
  const [verifyCode, setVerifyCode] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const router = useRouter()

  const {toast} = useToast()
  
  if (!userId || Array.isArray(userId)) {
    return redirect("/signup");
  }

  const handleClick = async (e :React.MouseEvent<HTMLButtonElement, MouseEvent>)=>{
    console.log("this is working")
    e.preventDefault()
    try {
      setIsLoading(true)
      const response = await verifyEmail({userId, verificationCode: verifyCode} )
      console.log(response)
      if(response.status === true){
        toast({
          title: "Success!",
          description: "Email verified successfully!",
          variant: "success"
        })
        router.push("/signin")
        return
      }
      if(response.status === false){
        console.log("inside the raposne false")
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive"
        })
      }

    } catch (error) {
     console.log(error)
    } finally{
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full flex justify-center items-center min-h-[600px] h-[90vh]">
      <div className="w-[400px] p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
        <h1 className="scroll-m-20 text-2xl font-bold tracking-tight text-center ">
            Verify your email.
        </h1>
        <p className='text-sm text-muted-foreground text-center'>
          Check your email, you may have recieved a 6 digits otp code.
        </p>
        <div className='pt-6 flex justify-center'>
        <InputOTP
         onChange={(value)=>setVerifyCode(value)}
         maxLength={6} pattern={REGEXP_ONLY_DIGITS_AND_CHARS} 
         >
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
        </div>
        <Button
              className="w-full mt-6"
              onClick={ handleClick}
              disabled={verifyCode.length !== 6}
            >
              {isLoading ? <Loader className="animate-spin"/> : "Submit"}  
            </Button>
      </div>
    </div>
  )
}

export default PAGE 
