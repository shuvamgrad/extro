import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Plus } from "lucide-react";
import type React from "react";
import { useFieldArray, useForm } from "react-hook-form";
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

/**
 * Zod schema for the CreateChat form:
 * - "chatName" is optional
 * - "members" is a dynamic array of strings, each required (nonempty).
 */
const createChatSchema = z.object({
  chatName: z.string().optional(),
  members: z
    .array(z.string().nonempty("Public key is required"))
    .min(1, "Please add at least one member."),
});

type CreateChatFormData = z.infer<typeof createChatSchema>;

interface CreateChatProps {
  onBack: () => void;
  onChatCreated: (chatId: string) => void;
}

export const CreateChat: React.FC<CreateChatProps> = ({
  onBack,
  onChatCreated,
}) => {
  const { createChat, chats } = useChatContext();

  // Setup React Hook Form with Zod
  const form = useForm<CreateChatFormData>({
    resolver: zodResolver(createChatSchema),
    defaultValues: {
      chatName: "",
      members: [""],
    },
  });

  // useFieldArray to manage the "members" array dynamically
  const { fields, append } = useFieldArray<CreateChatFormData>({
    control: form.control,
    name: "members",
  });

  // React Query mutation to handle creation
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: CreateChatFormData) => {
      const { chatName, members } = data;

      if (members.length === 0) {
        throw new Error("No valid member public keys found.");
      }

      let finalName = chatName;
      if (!finalName && members.length === 1) {
        finalName = `Chat with ${members[0]?.slice(0, 6)}...`;
      }
      if (!finalName) {
        finalName = `Private Chat (${members.join(", ")})`;
      }
      const newChat = createChat(finalName, members);
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

  // Called by react-hook-form on valid submission
  const onSubmit = (data: CreateChatFormData) => {
    mutate(data);
  };

  return (
    <div className="flex flex-col w-full h-full p-3 bg-neutral-900 text-white">
      {/* Header with Back Button */}
      <button
        type="button"
        onClick={onBack}
        className="text-green-400 hover:text-green-500 mb-4"
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
                    className="bg-neutral-800 border-neutral-700 text-white placeholder-gray-400"
                    placeholder="If private, can be auto-generated"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Dynamic Members Fields */}
          <div className="flex flex-col gap-2">
            <p className="block font-medium mb-1">Member Public Keys</p>

            {fields.map((field, index) => (
              <FormField
                key={field.id}
                control={form.control}
                name={`members.${index}`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="bg-neutral-800 border-neutral-700 text-white placeholder-gray-400"
                        placeholder="E.g. ABC123"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            {/* Add Member Button */}
            <Button
              type="button"
              variant="outline"
              className="mt-2 text-green-400 border-green-400 hover:bg-neutral-800"
              onClick={() => append("")}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full mt-4 bg-green-600 hover:bg-green-700 border-none"
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Create Chat"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};
