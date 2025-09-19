import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Check, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";

interface AIProviderConfigProps {
  isGeminiConfigured: boolean;
  isLoading: boolean;
  onConfigureGemini: (apiKey: string) => Promise<void>;
}

export const AIProviderConfig: React.FC<AIProviderConfigProps> = ({
  isGeminiConfigured,
  isLoading,
  onConfigureGemini,
}) => {
  const [apiKey, setApiKey] = useState("");

  const handleGeminiConfig = async () => {
    if (!apiKey.trim()) return;

    try {
      await onConfigureGemini(apiKey);
      setApiKey("");
    } catch {
      // Error handled by parent
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        <span>Đang tải dữ liệu của bạn...</span>
      </div>
    );
  }

  if (isGeminiConfigured) {
    return (
      <div className="mb-4 p-3 bg-muted border rounded-lg">
        <div className="flex items-center gap-2">
          <Check className="w-4 h-4 text-primary" />
          <p className="text-sm">Đã cấu hình Gemini API và sẵn sàng sử dụng</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-4 bg-muted border rounded-lg">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <h4 className="text-lg font-medium">Cần cấu hình AI để sử dụng</h4>
        </div>
        <p className="text-sm text-muted-foreground">
          Ứng dụng sử dụng Google Gemini AI để phân tích chi tiêu bằng tiếng Việt tự nhiên. Vui lòng
          nhập khóa API miễn phí để bắt đầu.
        </p>
      </div>
      <Label htmlFor="gemini-api-key">Khóa API Gemini (miễn phí)</Label>
      <div className="flex gap-2">
        <Input
          id="gemini-api-key"
          type="password"
          placeholder="Nhập khóa API Gemini của bạn"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
        <Button onClick={handleGeminiConfig} disabled={!apiKey.trim()}>
          Cấu hình
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Lấy khóa API miễn phí từ{" "}
        <a
          href="https://aistudio.google.com/app/apikey"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline font-medium"
        >
          Google AI Studio
        </a>{" "}
        (chỉ mất 30 giây)
      </p>
    </div>
  );
};
