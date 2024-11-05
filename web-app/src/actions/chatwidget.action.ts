"use server";
import {
  ServerActionReturnType,
  withServerActionAsyncCatcher,
} from "@/lib/aync-catch";
import {
  createWidgetSchema,
  CreateWidgetType,
} from "@/lib/validators/chatwidget.validators";
import { getServerSession } from "next-auth";
import { nextauthOptions } from "@/lib/next-auth-options";
import { ErrorHandler } from "@/lib/response/error";
import prisma from "@/lib/database";
import { SuccessResponse } from "@/lib/response/success";
import { revalidatePath } from "next/cache";

export const createChatwidget = withServerActionAsyncCatcher<
  CreateWidgetType,
  ServerActionReturnType
>(async (data) => {
  const auth = await getServerSession(nextauthOptions);
  if (!auth || !auth.user)
    throw new ErrorHandler("Signin to access", "UNAUTHORIZED");

  const { success, data: details } = createWidgetSchema.safeParse(data);

  if (!success) throw new ErrorHandler("Invalid data", "BAD_REQUEST");

  await prisma.chatwidget.create({
    data: {
      userId: auth.user.id,
      name: details.name,
      isActive: details.isActive,
      trustedOrigins: details.trustedOrigins,
    },
  });

  revalidatePath("/dashboard");
  return new SuccessResponse("Successfully created Widget", 201).serialize();
});

interface Widget {
  name: string;
  trustedOrigins: string[];
  isActive: boolean;
  id: string;
  userId: string;
  createdAt: Date;
}

export const getAllUserWidgets = withServerActionAsyncCatcher<
  null,
  ServerActionReturnType<Widget[]>
>(async () => {
  const auth = await getServerSession(nextauthOptions);
  if (!auth || !auth.user)
    throw new ErrorHandler("Signin to access", "UNAUTHORIZED");

  const result = await prisma.chatwidget.findMany({
    where: {
      userId: auth.user.id,
    },
  });

  return new SuccessResponse("Successfully created Widget", 201, result).serialize();
});

export const updateUserWidget = async (id: string, data: CreateWidgetType) => {
  try {
    const auth = await getServerSession(nextauthOptions);
    if (!auth || !auth.user)
      throw new ErrorHandler("Signin to access", "UNAUTHORIZED");

    const widget = await prisma.chatwidget.findFirst({ where: { id: id } });

    if (!widget) return { status: false, message: "widget doesnt exist" };

    if (auth?.user.id !== widget.userId) {
      return { status: false, message: "widget doesnt exist" };
    }
    const { success, data: details } = createWidgetSchema.safeParse(data);

    if (!success) {
      return { status: false, message: "invalid data" };
    }

    await prisma.chatwidget.update({
      where: {
        id: id,
      },
      data: {
        ...details,
      },
    });
    revalidatePath("/dashboard");
    return new SuccessResponse("Successfully udpated Widget", 201).serialize();
  } catch (error) {
    console.log(error);
  }
};

export const deleteUserWidget = async (id: string) => {
  try {
    const auth = await getServerSession(nextauthOptions);
    if (!auth || !auth.user)
      throw new ErrorHandler("Signin to access", "UNAUTHORIZED");

    const widget = await prisma.chatwidget.findFirst({ where: { id: id } });

    if (!widget) return { status: false, message: "widget doesnt exist" };

    if (auth?.user.id !== widget.userId) {
      return {
        status: false,
        message: "you dont have permission to access this resource",
      };
    }

    await prisma.chatwidget.delete({
      where: {
        id: id,
      },
    });
    revalidatePath("/dashboard");
    return new SuccessResponse("Successfully deleted", 204).serialize();
  } catch (error) {
    console.log(error);
  }
};

export const getWidgetWithId = async (id: string) => {
  try {
    const auth = await getServerSession(nextauthOptions);
    if (!auth || !auth.user)
      throw new ErrorHandler("Signin to access", "UNAUTHORIZED");

    const widget = await prisma.chatwidget.findFirst({ where: { id: id } });

    if (!widget) return { status: false, message: "widget doesnt exist" };

    if (auth?.user.id !== widget.userId) {
      return {
        status: false,
        message: "you dont have permission to access this resource",
      };
    }
    return new SuccessResponse("Successfully deleted", 204, widget).serialize();
  } catch (error) {
    console.log(error);
  }
};
