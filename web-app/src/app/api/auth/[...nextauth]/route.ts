import NextAuth from "next-auth"

import { nextauthOptions } from "@/lib/next-auth-options" 

const handler = NextAuth(nextauthOptions)

export { handler as GET, handler as POST }