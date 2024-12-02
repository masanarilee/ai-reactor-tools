import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface TextInputProps {
  label: string
  placeholder?: string
}

export function TextInput({ label, placeholder }: TextInputProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Textarea 
        placeholder={placeholder}
        className="min-h-[100px]"
      />
    </div>
  )
}