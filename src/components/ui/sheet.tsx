import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import * as React from "react";
import { cn } from "~/lib/utils";

const Sheet = Dialog.Root;

const SheetTrigger = Dialog.Trigger;

const SheetPortal = Dialog.Portal;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof Dialog.Overlay>,
  React.ComponentPropsWithoutRef<typeof Dialog.Overlay>
>(({ className, ...props }, ref) => (
  <Dialog.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity data-[state=open]:animate-in data-[state=closed]:animate-out",
      className
    )}
    {...props}
  />
));
SheetOverlay.displayName = Dialog.Overlay.displayName;

const SheetContent = React.forwardRef<
  React.ElementRef<typeof Dialog.Content>,
  React.ComponentPropsWithoutRef<typeof Dialog.Content> & {
    side?: "top" | "bottom";
  }
>(({ className, side = "bottom", children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <Dialog.Content
      ref={ref}
      className={cn(
        "fixed z-50 w-full max-w-md bg-white shadow-lg transition-transform",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        side === "bottom"
          ? "bottom-0 rounded-t-2xl data-[state=open]:slide-in-from-bottom-2 data-[state=closed]:slide-out-to-bottom"
          : "top-0 rounded-b-2xl data-[state=open]:slide-in-from-top-2 data-[state=closed]:slide-out-to-top",
        className
      )}
      {...props}
    >
      <div className="absolute right-4 top-4">
        <SheetClose className="p-2 rounded-md hover:bg-gray-100">
          <X className="h-5 w-5" />
        </SheetClose>
      </div>
      <div className="p-4">{children}</div>
    </Dialog.Content>
  </SheetPortal>
));
SheetContent.displayName = Dialog.Content.displayName;

const SheetClose = Dialog.Close;

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof Dialog.Title>,
  React.ComponentPropsWithoutRef<typeof Dialog.Title>
>(({ className, ...props }, ref) => (
  <Dialog.Title
    ref={ref}
    className={cn("text-lg font-semibold text-gray-900", className)}
    {...props}
  />
));
SheetTitle.displayName = Dialog.Title.displayName;

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof Dialog.Description>,
  React.ComponentPropsWithoutRef<typeof Dialog.Description>
>(({ className, ...props }, ref) => (
  <Dialog.Description
    ref={ref}
    className={cn("text-sm text-gray-600", className)}
    {...props}
  />
));
SheetDescription.displayName = Dialog.Description.displayName;

export {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
  SheetTitle,
  SheetDescription,
  SheetPortal,
  SheetOverlay,
};
