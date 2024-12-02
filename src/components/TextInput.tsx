import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface TextInputProps {
  label: string
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}

export function TextInput({ label, placeholder, value, onChange }: TextInputProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Textarea 
        placeholder={placeholder}
        className="min-h-[100px]"
        value={value}
        onChange={onChange}
      />
    </div>
  )
}