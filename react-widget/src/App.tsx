import { MessageCircleMore } from "lucide-react";
import { useState } from "react";
import ChatContainer from "./components/ChatContainer";
import "./index.css"

function App({ chatwidgetid }: { chatwidgetid: string }) {
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const handleChatClick = () => {
    setIsChatOpen((prev) => !prev);
  };
  const handleChatClose = ()=>{
    setIsChatOpen(false)
  }


  return (
    <>
 
      {isChatOpen && <ChatContainer chatwidgetid={chatwidgetid} closeChat={handleChatClose} />}
      <button
        onClick={handleChatClick}
        className={`fixed bottom-2 font-poppins right-2 bg-rose-500 text-white shadow-xl flex items-center justify-center p-0 h-[50px] w-[50px] animate-bounce rounded-full ${isChatOpen && "animate-none"}`}
      >
        <MessageCircleMore height={30} width={30} />
      </button>
    </>
  );
}

export default App;
