import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import type React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { useChatContext } from "./chat_context";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";

interface CreateChatProps {
  onBack: () => void;
  onChatCreated: (chatId: string) => void;
}

/**
 * Zod schema for the CreateChat form.
 * We keep `chatName` optional, and require at least one member in `membersInput`.
 */
const createChatSchema = z.object({
  chatName: z.string().optional(),
  membersInput: z
    .string()
    .nonempty("Please enter at least one member public key"),
});

type CreateChatFormData = z.infer<typeof createChatSchema>;

export const CreateChat: React.FC<CreateChatProps> = ({
  onBack,
  onChatCreated,
}) => {
  const { createChat, chats } = useChatContext();

  // React Query mutation to handle creation
  const { mutate, isLoading } = useMutation({
    // The mutation function receives our parsed form data
    mutationFn: async (data: CreateChatFormData) => {
      const { chatName, membersInput } = data;

      // 1) Parse the member string into an array
      const membersArray = membersInput
        .split(/[,\s]+/)
        .map((m) => m.trim())
        .filter(Boolean);

      if (membersArray.length === 0) {
        throw new Error("No valid member public keys found.");
      }

      // 2) Auto-generate a name if private chat with single member
      let finalName = chatName;
      if (!finalName && membersArray.length === 1) {
        finalName = `Chat with ${membersArray[0]?.slice(0, 6)}...`;
      }
      // If still no name (user left it empty, but multiple members)
      if (!finalName) {
        finalName = `Private Chat (${membersArray.join(", ")})`;
      }

      // 3) Create the chat via ChatContext (later, replace with on-chain logic)
      createChat(finalName, membersArray);

      // 4) Locate the newly created chat in our context state
      const newChat = chats[chats.length - 1];
      if (!newChat) {
        throw new Error("Failed to create chat. Please try again.");
      }
      return newChat.id;
    },
    onError: (error: unknown) => {
      // Show an error toast if anything goes wrong
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong while creating the chat.");
      }
    },
    onSuccess: (newChatId: string) => {
      // When success, notify parent about the new chat
      onChatCreated(newChatId);
    },
  });

  // Setup React Hook Form with Zod
  const form = useForm<CreateChatFormData>({
    resolver: zodResolver(createChatSchema),
    defaultValues: {
      chatName: "",
      membersInput: "",
    },
  });

  // Called by react-hook-form on valid submission
  const onSubmit = (data: CreateChatFormData) => {
    mutate(data);
  };

  return (
    <div className="flex flex-col w-full h-full p-3">
      {/* Header with Back Button */}
      <button
        type="button"
        onClick={onBack}
        className="text-blue-500 hover:text-blue-600 mb-4"
      >
        &larr; Back
      </button>

      <h3 className="text-lg font-semibold mb-4">Create New Chat</h3>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          {/* Chat Name (optional) */}
          <FormField
            control={form.control}
            name="chatName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chat Name (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="If private, can be auto-generated"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Members Input */}
          <FormField
            control={form.control}
            name="membersInput"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Members (comma/space separated)</FormLabel>
                <FormControl>
                  <Input placeholder="E.g.: ABC123, DEF456" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full mt-2" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              "Create Chat"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};
