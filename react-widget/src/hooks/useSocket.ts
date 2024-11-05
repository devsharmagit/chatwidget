import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import axios from "axios";
const isProd = import.meta.env.PROD;

export interface Messages {
  id?: number,
  chatwidgetid: string,
  visitorId: string,
  isSentByVisitor: boolean,
  content: string
}
export interface Chatbots {
  visitorId: string;
  chatwidgetid: string;
}


let mainNextAppUrl = "http://localhost:3000";
let websocketUrl = "http://localhost:8080"
if (isProd === true) {
  mainNextAppUrl = "https://chatgoat.devsharmacode.com";
  websocketUrl = "https://websocket-chatgoat.devsharmacode.com"
}

const useSocket = ({chatwidgetid}: {chatwidgetid: string}) => {
  const [socketState, setSocketState] = useState<null | Socket>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [visitorId, setVisitorId] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleStart = async()=>{
    try {
      setIsLoading(true)
      const chatwidgetid2 = chatwidgetid;
      let tempVisitorId = "";
      const chatbots: Chatbots[] = await JSON.parse(
        localStorage.getItem("chatwidgets") || "[]"
      );
      const chatbot = chatbots.find(({ chatwidgetid }) => chatwidgetid === chatwidgetid2);
      if (chatbot) {
        tempVisitorId = chatbot.visitorId;
      } else {
        const response = await axios.post(`${mainNextAppUrl}/api/visitor`, {
          chatwidgetid: chatwidgetid,
        });
        tempVisitorId = response.data.visitor.id;
        localStorage.setItem("chatwidgets", JSON.stringify([...chatbots, {visitorId : tempVisitorId, chatwidgetid}]))
      }
      setVisitorId(tempVisitorId);
      socketState?.emit("register", chatwidgetid, tempVisitorId, true);
    const response = await axios.get(`${mainNextAppUrl}/api/messages/${chatwidgetid}/${tempVisitorId}`)
    if(response.status === 200) setMessages(response.data.messages)
    } catch (error) {
      console.log(error)
    } finally{
      setIsLoading(false)
    }
   
  }
  function sendMessage(textMessage:string) {
    if(!socketState) return
      socketState.emit("private_message", {
        chatwidgetid,
        visitorId,
        isVisitor: true,
        content: textMessage.trim(),
      });
      setMessages((prev) => [
        { content: textMessage.trim(), isSentByVisitor: true, chatwidgetid, visitorId },
        ...prev,
      ]);
  }
  const handleReceive = ({
    content,
    chatwidgetid,
    visitorId,
    isSentByVisitor,
  }: Messages) => {
    setMessages((prev) => [
      { content, chatwidgetid, visitorId, isSentByVisitor },
      ...prev,
    ]);
  };

  useEffect(() => {
    const newSocket = io(websocketUrl);
    setSocketState(newSocket);
  }, []);

  useEffect(()=>{
if(socketState){
  socketState.on("receive_message", handleReceive);
}
  }, [socketState])

  return {handleStart, messages, sendMessage, visitorId, isLoading};
};

export default useSocket;
