import Header from "./Header";
import Messages from "./Messages";
import SendMessage from "./SendMessage";
import useSocket from "@/hooks/useSocket";
import { Loader } from "lucide-react";

const ChatContainer = ({ chatwidgetid, closeChat }: { chatwidgetid: string, closeChat: ()=>void }) => {
  const { handleStart, messages, visitorId, sendMessage, isLoading } = useSocket({
    chatwidgetid: chatwidgetid,
  });

  return (
    <div className="font-poppins fixed bottom-16 right-4 w-[350px] h-[500px] overflow-hidden shadow-2xl flex flex-col border border-opacity-20 rounded-2xl">
      {visitorId.length === 0  && !isLoading && (
        <div className="h-full flex flex-col justify-center items-center">
          <button onClick={handleStart} className="rounded-[8px] text-lg shadow-md bg-rose-500 text-white px-4 py-1">
            Start
          </button>
          <p className="text-sm pt-3"> Start chat with experts ! </p>
          <p className="text-xs">
            Powered by 
            <a className="underline" target="_blank" href="https://chatgoat.devsharmacode.com">
               ChatGoat
            </a>
          </p>
        </div>
      )}
      {isLoading && <div className="w-full h-full flex justify-center items-center">
        <Loader className="animate-spin" />
      </div> 
      }
      {visitorId.length !== 0 && !isLoading && (
        <>
          <Header name="Experts" closeChat={closeChat} />
          <Messages messages={messages} />
          <SendMessage sendMessage={sendMessage} />
        </>
      )}
    </div>
  );
};

export default ChatContainer;
