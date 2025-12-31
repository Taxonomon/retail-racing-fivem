export type AddToastProps = {
  type: ToastType;
  text: string;
};

export type ToastType = 'INFO' | 'WARNING' | 'ERROR';
