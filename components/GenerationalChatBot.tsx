
import { Authenticator, Avatar } from "@aws-amplify/ui-react";
import { AIConversation } from '@aws-amplify/ui-react-ai';
import { useAIConversation } from '../app/client';
import { ScrollArea } from "./ui/scroll-area";
import ReactMarkdown from 'react-markdown';

export default function GenerationalChatBot() {
  const [
    {
      data: { messages },
      isLoading,
    },
    handleSendMessage,
  ] = useAIConversation('chat');
  // 'chat' is based on the key for the conversation route in your schema.

  return (
    <Authenticator>
    <ScrollArea className="h-[400px]">
      <AIConversation
        messages={messages}
        isLoading={isLoading}
        messageRenderer={{
            text: ({ text }) => <ReactMarkdown>{text}</ReactMarkdown>
          }}
        handleSendMessage={handleSendMessage}
        allowAttachments
        avatars={{
            user: {
              avatar: <Avatar src="https://github.com/shadcn.png" />,
              username: "User",
            },
            ai: {
              avatar: <Avatar />,
              username: "Al Ramz Bot"
            }
          }}
        />
        </ScrollArea>
    </Authenticator>
  );
}