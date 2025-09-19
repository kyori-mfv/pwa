import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Calendar } from "@/shared/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { AlertCircle, Check, Loader2, Wand2, ChevronDown, CalendarDays, Calendar as CalendarIcon, DollarSign, Tag, FileText, Sparkles, Edit3 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useExpenseManager } from "../../hooks/use-expense-manager";
import type { ExpenseManagerState, ParsedExpense } from "../../types";

interface AIExpenseInputProps {
  toolState: ExpenseManagerState;
  setToolState: (
    newState:
      | Partial<ExpenseManagerState>
      | ((prev: ExpenseManagerState) => Partial<ExpenseManagerState>)
  ) => void;
}

export const AIExpenseInput: React.FC<AIExpenseInputProps> = ({ toolState, setToolState }) => {
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [preview, setPreview] = useState<ParsedExpense | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [isSavingExpense, setIsSavingExpense] = useState(false);
  const [editablePreview, setEditablePreview] = useState<ParsedExpense | null>(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const { initializeAI, parseExpense, addExpense, updateAIProvider, isLoading } = useExpenseManager(
    toolState,
    setToolState
  );

  // Initialize AI providers on mount
  useEffect(() => {
    initializeAI();
  }, [initializeAI]);

  const handleParseExpense = useCallback(async () => {
    if (!input.trim()) return;

    setIsProcessing(true);
    setError(null);

    try {
      const parsed = await parseExpense(input);
      setPreview(parsed);
      setEditablePreview(parsed);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse expense");
      setPreview(null);
      setEditablePreview(null);
    } finally {
      setIsProcessing(false);
    }
  }, [input, parseExpense]);

  const handleSaveExpense = useCallback(async () => {
    if (!editablePreview) return;

    setIsSavingExpense(true);
    try {
      await addExpense({
        amount: editablePreview.amount,
        category: editablePreview.category,
        description: editablePreview.description,
        date: editablePreview.date || new Date(),
        originalInput: input,
      });

      // Clear form
      setInput("");
      setPreview(null);
      setEditablePreview(null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save expense");
    } finally {
      setIsSavingExpense(false);
    }
  }, [editablePreview, input, addExpense]);

  const handleConfigureGemini = useCallback(async () => {
    if (!apiKey.trim()) return;

    try {
      await updateAIProvider("gemini", {
        apiKey: apiKey.trim(),
        enabled: true,
      });

      // Clear the input field since it's now stored
      setApiKey("");

      // Re-initialize providers
      initializeAI();
    } catch (error) {
      setError("Failed to save API key");
    }
  }, [apiKey, updateAIProvider, initializeAI]);

  // Check if Gemini is configured
  const geminiProvider = toolState.aiProviders.find((p) => p.id === "gemini");
  const isGeminiConfigured = geminiProvider?.enabled && geminiProvider?.apiKey;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="w-5 h-5" />
            Nhập Chi tiêu bằng AI
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isGeminiConfigured && !isLoading && (
            <div className="space-y-3 p-4 bg-muted border rounded-lg">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <h4 className="text-lg font-medium">Cần cấu hình AI để sử dụng</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Ứng dụng sử dụng Google Gemini AI để phân tích chi tiêu bằng tiếng Việt tự nhiên.
                  Vui lòng nhập khóa API miễn phí để bắt đầu.
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
                <Button onClick={handleConfigureGemini} disabled={!apiKey.trim()}>
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
          )}

          {isGeminiConfigured && (
            <div className="mb-4 p-3 bg-muted border rounded-lg">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                <p className="text-sm">
                  Đã cấu hình Gemini API và sẵn sàng sử dụng
                </p>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              <span>Đang tải dữ liệu của bạn...</span>
            </div>
          )}

          {isGeminiConfigured && (
            <>
              <div className="space-y-2">
                <Label htmlFor="expense-input">Mô tả chi tiêu của bạn</Label>
                <Textarea
                  id="expense-input"
                  placeholder="Ví dụ: Tôi ăn cơm trưa ở quán cơm tấm hết 45.000đ hôm nay"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleParseExpense}
                  disabled={!input.trim() || isProcessing}
                  className="flex items-center gap-2"
                >
                  {isProcessing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Wand2 className="w-4 h-4" />
                  )}
                  {isProcessing ? "Đang phân tích..." : "Phân tích bằng AI"}
                </Button>

                {editablePreview && (
                  <Button
                    onClick={handleSaveExpense}
                    variant="default"
                    className="flex items-center gap-2"
                    disabled={isSavingExpense}
                  >
                    {isSavingExpense ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    {isSavingExpense ? "Đang lưu..." : "Lưu Chi tiêu"}
                  </Button>
                )}
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

            </>
          )}

          {editablePreview && (
            <Card className="border-muted bg-sidebar">
              <CardHeader>
                <CardTitle className="text-base flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Edit3 className="w-4 h-4 text-primary" />
                    <span>Chỉnh sửa thông tin</span>
                  </div>
                  <Badge variant={preview?.confidence && preview.confidence > 0.7 ? "default" : "secondary"} className="text-xs">
                    Độ tin cậy {Math.round((preview?.confidence || 0) * 100)}%
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Date first - most important */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <CalendarDays className="w-4 h-4 text-primary" />
                    <Label htmlFor="edit-date" className="text-sm font-bold">Ngày</Label>
                  </div>
                  <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        id="edit-date"
                        className="w-full bg-transparent justify-between font-normal mt-1"
                      >
                        {editablePreview.date
                          ? editablePreview.date.toLocaleDateString("vi-VN", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric"
                            })
                          : "Chọn ngày"
                        }
                        <CalendarDays className="h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={editablePreview.date || new Date()}
                        onSelect={(date) => {
                          if (date) {
                            setEditablePreview({
                              ...editablePreview,
                              date: date
                            });
                          }
                          setDatePickerOpen(false);
                        }}
                        defaultMonth={editablePreview.date || new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="w-4 h-4 text-primary" />
                      <Label htmlFor="edit-amount" className="text-sm font-bold">Số tiền</Label>
                    </div>
                    <Input
                      id="edit-amount"
                      type="number"
                      value={editablePreview.amount}
                      onChange={(e) => setEditablePreview({
                        ...editablePreview,
                        amount: Number.parseFloat(e.target.value) || 0
                      })}
                      className="mt-1"
                      placeholder="VND"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Tag className="w-4 h-4 text-primary" />
                      <Label htmlFor="edit-category" className="text-sm font-bold">Danh mục</Label>
                    </div>
                    <Select
                      value={editablePreview.category}
                      onValueChange={(value) => setEditablePreview({
                        ...editablePreview,
                        category: value
                      })}
                    >
                      <SelectTrigger className="min-w-full mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {toolState.categories.map((category) => (
                          <SelectItem key={category.id} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="w-4 h-4 text-primary" />
                    <Label htmlFor="edit-description" className="text-sm font-bold">Mô tả</Label>
                  </div>
                  <Textarea
                    id="edit-description"
                    value={editablePreview.description}
                    onChange={(e) => setEditablePreview({
                      ...editablePreview,
                      description: e.target.value
                    })}
                    rows={2}
                    className="mt-1 resize-none"
                    placeholder="Nhập mô tả chi tiêu..."
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
