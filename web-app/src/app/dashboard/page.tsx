"use server"
import { getAllUserWidgets } from "@/actions/chatwidget.action";
import { getFormattedDate } from "@/lib/date";
import { ExternalLink, MessageCircleCode, Plus, SquarePen } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { WidgetDeleteDialog } from "@/components/WidgetDelteDialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator"

const Page = async () => {
  const result = await getAllUserWidgets(null);

  if (!result.status) {
    return <p>error while fetching the widgets</p>;
  }

  return (
    <div className="max-w-7xl m-auto p-6 flex flex-col gap-y-6">
      <div className="flex justify-between items-baseline">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <Link
          href={"/dashboard/create-new"}
        >
          <Button>
          <Plus /> New Widget
          </Button>
        </Link>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">
          Total Widgets: {result.additional?.length}
        </p>
      </div>
      <div className="grid grid-cols-3 gap-6">
        {result.additional?.map((widget) => {
          return (
            <div
              key={widget.id}
              className="bg-card p-6 rounded-xl flex flex-col gap-y-3 border relative top-0 hover:-top-3 transition-all duration-300"
            >
              <MessageCircleCode width={32} height={32} />
              <h3 className="text-2xl font-semibold">{widget.name}</h3>
              <Separator />
              <div className="flex flex-col gap-y-0">
                <p className="text-sm text-muted-foreground">
                  Created at: {getFormattedDate(widget.createdAt)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {widget.trustedOrigins.length} Origins added.
                </p>
                <Badge
                  className="w-fit mt-1"
                  variant={widget.isActive ? "success" : "destructive"}
                >
                  {widget.isActive ? "Active" : "Not-Active"}
                </Badge>
              </div>
              <Separator />
              <div className="flex flex-wrap gap-1">
              <Link href={`/widget/${widget.id}`}>
                  <Button
                    variant="outline"
                    className="bg-transparent text-muted-foreground"
                  >
                    <ExternalLink /> Open
                  </Button>
                </Link>
                <Link href={`/dashboard/update-widget/${widget.id}`}>
                  <Button
                    variant="outline"
                    className="bg-transparent text-muted-foreground"
                  >
                    <SquarePen /> Edit
                  </Button>
                </Link>
              
                <WidgetDeleteDialog widgetId={widget.id} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Page;
