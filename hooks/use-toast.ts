'use client';

import * as React from 'react';

import type { ToastActionElement, ToastProps } from '@/components/ui/toast';

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

let toastIdCounter = 0;

function generateId() {
  toastIdCounter = (toastIdCounter + 1) % Number.MAX_SAFE_INTEGER;
  return toastIdCounter.toString();
}

type ToastAction =
  | { type: 'ADD'; toast: ToasterToast }
  | { type: 'UPDATE'; toast: Partial<ToasterToast> }
  | { type: 'DISMISS'; toastId?: string }
  | { type: 'REMOVE'; toastId?: string };

interface ToastState {
  toasts: ToasterToast[];
}

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const toastReducer = (state: ToastState, action: ToastAction): ToastState => {
  switch (action.type) {
    case 'ADD':
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case 'UPDATE':
      return {
        ...state,
        toasts: state.toasts.map((toast) =>
          toast.id === action.toast.id ? { ...toast, ...action.toast } : toast
        ),
      };

    case 'DISMISS':
      if (action.toastId) {
        scheduleToastRemoval(action.toastId);
      } else {
        state.toasts.forEach((toast) => scheduleToastRemoval(toast.id));
      }
      return {
        ...state,
        toasts: state.toasts.map((toast) =>
          action.toastId === undefined || toast.id === action.toastId
            ? { ...toast, open: false }
            : toast
        ),
      };

    case 'REMOVE':
      return {
        ...state,
        toasts: state.toasts.filter((toast) => toast.id !== action.toastId),
      };

    default:
      return state;
  }
};

const listeners: Array<(state: ToastState) => void> = [];
let memoryState: ToastState = { toasts: [] };

function dispatch(action: ToastAction) {
  memoryState = toastReducer(memoryState, action);
  listeners.forEach((listener) => listener(memoryState));
}

function scheduleToastRemoval(toastId: string) {
  if (!toastTimeouts.has(toastId)) {
    const timeout = setTimeout(() => {
      toastTimeouts.delete(toastId);
      dispatch({ type: 'REMOVE', toastId });
    }, TOAST_REMOVE_DELAY);

    toastTimeouts.set(toastId, timeout);
  }
}

function toast({ ...props }: Omit<ToasterToast, 'id'>) {
  const id = generateId();

  dispatch({
    type: 'ADD',
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dispatch({ type: 'DISMISS', toastId: id });
      },
    },
  });

  return {
    id,
    dismiss: () => dispatch({ type: 'DISMISS', toastId: id }),
    update: (updatedProps: Partial<ToasterToast>) =>
      dispatch({ type: 'UPDATE', toast: { ...updatedProps, id } }),
  };
}

function useToast() {
  const [state, setState] = React.useState(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      listeners.splice(listeners.indexOf(setState), 1);
    };
  }, []);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: 'DISMISS', toastId }),
  };
}

export { useToast, toast };