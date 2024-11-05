"use client";
import React from "react";
import {
  createWidgetSchema,
  CreateWidgetType,
} from "@/lib/validators/chatwidget.validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
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
import { Switch } from "@/components/ui/switch";
import {  Plus, Rocket, Trash2 } from "lucide-react";
import { createChatwidget, updateUserWidget } from "@/actions/chatwidget.action";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface WidgetType {
    name: string,
    isActive: boolean,
    trustedOrigins: string[],
    id: string
}

const WidgetForm = ({widget}:{widget:WidgetType | null}) => {
    const router = useRouter()
    const {toast} = useToast()
  
    const form = useForm<CreateWidgetType>({
      resolver: zodResolver(createWidgetSchema),
      defaultValues: {
        isActive: widget?.isActive || true,
        name: widget?.name || "",
        trustedOrigins: widget?.trustedOrigins || ["http://localhost:3000"],
      },
    });
  
    const { fields, append, remove } = useFieldArray({
      name: "trustedOrigins",
      control: form.control,
      rules: {
        maxLength: 5,
      },
    });
  
    async function onSubmit(values: CreateWidgetType) {
      try {
        let result;
        if(!widget?.id){
            result = await createChatwidget(values)
        }else{
            result = await updateUserWidget(widget?.id, values)
        }
        if(result?.status){
          toast({
            title: "Success",
            description: "Successfully created Widget.",
            variant: "success"
          })
          router.push("/dashboard")
        }
        if(!result?.status){
          toast({
            title: "Error",
            description: result?.message,
            variant: "destructive"
          })
        }
        
      } catch (error) {
        console.log(error)
        toast({
          title: "Error",
          description: "Something went wrong while creating widget.",
          variant: "destructive"
        })
      }
    }
  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base">
              Name of the Widget
            </FormLabel>
            <FormControl>
              <Input placeholder="science-project" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="isActive"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                className="data-[state=checked]:bg-rose-500 data-[state=unchecked]:bg-gray-400"
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Make this widget active.</FormLabel>
            </div>
          </FormItem>
        )}
      />

      <div className="space-y-4">
        <FormLabel className="text-base">Trusted Origins</FormLabel>
        <p className="text-muted-foreground text-xs">
          {" "}
          Origins where widgets should be allowed.{" "}
        </p>
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-x-2 items-center">
            <Input
              {...form.register(`trustedOrigins.${index}` as const)}
            />
            <Button
              type="button"
              variant={"outline"}
              onClick={() => remove(index)}
              className="text-muted-foreground"
            >
              <Trash2 />
            </Button>
          </div>
        ))}
        <p>{form.formState.errors.trustedOrigins?.root?.message}</p>
        {fields.length < 5 && (
          <Button
            type="button"
            variant={"outline"}
            onClick={() => append("")}
            className="text-muted-foreground"
          >
            <Plus /> Add More
          </Button>
        )}
      </div>

      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Please wait ..." :  <> <Rocket /> {widget?.id ? "Update Widget" : "Add Widget" } </>  }
      </Button>
    </form>
  </Form>
  )
}

export default WidgetForm
