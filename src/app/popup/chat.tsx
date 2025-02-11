import { Messenger } from "~/components/chat";

export function ChatApp() {
  return (
    <Messenger.ChatProvider>
      <Messenger.ChatPage />
    </Messenger.ChatProvider>
  );
}
