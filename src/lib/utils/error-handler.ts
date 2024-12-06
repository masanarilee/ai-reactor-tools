import { toast } from "@/components/ui/use-toast";

export function handleError(error: unknown, customMessage?: string) {
  console.error('Error occurred:', error);
  
  const errorMessage = error instanceof Error ? error.message : "予期せぬエラーが発生しました";
  
  toast({
    variant: "destructive",
    title: "エラーが発生しました",
    description: customMessage || errorMessage
  });

  return errorMessage;
}

export function handleSuccess(message: string) {
  toast({
    title: "成功",
    description: message
  });
}