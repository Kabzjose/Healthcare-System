"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

type SelectContextValue = {
  value?: string
  placeholder?: string
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  onValueChange?: (value: string) => void
}

const SelectContext = React.createContext<SelectContextValue | null>(null)

function Select({
  defaultValue,
  value,
  onValueChange,
  children,
}: {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
}) {
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const [open, setOpen] = React.useState(false)
  const currentValue = value ?? internalValue

  const handleValueChange = (nextValue: string) => {
    setInternalValue(nextValue)
    onValueChange?.(nextValue)
    setOpen(false)
  }

  return (
    <SelectContext.Provider
      value={{
        value: currentValue,
        open,
        setOpen,
        onValueChange: handleValueChange,
      }}
    >
      <div className="relative">{children}</div>
    </SelectContext.Provider>
  )
}

function SelectTrigger({ className, children, ...props }: React.ComponentProps<"button">) {
  const context = React.useContext(SelectContext)

  return (
    <button
      type="button"
      className={cn(
        "flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      onClick={() => context?.setOpen((open) => !open)}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  )
}

function SelectValue({ placeholder }: { placeholder?: string }) {
  const context = React.useContext(SelectContext)

  return <span>{context?.value ? labelize(context.value) : placeholder}</span>
}

function SelectContent({ className, ...props }: React.ComponentProps<"div">) {
  const context = React.useContext(SelectContext)

  if (!context?.open) return null

  return (
    <div
      className={cn(
        "absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
        className
      )}
      {...props}
    />
  )
}

function SelectItem({
  value,
  className,
  children,
  ...props
}: React.ComponentProps<"button"> & { value: string }) {
  const context = React.useContext(SelectContext)

  return (
    <button
      type="button"
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
        context?.value === value && "bg-accent text-accent-foreground",
        className
      )}
      onClick={() => context?.onValueChange?.(value)}
      {...props}
    >
      {children}
    </button>
  )
}

function labelize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1).replaceAll("_", " ")
}

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue }
