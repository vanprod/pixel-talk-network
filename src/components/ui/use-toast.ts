
import { useToast, toast } from "@/hooks/use-toast";

// Add extra CSS classes to toast components
const originalToast = toast;
const enhancedToast = (props: Parameters<typeof toast>[0]) => {
  return originalToast({
    ...props,
    className: `toast-theme ${props.className || ''}`,
  });
};

// Override the original toast with the enhanced one
export { useToast, enhancedToast as toast };
