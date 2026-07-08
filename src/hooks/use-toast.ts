import { toast as sonnerToast } from "sonner"

type ToastInput = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

function toast({ title, description, variant = "default" }: ToastInput) {
  const message = title ?? description ?? ""

  if (variant === "destructive") {
    return sonnerToast.error(message, { description })
  }

  return sonnerToast.success(message, { description })
}

function useToast() {
  return { toast }
}

export { toast, useToast }
