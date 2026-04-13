import { cn } from '@/shared/lib/utils';
import * as ToastPrimitives from '@radix-ui/react-toast';
import { cva } from 'class-variance-authority';
import { X, CheckCircle, AlertTriangle, XCircle, Info, ArrowUp } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { useToast } from '@/shared/ui/use-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Button } from '@/shared/ui/ui-elements';


// ----------------- toast.jsx -----------------

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      'fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:flex-col-reverse md:max-w-[420px]',
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-2xl p-4 pr-8 shadow-2xl transition-all data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full backdrop-blur-xl border',
  {
    variants: {
      variant: {
        default: 'bg-black/50 border-blue-500/30 text-white',
        destructive: 'bg-red-900/50 border-red-500/50 text-white',
        success: 'bg-green-900/50 border-green-500/50 text-white',
        warning: 'bg-yellow-900/50 border-yellow-500/50 text-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const Toast = React.forwardRef(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      'inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-destructive/30 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive',
      className,
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      'absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100',
      className,
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn('text-sm font-semibold', className)}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn('text-sm opacity-90', className)}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

export {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
};


// ----------------- toaster.jsx -----------------

const icons = {
  success: <CheckCircle className="text-green-400 w-6 h-6" />,
  warning: <AlertTriangle className="text-yellow-400 w-6 h-6" />,
  destructive: <XCircle className="text-red-400 w-6 h-6" />,
  default: <Info className="text-blue-400 w-6 h-6" />,
};

export function Toaster({ onNewToast }) {
  const { toasts } = useToast();
  const processedToastIds = useRef(new Set());

  useEffect(() => {
    toasts.forEach(toast => {
      if (onNewToast && toast.isImportant && !processedToastIds.current.has(toast.id)) {
        onNewToast({
          title: toast.title,
          message: toast.description,
          type: toast.variant || 'default',
        });
        processedToastIds.current.add(toast.id);
      }
    });
  }, [toasts, onNewToast]);

  return (
    <ToastProvider>
      <ul className="fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:flex-col-reverse md:max-w-[420px]">
        <AnimatePresence>
          {toasts.map(function ({ id, title, description, action, variant, ...props }) {
            const Icon = icons[variant] || icons.default;
            return (
              <motion.li
                key={id}
                layout
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                style={{ listStyle: "none" }}
              >
                <Toast {...props} variant={variant}>
                  <div className="flex items-start gap-4 w-full">
                    {Icon}
                    <div className="grid gap-1 flex-1">
                      {title && <ToastTitle>{title}</ToastTitle>}
                      {description && <ToastDescription>{description}</ToastDescription>}
                    </div>
                    {action}
                    <ToastClose />
                  </div>
                </Toast>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
      <ToastViewport />
    </ToastProvider>
  );
}


// ----------------- progress.jsx -----------------

const Progress = React.forwardRef(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      'relative h-4 w-full overflow-hidden rounded-full bg-secondary',
      className,
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };


// ----------------- badge.jsx -----------------

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  ...props
}) {
  return (<div className={cn(badgeVariants({ variant }), className)} {...props} />);
}

export { Badge, badgeVariants }


// ------------------ Scroll To Top ----------------------


const ScrollToTop = () => {
  const { pathname } = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  // Handle auto-scroll on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Handle scroll visibility for the button
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Smooth scroll function for the button
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-4 right-6 z-50"
        >
          <Button
            onClick={scrollToTop}
            size="icon"
            className="h-12 w-12 rounded-full  bg-black/40 backdrop-blur-xl shadow-2xl border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all duration-500 group overflow-hidden"
            aria-label="Scroll to top">
            {/* internal shine like code 2 */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <ArrowUp className="relative z-10 h-6 w-6 text-white group-hover:-translate-y-1 transition-transform duration-300" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export { ScrollToTop };