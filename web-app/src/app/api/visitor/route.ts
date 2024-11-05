import { NextRequest, NextResponse } from "next/server";
import { visitorPostSchema } from "@/lib/validators/visitor.validator";
import prisma from "@/lib/database";

// Helper function to add CORS headers
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export const POST = async(req: NextRequest) => {
    try {
       
        const body = await req.json(); 
        const {success, data} = visitorPostSchema.safeParse(body)
        if(!success){
            return NextResponse.json({
                status: false,
                message: "Invalid Data"
            }, {
                status: 400,
                headers: corsHeaders
            })
        }

        if(data){
            const widget = await prisma.chatwidget.findFirst({
                where: {
                    id: data.chatwidgetid
                }
            })
            if(!widget){
                return NextResponse.json({
                    status: false,
                    message: "Widget doesn't exist"
                }, {
                    status: 404,
                    headers: corsHeaders
                })
            }
            const isAllowed = widget.isActive && widget.trustedOrigins.includes(req.headers.get("origin") || "")
            if(!isAllowed){
                return NextResponse.json({
                    status: false,
                    message: "Origin not allowed"
                }, {
                    status: 405,
                    headers: corsHeaders
                })
            }
            
            const visitor = await prisma.visitor.create({
                data: {
                    chatwidgetId: data.chatwidgetid
                }
            })
            return NextResponse.json({
                status: true,
                message: "Visitor registered successfully!",
                visitorId: visitor.id
            }, {
                status: 201,
                headers: corsHeaders
            })
        }
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            status: false,
            message: "Something went wrong server side!"
        }, {
            status: 500,
            headers: corsHeaders
        })
    }
}

export async function OPTIONS() {
    return NextResponse.json(
        {},
        {
            headers: corsHeaders
        }
    )
}