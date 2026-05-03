import { anthropic } from "@workspace/integrations-anthropic-ai";
import type { GenerateTripInput } from "@workspace/api-zod";

export async function generateTravelPlan(input: GenerateTripInput): Promise<unknown> {
  const prompt = buildPrompt(input);

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 8192,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const textBlock = message.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from AI");
  }

  const jsonMatch = textBlock.text.match(/```json\n?([\s\S]*?)\n?```/) ??
    textBlock.text.match(/(\{[\s\S]*\})/);
  if (!jsonMatch) throw new Error("Could not parse AI response as JSON");

  return JSON.parse(jsonMatch[1]);
}

function buildPrompt(input: GenerateTripInput): string {
  const days = Math.ceil(
    (new Date(input.endDate).getTime() - new Date(input.startDate).getTime()) /
      (1000 * 60 * 60 * 24)
  ) + 1;

  return `Ты — опытный туристический планировщик. Составь подробный маршрут путешествия по России.

Параметры поездки:
- Откуда: ${input.origin}
- Куда: ${input.destination}
- Тип транспорта: ${input.transportType}
- Тип отдыха: ${input.travelType}
- Даты: с ${input.startDate} по ${input.endDate} (${days} дней)
- Бюджет: ${input.budget} ${input.currency}
- Взрослых: ${input.adults}, детей: ${input.children ?? 0}
${input.accommodationType ? `- Тип жилья: ${input.accommodationType}` : ""}
${input.accommodationStars ? `- Звёзды отеля: ${input.accommodationStars}` : ""}
${input.notes ? `- Дополнительно: ${input.notes}` : ""}

Верни ТОЛЬКО валидный JSON без комментариев в следующем формате:
\`\`\`json
{
  "destination": "${input.destination}",
  "totalDays": ${days},
  "summary": "краткое описание маршрута",
  "cityPhoto": "описание города для фото",
  "days": [
    {
      "day": 1,
      "date": "${input.startDate}",
      "morning": [{"title": "название", "address": "адрес", "cost": 500, "description": "описание"}],
      "afternoon": [{"title": "название", "address": "адрес", "cost": 300, "description": "описание"}],
      "evening": [{"title": "название", "address": "адрес", "cost": 1000, "description": "описание"}]
    }
  ],
  "hotels": [
    {"name": "название", "stars": 3, "pricePerNight": 3000, "totalPrice": 9000, "amenities": ["Wi-Fi", "завтрак"], "pros": ["плюс1"], "bookingUrl": "https://travel.yandex.ru/--/xaIXaYbL8xwedg", "type": "budget"},
    {"name": "название", "stars": 4, "pricePerNight": 5000, "totalPrice": 15000, "amenities": ["Wi-Fi", "завтрак", "парковка"], "pros": ["плюс1"], "bookingUrl": "https://travel.yandex.ru/--/xaIXaYbL8xwedg", "type": "mid"},
    {"name": "название", "stars": 5, "pricePerNight": 10000, "totalPrice": 30000, "amenities": ["Wi-Fi", "завтрак", "СПА", "бассейн"], "pros": ["плюс1"], "bookingUrl": "https://travel.yandex.ru/--/xaIXaYbL8xwedg", "type": "premium"}
  ],
  "transport": {
    "type": "${input.transportType}",
    "options": [{"title": "вариант", "duration": "2ч", "price": 2000, "description": "описание"}]
  },
  "attractions": [
    {"title": "название", "description": "описание", "cost": 500, "bookingUrl": ""}
  ],
  "budgetBreakdown": {
    "accommodation": 9000,
    "food": 5000,
    "transport": 3000,
    "activities": 2000,
    "total": 19000
  }
}
\`\`\``;
}
