"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginType } from "@/lib/validators/auth.validator";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader } from "lucide-react";

const Page = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isPassVisible, setIsPassVisible] = useState<boolean>(false)
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<LoginType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginType) {
    setIsLoading(true)
    const result = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
    });
    console.log(result)
    if (result?.error && result.status !== 200) {
      toast({
        description: result?.error,
        title: "Login Failed !",
        variant: "destructive",
      });
    }
    else{
      toast({
        description: "Successfully loged in!",
        title: "Success !",
        variant: "success",
      });
      router.push("/dashboard")
    }
    setIsLoading(false)
  }

  const handlePasswordToggle = (e : React.MouseEvent<HTMLButtonElement, MouseEvent>)=>{
e.preventDefault()
setIsPassVisible(prev => !prev)
  }

  return (
    <div className="w-full flex justify-center items-center min-h-[600px] h-[90vh]">
      <div className="w-[400px] p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="mb-6 flex flex-col gap-y-2">
        <h1 className="scroll-m-20 text-3xl font-bold tracking-tight text-center ">Login</h1>
        <p className="text-sm text-muted-foreground text-center"> Login using your credentials.  </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                     
                      type="email"
                      placeholder="example@email.com"
                      {...field}
                    />
                  </FormControl>
                  {form.formState.errors.email && 
                  <FormMessage className="text-rose-600" />
                  }
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="flex gap-x-2 items-center">
                    <Input
                      type={ isPassVisible ? "text" :"password"}
                      placeholder="password"
                      {...field}
                      />
                      <Button onClick={handlePasswordToggle} variant={"outline"} className="px-2 bg-transparent">
                      {isPassVisible ?   <Eye /> : <EyeOff />} 
                      </Button>
                      </div>
                  </FormControl>
                  {form.formState.errors.password && 
                  <FormMessage className="text-rose-600" />
                  }
                </FormItem>
              )}
            />
          
            <Button
              type="submit"
              className="w-full "
            >
              {isLoading ? <Loader className="animate-spin"/> : "Submit"}  
            </Button>
          </form>
        </Form>
        <div className="text-center text-sm mt-4 text-muted-foreground">
          <p>
            Dont have an account ?{" "}
            <Link className="text-primary" href={"/signup"}>
              Signup
            </Link>{" "}
            here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
