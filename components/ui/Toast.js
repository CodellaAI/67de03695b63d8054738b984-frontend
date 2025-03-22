
'use client'

import { createContext, useContext, useState } from 'react'
import * as ToastPrimitive from '@radix-ui/react-toast'
import { X } from 'lucide-react'

const ToastContext = createContext({
  toast: () => {},
})

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const toast = ({ title, description, variant = 'default', duration = 5000 }) => {
    const id = Math.random().toString(36).substring(2, 9)
    
    setToasts((prevToasts) => [
      ...prevToasts,
      { id, title, description, variant, duration },
    ])

    return id
  }

  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      <ToastPrimitive.Provider>
        {children}
        
        {toasts.map(({ id, title, description, variant, duration }) => (
          <ToastPrimitive.Root
            key={id}
            className={`fixed bottom-4 right-4 z-50 flex items-start max-w-sm rounded-lg shadow-lg p-4 ${
              variant === 'destructive' ? 'bg-red-600 text-white' : 'bg-gray-800 border border-gray-700 text-white'
            }`}
            onOpenChange={(open) => {
              if (!open) removeToast(id)
            }}
            duration={duration}
          >
            <div className="flex-1">
              {title && <ToastPrimitive.Title className="font-medium mb-1">{title}</ToastPrimitive.Title>}
              {description && <ToastPrimitive.Description className="text-sm opacity-90">{description}</ToastPrimitive.Description>}
            </div>
            
            <ToastPrimitive.Close className="ml-2 p-1 rounded-md hover:bg-gray-700">
              <X size={16} />
            </ToastPrimitive.Close>
          </ToastPrimitive.Root>
        ))}
        
        <ToastPrimitive.Viewport />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  
  return context
}
