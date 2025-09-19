import type { AIProvider, AIProviderConfig, ParsedExpense } from "../../types";
import { CATEGORY_KEYWORDS } from "../../utils/default-categories";

export class GeminiProvider implements AIProvider {
  name = "Gemini";
  private config: AIProviderConfig;

  constructor(config: AIProviderConfig) {
    this.config = config;
  }

  isConfigured(): boolean {
    return !!(this.config.apiKey && this.config.enabled);
  }

  validateConfig(config: AIProviderConfig): boolean {
    return !!(config.apiKey && config.apiUrl && config.model);
  }

  async parseExpense(input: string): Promise<ParsedExpense> {
    if (!this.isConfigured()) {
      throw new Error("Gemini provider not configured");
    }

    const prompt = this.buildPrompt(input);

    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-goog-api-key": this.config.apiKey || "",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.1,
              maxOutputTokens: 200,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        throw new Error("No response from Gemini API");
      }

      return this.parseResponse(text, input);
    } catch (error) {
      console.error("Gemini parsing error:", error);
      throw error;
    }
  }

  private buildPrompt(input: string): string {
    const categoryNames = [
      "Ăn uống",
      "Di chuyển",
      "Mua sắm",
      "Giải trí",
      "Hóa đơn & Tiện ích",
      "Sức khỏe",
      "Giáo dục",
      "Du lịch",
      "Dịch vụ & Đăng ký",
      "Con cái",
      "Khác",
    ];

    return `Phân tích chi tiêu này và trả về CHỈ MỘT đối tượng JSON với cấu trúc sau:
{
  "amount": number,
  "category": "${categoryNames.join(", ")}",
  "description": "string",
  "date": "YYYY-MM-DD",
  "confidence": number (0-1)
}

Quy tắc QUAN TRỌNG:
- AMOUNT: Trích xuất số tiền chính xác. Chú ý: "100k" = 100000, "1tr" = 1000000
- DESCRIPTION: *
- CATEGORY: Chọn danh mục phù hợp nhất từ danh sách
- DATE: Tính toán ngày chính xác dạng YYYY-MM-DD. Hôm nay là ${new Date().toISOString().split('T')[0]}
- CONFIDENCE: Cao (>0.8) khi thông tin rõ ràng

Đầu vào: "${input}"

Chỉ trả về JSON:`;
  }

  private parseResponse(response: string, originalInput: string): ParsedExpense {
    try {
      // Clean the response to extract JSON
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }

      const parsed = JSON.parse(jsonMatch[0]);

      return {
        amount: parsed.amount || 0,
        category: parsed.category || "Khác",
        description: this.capitalizeFirst(parsed.description || originalInput),
        date: parsed.date ? new Date(parsed.date) : new Date(),
        confidence: Math.min(Math.max(parsed.confidence || 0.5, 0), 1),
        suggestions: [],
      };
    } catch (error) {
      console.error("Error parsing Gemini response:", error);
      // Fallback to basic parsing
      return this.fallbackParse(originalInput);
    }
  }

  private fallbackParse(input: string): ParsedExpense {
    const amountMatch = input.match(/(\d+\.?\d*)/);
    const amount = amountMatch
      ? Number.parseFloat(amountMatch[1]) * (input.includes("k") || input.includes("K") ? 1000 : 1)
      : 0;

    // Simple category guessing with Vietnamese names
    let category = "Khác";
    for (const [categoryKey, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      if (keywords.some((keyword) => input.toLowerCase().includes(keyword))) {
        // Map to Vietnamese category names
        const categoryMap: Record<string, string> = {
          "an-uong": "Ăn uống",
          "di-chuyen": "Di chuyển",
          "mua-sam": "Mua sắm",
          "giai-tri": "Giải trí",
          "hoa-don": "Hóa đơn & Tiện ích",
          "suc-khoe": "Sức khỏe",
          "giao-duc": "Giáo dục",
          "du-lich": "Du lịch",
          "dich-vu": "Dịch vụ & Đăng ký",
          "con-cai": "Con cái",
          khac: "Khác",
        };
        category = categoryMap[categoryKey] || "Khác";
        break;
      }
    }

    // Simple Vietnamese date parsing
    let date = new Date();
    const lowerInput = input.toLowerCase();
    if (lowerInput.includes("hôm qua")) {
      date = new Date();
      date.setDate(date.getDate() - 1);
    } else if (lowerInput.includes("hôm kia")) {
      date = new Date();
      date.setDate(date.getDate() - 2);
    }

    return {
      amount,
      category,
      description: this.capitalizeFirst(input.replace(/(\d+\.?\d*k?)/, "").trim() || input),
      date,
      confidence: 0.3,
      suggestions: ["Đã phân tích với phương pháp dự phòng"],
    };
  }

  private capitalizeFirst(text: string): string {
    if (!text) return text;
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
}
