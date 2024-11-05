import { getWidgetWithId } from "@/actions/chatwidget.action";
import WidgetForm from "@/components/WidgetForm";

const Page = async ({params: {widgetId}}:{params: {widgetId: string}}) => {

const widget = await getWidgetWithId(widgetId)

if(!widget?.status){
  return <p>error while fetching widget</p>
}

  return (
    <div className="max-w-7xl m-auto p-6 flex flex-col gap-y-8">
      <div className="flex justify-between items-baseline">
        <h1 className="text-4xl font-bold">Update widget</h1>
      </div>
      <div className="bg-card p-6 rounded-xl">
       {/* TODO : ADD widget udpate form */}
       <WidgetForm widget={widget.additional} />
      </div>
    </div>
  );
};

export default Page;
