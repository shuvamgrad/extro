import * as Dialog from "@radix-ui/react-dialog";
import { ArrowLeft, MessageCircle, Settings } from "lucide-react";
import * as React from "react";
import { cn } from "~/lib/utils";

const Sidebar = Dialog.Root;
const SidebarTrigger = Dialog.Trigger;
const SidebarPortal = Dialog.Portal;
const SidebarClose = Dialog.Close;

const SidebarOverlay = React.forwardRef<
  React.ElementRef<typeof Dialog.Overlay>,
  React.ComponentPropsWithoutRef<typeof Dialog.Overlay>
>(({ className, ...props }, ref) => (
  <Dialog.Overlay
    ref={ref}
    className={cn("fixed inset-0 bg-black/50 backdrop-blur-sm", className)}
    {...props}
  />
));
SidebarOverlay.displayName = Dialog.Overlay.displayName;

const SidebarContent = React.forwardRef<
  React.ElementRef<typeof Dialog.Content>,
  React.ComponentPropsWithoutRef<typeof Dialog.Content>
>(({ className, children, ...props }, ref) => {
  const onSettingClick = () => {
    window.location.hash = "settings";
  };
  const onChatClick = () => {
    window.location.hash = "chat_account";
  };

  return (
    <SidebarPortal>
      <SidebarOverlay />
      <Dialog.Content
        ref={ref}
        className={cn(
          "fixed left-0 top-0 h-full w-16 bg-black text-white shadow-lg transition-transform rounded-r-2xl flex flex-col items-center py-4",
          "data-[state=open]:slide-in-from-left-2 data-[state=closed]:slide-out-to-left",
          className
        )}
        {...props}
      >
        <SidebarClose className="p-2 hover:bg-gray-800 rounded-md">
          <ArrowLeft className="h-6 w-6 text-white" />
        </SidebarClose>

        <div className="flex-1" />

        <button
          type="button"
          className="p-2 mb-4 hover:bg-gray-800 rounded-md"
          onClick={onSettingClick}
        >
          <Settings className="h-6 w-6 text-white" />
        </button>
        <button
          type="button"
          className="p-2 mb-4 hover:bg-gray-800 rounded-md"
          onClick={onChatClick}
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </button>
      </Dialog.Content>
    </SidebarPortal>
  );
});
SidebarContent.displayName = Dialog.Content.displayName;

export {
  Sidebar,
  SidebarTrigger,
  SidebarContent,
  SidebarClose,
  SidebarPortal,
  SidebarOverlay,
};
