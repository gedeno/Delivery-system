import { cn } from "@/lib/utils";
import { Forward, ForwardIcon } from "lucide-react";
import { InputHTMLAttributes, forwardRef } from "react";
interface InputProps extends InputHTMLAttributes<HTMLInputElement>{
    label?:string;
    error?:string
}
export const Input = forwardRef<HTMLInputElement,InputProps>(
    ({className ,label ,error , id , ...props},ref) => {
        const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-")
        return(
            <div className="w-full">
                {
                    label&&(
                        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-gray-700">{label}</label>
                    )
                }
                <input ref= {ref}
                id={inputId} 
                className={cn(
                    "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 disabled:bg-gray-50",
                    error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
                    className
                )}
                {...props} />
            </div>
        
    )
    }
    
)