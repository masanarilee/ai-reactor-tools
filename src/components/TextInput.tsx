import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface TextInputProps {
  label: string
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  align?: 'left' | 'center'
}

export function TextInput({ label, placeholder, value, onChange, align = 'center' }: TextInputProps) {
  return (
    <div className={`space-y-2 ${align === 'left' ? 'text-left' : 'text-center'}`}>
      <Label>{label}</Label>
      <Textarea 
        placeholder={placeholder}
        className="min-h-[100px] bg-white"
        value={value}
        onChange={onChange}
      />
    </div>
  )
}