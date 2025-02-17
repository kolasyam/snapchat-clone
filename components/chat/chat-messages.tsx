// "use client";
// import { IMessageDocument } from "@/models/messageModel";
// import { PopulatedDoc } from "mongoose";
// import { Session } from "next-auth";
// import Image from "next/image";
// import { useRef } from "react";

// Mock messages, only used for demo purposes
// const messages = [
// 	{
// 		_id: "1",
// 		content: "Hello",
// 		sender: { _id: "1", fullName: "John Doe" },
// 		messageType: "text",
// 	},
// 	{
// 		_id: "2",
// 		content: "Heyy!",
// 		sender: { _id: "2", fullName: "Jane Doe" },
// 		messageType: "text",
// 	},
// 	{
// 		_id: "3",
// 		content: "how's it going?",
// 		sender: { _id: "1", fullName: "John Doe" },
// 		messageType: "text",
// 	},
// 	{
// 		_id: "4",
// 		content: "Doing great! How about you?",
// 		sender: { _id: "2", fullName: "Jane Doe" },
// 		messageType: "text",
// 	},
// 	{
// 		_id: "5",
// 		content: "Thank you! ",
// 		sender: { _id: "1", fullName: "John Doe" },
// 		messageType: "text",
// 	},
// 	{
// 		_id: "6",
// 		content: "See you later!",
// 		sender: { _id: "2", fullName: "Jane Doe" },
// 		messageType: "text",
// 	},
// 	{
// 		_id: "7",
// 		content: "See ya!",
// 		sender: { _id: "1", fullName: "John Doe" },
// 		messageType: "text",
// 	},
// ];
// type ChatMessagesProps = {
//   messages: IMessageDocument[] | PopulatedDoc<IMessageDocument>[];
//   session: Session | null;
// };
// const ChatMessages = ({ messages, session }: ChatMessagesProps) => {
//   const lastMsgRef = useRef<HTMLDivElement>(null);
//   // let session={user:{_id:"1"}}
//   return (
//     <>
//       {messages.map((message, idx) => {
//         const amISender = message.sender._id === session?.user?._id;
//         const senderFullName = message.sender.fullName.toUpperCase();
//         const isMessageImage = message.messageType === "image";
//         const isPrevMessageFromSameSender =
//           idx > 0 && messages[idx - 1].sender._id === message.sender._id;

//         return (
//           <div key={message._id} className="w-full" ref={lastMsgRef}>
//             {!isPrevMessageFromSameSender && (
//               <p
//                 className={`font-bold mt-2 text-xs ${
//                   amISender ? "text-sigSnapImg" : "text-sigSnapChat"
//                 }`}
//               >
//                 {amISender ? "ME" : senderFullName}
//               </p>
//             )}
//             <div
//               className={`border-l-2 ${
//                 amISender ? "border-l-sigSnapImg" : "border-l-sigSnapChat"
//               }`}
//             >
//               <div className={`flex items-center w-1/2 p-2 rounded-sm `}>
//                 {isMessageImage ? (
//                   <div className="relative">
//                     <Image
//                       src={message.content}
//                       width={200}
//                       height={200}
//                       className="h-auto w-auto object-cover cursor-pointer"
//                       alt="Image"
//                     />
//                   </div>
//                 ) : (
//                   <p className="text-sm">{message.content}</p>
//                 )}
//               </div>
//             </div>
//           </div>
//         );
//       })}
//     </>
//   );
// };
// export default ChatMessages;

"use client";
import { IMessageDocument } from "@/models/messageModel";
import { Dialog } from "@radix-ui/react-dialog";
import { PopulatedDoc } from "mongoose";
import { Session } from "next-auth";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { DialogContent } from "../ui/dialog";

// Define the interface for the component props
interface ChatMessagesProps {
  messages: IMessageDocument[] | PopulatedDoc<IMessageDocument>[];
  session: Session | null;
}

const ChatMessages = ({ messages, session }: ChatMessagesProps) => {
  const lastMsgRef = useRef<HTMLDivElement>(null);
  const [isPreviewingImage,setIsPreviewingImage]=useState({
    open:false,
    imgURL:"",
  });
  useEffect(() => {
    if (lastMsgRef.current) {
      lastMsgRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <>
      {messages.map((message, idx) => {
        const amISender = message?.sender._id.toString() === session?.user?.id;
        const senderFullName = message?.sender?.fullName.toUpperCase();
        const isMessageImage = message?.messageType === "image";
        const isPrevMessageFromSameSender =
          idx > 0 &&
          messages[idx - 1]?.sender._id.toString() ===
            message?.sender._id.toString();
            const handleImageLoad = () => {
              lastMsgRef.current?.scrollIntoView({ behavior: "smooth" });
            };
        return (
          <div key={message?._id}
            className="w-full"
            ref={idx === messages.length - 1 ? lastMsgRef : null}
          >
            {!isPrevMessageFromSameSender && (
              <p
                className={`font-bold mt-2 text-xs ${
                  amISender ? "text-sigSnapImg" : "text-sigSnapChat"
                }`}
              >
                {amISender ? "ME" : senderFullName}
              </p>
            )}
            <div
              className={`border-l-2 ${
                amISender ? "border-l-sigSnapImg" : "border-l-sigSnapChat"
              }`}
            >
              <div className={`flex items-center w-1/2 p-2 rounded-sm `}>
                {isMessageImage ? (
                  <div className="relative">
                    <Image
                      src={message?.content}
                      width={200}
                      height={200}
                      className="h-auto w-auto object-cover cursor-pointer"
                      alt="Image"
                      onLoad={handleImageLoad}
                      onClick={() =>
												setIsPreviewingImage({ open: true, imgURL: message.content })
											}
                    />
                  </div>
                ) : (
                  <p className="text-sm">{message?.content}</p>
                )}
              </div>
            </div>
          </div>
        );
      })}
      <Dialog open={isPreviewingImage.open}
      onOpenChange={()=>setIsPreviewingImage({open:false,imgURL:""})}
      >
        <DialogContent className="max-w-4xl h-3/4 bg-sigMain border border-sigColorBgBorder outline-none" autoFocus={false}>
          <Image
          src={isPreviewingImage.imgURL}
          fill
          className="object-contain p-2"
          alt='image'
          ></Image>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChatMessages;
