import { useRef, useState } from "react"
import { Button } from "./button"
import { useClickAway } from "@uidotdev/usehooks"
import { motion } from "framer-motion"
import clsx from "clsx"
import { cn } from "@/lib/utils"
import { CheckIcon, Trash, Trash2 } from "lucide-react"

const ConfirmDeleteButton = ({
  onConfirm,
  className = "",
  label = "Delete"
}: {
  onConfirm: () => void
  className?: string
  label?: string
}) => {
  const [confirm, setConfirm] = useState(false)

  const ref = useClickAway<HTMLButtonElement>(() => {
    setConfirm(false)
  })

  return (
    <Button
      size="sm"
      ref={ref}
      variant={"destructive"}
      onClick={() => {
        if (!confirm) return setConfirm(true)
        else onConfirm()
      }}
      className={cn(
        "w-[100px] relative text-center overflow-hidden",
        className
      )}
    >
      <span
        className={cn(
          "flex items-center absolute top-[50%] left-[50%] transition-all duration-500",
          confirm
            ? "-translate-x-[100px] -translate-y-[50%] opacity-0"
            : "opacity-1 -translate-x-[50%] -translate-y-[50%]"
        )}
      >
        <Trash2 className="size-4 mr-1 inline-block" />
        {label}
      </span>
      <span
        className={cn(
          "block absolute top-[50%] left-[50%] transition-all duration-300",
          confirm
            ? "opacity-1 -translate-x-[50%] -translate-y-[50%]"
            : "translate-x-[100px] -translate-y-[50%] opacity-0"
        )}
      >
        <CheckIcon className="size-4 mr-1 inline-block" />
        Confirm
      </span>
    </Button>
  )
}

export default ConfirmDeleteButton
