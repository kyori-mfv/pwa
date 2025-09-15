import { useToolState } from "@/shared/hooks/use-tool-state";
import type { ToolComponentProps } from "@/shared/types/tool";
import { useState } from "react";
import type { JwtDecoderState } from "../types";
import { decodeJwt, validateJwt } from "../utils";
import { JwtDecodedDisplay } from "./jwt-decoded-display";
import { JwtTokenInput } from "./jwt-token-input";
import { JwtValidationStatus } from "./jwt-validation-status";

const initialState: JwtDecoderState = {
  token: "",
  decodedResult: null,
  validationResult: null,
};

export function JwtDecoder({ instanceId }: ToolComponentProps) {
  const [state, setState] = useToolState(instanceId, initialState);
  const [copyStatus, setCopyStatus] = useState<string>("");

  const handleTokenChange = (value: string) => {
    setState({ token: value });

    if (value.trim()) {
      const decoded = decodeJwt(value.trim());
      const validation = validateJwt(decoded);
      setState({
        token: value,
        decodedResult: decoded,
        validationResult: validation,
      });
    } else {
      setState({
        token: value,
        decodedResult: null,
        validationResult: null,
      });
    }
  };

  const handleClear = () => {
    setState(initialState);
  };

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus(`${label} copied!`);
      setTimeout(() => setCopyStatus(""), 2000);
    } catch {
      setCopyStatus("Failed to copy");
      setTimeout(() => setCopyStatus(""), 2000);
    }
  };

  return (
    <div className="jwt-decoder h-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
        {/* Left Side - Input */}
        <div className="space-y-4">
          <JwtTokenInput
            token={state.token}
            onTokenChange={handleTokenChange}
            onClear={handleClear}
            copyStatus={copyStatus}
          />
          <JwtValidationStatus validationResult={state.validationResult} />
        </div>

        {/* Right Side - Output */}
        <div className="space-y-4">
          <JwtDecodedDisplay
            decodedResult={state.decodedResult}
            validationResult={state.validationResult}
            onCopy={handleCopy}
          />
        </div>
      </div>
    </div>
  );
}
