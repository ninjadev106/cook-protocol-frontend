import { useEffect, useRef } from "react";

export function useIsMountedRef() {
  const ref = useRef<boolean>(false);

  useEffect(() => {
    ref.current = true;
    return () => {
      ref.current = false;
    };
  });

  return ref;
}
