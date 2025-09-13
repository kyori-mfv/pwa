import { useToolsStore } from "@/app/store/tools-store";
import { useCallback, useEffect, useState } from "react";

export function useToolState<T extends Record<string, unknown>>(
  instanceId: string,
  initialState: T
) {
  const { saveToolState, loadToolState } = useToolsStore();

  // Initialize state from persisted or initial state
  const [state, setStateInternal] = useState<T>(() => {
    const persistedState = loadToolState(instanceId);
    return persistedState ? ({ ...initialState, ...persistedState } as T) : initialState;
  });

  // Save state to registry whenever it changes
  const setState = useCallback(
    (newState: Partial<T> | ((prevState: T) => Partial<T>)) => {
      setStateInternal((prevState) => {
        const updatedState =
          typeof newState === "function"
            ? { ...prevState, ...newState(prevState) }
            : { ...prevState, ...newState };

        // Save to persistent storage
        saveToolState(instanceId, updatedState);
        return updatedState;
      });
    },
    [instanceId, saveToolState]
  );

  // Load persisted state on instanceId change
  useEffect(() => {
    const persistedState = loadToolState(instanceId);
    if (persistedState) {
      setStateInternal((prevState) => ({ ...prevState, ...persistedState }) as T);
    }
  }, [instanceId, loadToolState]);

  return [state, setState] as const;
}
