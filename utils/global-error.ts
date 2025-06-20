let setGlobalError: (val: boolean) => void;

export const registerGlobalErrorSetter = (fn: (val: boolean) => void) => {
  setGlobalError = fn;
};

export const triggerGlobalError = () => {
  if (setGlobalError) setGlobalError(true);
};

export const clearGlobalError = () => {
  if (setGlobalError) setGlobalError(false);
};
