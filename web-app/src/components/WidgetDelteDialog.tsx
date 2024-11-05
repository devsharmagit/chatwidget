"use client"
import { deleteUserWidget } from "@/actions/chatwidget.action"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
  import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Trash2 } from "lucide-react"
   
  export function WidgetDeleteDialog({widgetId}: {widgetId: string}) {

    const {toast} = useToast()

    const handleClick = async()=>{
        try {
            const result = await deleteUserWidget(widgetId)
            if(result?.status){
                toast({
                    variant: "success",
                    title: "Success",
                    description: "Successfully deleted widget!"
                })
            }
            if(!result?.status){
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: result?.message
                })
            }
            return
        } catch (error) {
            console.log(error)
            toast({
                variant: "destructive",
                title: "Error",
                description: "Something went wrong!"
            })
        }
      
    }

    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button  variant="outline" className="bg-transparent text-muted-foreground"> <Trash2 /> Delete </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
                Do you want to delete this widget for sure?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              widget and all the data associated with it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClick}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }