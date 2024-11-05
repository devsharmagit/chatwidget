import WidgetForm from "@/components/WidgetForm";

const Page = () => {

  return (
    <div className="max-w-7xl m-auto p-6 flex flex-col gap-y-8">
      <div className="flex justify-between items-baseline">
        <h1 className="text-4xl font-bold">Create new widget</h1>
      </div>
      <div className="bg-card p-6 rounded-xl">
      <WidgetForm widget={null} />
      </div>
    </div>
  );
};

export default Page;
