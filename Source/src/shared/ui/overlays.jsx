import React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { cva } from 'class-variance-authority';
import { Command as CommandPrimitive } from "cmdk"
import { Search } from "lucide-react"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { Check, ChevronRight, Circle } from 'lucide-react';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import { buttonVariants } from '@/shared/ui/ui-elements';


// ----------------- dialog.jsx -----------------

// Hook for media query
const useMediaQuery = (query) => {
	const [matches, setMatches] = React.useState(false);
	React.useEffect(() => {
		const media = window.matchMedia(query);
		setMatches(media.matches);
		const listener = (e) => setMatches(e.matches);
		media.addEventListener('change', listener);
		return () => media.removeEventListener('change', listener);
	}, [query]);
	return matches;
};

// Motion Variants
const containerVariants = (isMobile) => ({
	hidden: {
		opacity: 0,
		y: isMobile ? '100vh' : '-50%',
		x: '-50%',
		scale: 0.95,
	},
	visible: {
		opacity: 1,
		y: '-50%',
		x: '-50%',
		scale: 1,
		transition: { type: 'spring', stiffness: 260, damping: 30 },
	},
	exit: {
		opacity: 0,
		scale: 0.95,
		y: isMobile ? '100vh' : '-50%',
		transition: { duration: 0.25, ease: 'easeInOut' },
	},
});

// --- Base ---
const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogClose = DialogPrimitive.Close;

const DialogOverlay = ({ isOpen }) => (
	<AnimatePresence>
		{isOpen && (
			<DialogPrimitive.Overlay asChild>
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.3 }}
					className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md"
				/>
			</DialogPrimitive.Overlay>
		)}
	</AnimatePresence>
);

// --- Content ---
const dialogContentVariants = cva(
	'fixed left-1/2 top-1/2 z-50 flex flex-col w-full max-h-[90vh] rounded-2xl shadow-2xl shadow-black/50 focus:outline-none',
	{
		variants: {
			size: {
				default: 'max-w-lg',
				sm: 'max-w-sm',
				lg: 'max-w-2xl',
				fullscreen: 'w-full h-full max-h-full max-w-full rounded-none',
			},
		},
		defaultVariants: {
			size: 'default',
		},
	}
);

const DialogContent = React.forwardRef(({ className, children, size, ...props }, ref) => {
	const isMobile = useMediaQuery('(max-width: 640px)');
	return (
		<DialogPrimitive.Portal>
			<DialogPrimitive.Content
				asChild
				forceMount
				onInteractOutside={(e) => e.preventDefault()}
				{...props}
			>
				<AnimatePresence>
					<motion.div
						ref={ref}
						variants={containerVariants(isMobile)}
						initial="hidden"
						animate="visible"
						exit="exit"
						className={cn(
							dialogContentVariants({ size }),
							className,
							'overflow-hidden bg-black/30 backdrop-blur-xl border border-white/10'
						)}
					>
						{/* Aurora effect */}
						<div className="absolute inset-0 -z-10 overflow-hidden rounded-2xl">
							<div className="absolute left-1/2 top-0 h-full w-[200%] -translate-x-1/2 bg-[radial-gradient(50%_50%_at_50%_0%,rgba(100,100,255,0.15)_0%,rgba(0,0,0,0)_100%)]" />
						</div>

						{children}

						<DialogPrimitive.Close className="absolute right-4 top-4 rounded-full p-1.5 text-gray-400 opacity-80 transition-all hover:opacity-100 hover:bg-white/10 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50">
							<X className="h-5 w-5" />
							<span className="sr-only">Close</span>
						</DialogPrimitive.Close>
					</motion.div>
				</AnimatePresence>
			</DialogPrimitive.Content>
		</DialogPrimitive.Portal>
	);
});
DialogContent.displayName = 'DialogContent';

// --- Sub components ---
const DialogHeader = ({ className, ...props }) => (
	<div className={cn('flex flex-col space-y-2 text-center sm:text-left p-4', className)} {...props} />
);
const DialogFooter = ({ className, ...props }) => (
	<div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 p-4', className)} {...props} />
);
const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
	<DialogPrimitive.Title ref={ref} className={cn('text-xl font-semibold text-gray-50', className)} {...props} />
));
const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (
	<DialogPrimitive.Description ref={ref} className={cn('text-sm text-gray-400', className)} {...props} />
));

export {
	Dialog,
	DialogTrigger,
	DialogClose,
	DialogContent,
	DialogHeader,
	DialogFooter,
	DialogTitle,
	DialogDescription,
	DialogOverlay,
};

// ----------------- alert-dialog.jsx -----------------

const AlertDialog = AlertDialogPrimitive.Root;
const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
const AlertDialogPortal = AlertDialogPrimitive.Portal;

const AlertDialogOverlay = React.forwardRef(({ className, ...props }, ref) => (
	<AlertDialogPrimitive.Overlay
		className={cn(
			'fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
			className
		)}
		{...props}
		ref={ref}
	/>
));
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;

const AlertDialogContent = React.forwardRef(({ className, ...props }, ref) => (
	<AlertDialogPortal>
		<AlertDialogOverlay />
		<AlertDialogPrimitive.Content
			ref={ref}
			className={cn(
				'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-slate-700 bg-slate-900 p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-2xl',
				className
			)}
			{...props}
		/>
	</AlertDialogPortal>
));
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;

const AlertDialogHeader = ({ className, ...props }) => (
	<div className={cn('flex flex-col space-y-2 text-center sm:text-left', className)} {...props} />
);
AlertDialogHeader.displayName = 'AlertDialogHeader';

const AlertDialogFooter = ({ className, ...props }) => (
	<div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)} {...props} />
);
AlertDialogFooter.displayName = 'AlertDialogFooter';

const AlertDialogTitle = React.forwardRef(({ className, ...props }, ref) => (
	<AlertDialogPrimitive.Title ref={ref} className={cn('text-lg font-semibold text-white', className)} {...props} />
));
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;

const AlertDialogDescription = React.forwardRef(({ className, ...props }, ref) => (
	<AlertDialogPrimitive.Description ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
));
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName;

const AlertDialogAction = React.forwardRef(({ className, ...props }, ref) => (
	<AlertDialogPrimitive.Action ref={ref} className={cn(buttonVariants(), className)} {...props} />
));
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;

const AlertDialogCancel = React.forwardRef(({ className, ...props }, ref) => (
	<AlertDialogPrimitive.Cancel
		ref={ref}
		className={cn(buttonVariants({ variant: 'outline' }), 'mt-2 sm:mt-0', className)}
		{...props}
	/>
));
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;

export {
	AlertDialog,
	AlertDialogPortal,
	AlertDialogOverlay,
	AlertDialogTrigger,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogFooter,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogAction,
	AlertDialogCancel,
};

// ----------------- dropdown-menu.jsx -----------------

const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuGroup = DropdownMenuPrimitive.Group;
const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
const DropdownMenuSub = DropdownMenuPrimitive.Sub;
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

const DropdownMenuSubTrigger = React.forwardRef(({ className, inset, children, ...props }, ref) => (
	<DropdownMenuPrimitive.SubTrigger
		ref={ref}
		className={cn(
			'flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent',
			inset && 'pl-8',
			className
		)}
		{...props}
	>
		{children}
		<ChevronRight className="ml-auto h-4 w-4" />
	</DropdownMenuPrimitive.SubTrigger>
));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;

const DropdownMenuSubContent = React.forwardRef(({ className, ...props }, ref) => (
	<DropdownMenuPrimitive.SubContent
		ref={ref}
		className={cn(
			'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
			className
		)}
		{...props}
	/>
));
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;

const DropdownMenuContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => (
	<DropdownMenuPrimitive.Portal>
		<DropdownMenuPrimitive.Content
			ref={ref}
			sideOffset={sideOffset}
			className={cn(
				'z-50 min-w-[8rem] overflow-hidden rounded-xl border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
				className
			)}
			{...props}
		/>
	</DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

const DropdownMenuItem = React.forwardRef(({ className, inset, ...props }, ref) => (
	<DropdownMenuPrimitive.Item
		ref={ref}
		className={cn(
			'relative flex cursor-default select-none items-center rounded-md px-2 py-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
			inset && 'pl-8',
			className
		)}
		{...props}
	/>
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

const DropdownMenuCheckboxItem = React.forwardRef(({ className, children, checked, ...props }, ref) => (
	<DropdownMenuPrimitive.CheckboxItem
		ref={ref}
		className={cn(
			'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
			className
		)}
		checked={checked}
		{...props}
	>
		<span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
			<DropdownMenuPrimitive.ItemIndicator>
				<Check className="h-4 w-4" />
			</DropdownMenuPrimitive.ItemIndicator>
		</span>
		{children}
	</DropdownMenuPrimitive.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;

const DropdownMenuRadioItem = React.forwardRef(({ className, children, ...props }, ref) => (
	<DropdownMenuPrimitive.RadioItem
		ref={ref}
		className={cn(
			'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
			className
		)}
		{...props}
	>
		<span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
			<DropdownMenuPrimitive.ItemIndicator>
				<Circle className="h-2 w-2 fill-current" />
			</DropdownMenuPrimitive.ItemIndicator>
		</span>
		{children}
	</DropdownMenuPrimitive.RadioItem>
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

const DropdownMenuLabel = React.forwardRef(({ className, inset, ...props }, ref) => (
	<DropdownMenuPrimitive.Label
		ref={ref}
		className={cn(
			'px-2 py-1.5 text-sm font-semibold',
			inset && 'pl-8',
			className
		)}
		{...props}
	/>
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

const DropdownMenuSeparator = React.forwardRef(({ className, ...props }, ref) => (
	<DropdownMenuPrimitive.Separator
		ref={ref}
		className={cn('-mx-1 my-1 h-px bg-muted', className)}
		{...props}
	/>
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

const DropdownMenuShortcut = ({ className, ...props }) => {
	return (
		<span
			className={cn('ml-auto text-xs tracking-widest opacity-60', className)}
			{...props}
		/>
	);
};
DropdownMenuShortcut.displayName = 'DropdownMenuShortcut';

export {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuCheckboxItem,
	DropdownMenuRadioItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuGroup,
	DropdownMenuPortal,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuRadioGroup,
};

// ----------------- popover.jsx -----------------

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

const PopoverContent = React.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
	<PopoverPrimitive.Content
	  ref={ref}
	  align={align}
	  sideOffset={sideOffset}
	  className={cn(
		"z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
		className
	  )}
	  {...props}
	/>
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverContent }


// ----------------- command.jsx -----------------

const Command = React.forwardRef(({ className, ...props }, ref) => (
	<CommandPrimitive
		ref={ref}
		className={cn(
			"flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
			className
		)}
		{...props} />
))
Command.displayName = CommandPrimitive.displayName

const CommandDialog = ({ children, ...props }) => {
	return (
		(<Dialog {...props}>
			<DialogContent className="overflow-hidden p-0 shadow-lg">
				<Command
					className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
					{children}
				</Command>
			</DialogContent>
		</Dialog>)
	);
}

const CommandInput = React.forwardRef(({ className, ...props }, ref) => (
	<div className="flex items-center border-b px-3" cmdk-input-wrapper="">
		<Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
		<CommandPrimitive.Input
			ref={ref}
			className={cn(
				"flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
				className
			)}
			{...props} />
	</div>
))

CommandInput.displayName = CommandPrimitive.Input.displayName

const CommandList = React.forwardRef(({ className, ...props }, ref) => (
	<CommandPrimitive.List
		ref={ref}
		className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)}
		{...props} />
))

CommandList.displayName = CommandPrimitive.List.displayName

const CommandEmpty = React.forwardRef((props, ref) => (
	<CommandPrimitive.Empty ref={ref} className="py-6 text-center text-sm" {...props} />
))

CommandEmpty.displayName = CommandPrimitive.Empty.displayName

const CommandGroup = React.forwardRef(({ className, ...props }, ref) => (
	<CommandPrimitive.Group
		ref={ref}
		className={cn(
			"overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
			className
		)}
		{...props} />
))

CommandGroup.displayName = CommandPrimitive.Group.displayName

const CommandSeparator = React.forwardRef(({ className, ...props }, ref) => (
	<CommandPrimitive.Separator ref={ref} className={cn("-mx-1 h-px bg-border", className)} {...props} />
))
CommandSeparator.displayName = CommandPrimitive.Separator.displayName

const CommandItem = React.forwardRef(({ className, ...props }, ref) => (
	<CommandPrimitive.Item
		ref={ref}
		className={cn(
			"relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
			className
		)}
		{...props} />
))

CommandItem.displayName = CommandPrimitive.Item.displayName

const CommandShortcut = ({
	className,
	...props
}) => {
	return (
		(<span
			className={cn("ml-auto text-xs tracking-widest text-muted-foreground", className)}
			{...props} />)
	);
}
CommandShortcut.displayName = "CommandShortcut"

export {
	Command,
	CommandDialog,
	CommandInput,
	CommandList,
	CommandEmpty,
	CommandGroup,
	CommandItem,
	CommandShortcut,
	CommandSeparator,
}
