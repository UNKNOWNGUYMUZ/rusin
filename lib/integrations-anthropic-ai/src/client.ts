import Anthropic from "@anthropic-ai/sdk";

export function createAnthropicClient(): Anthropic {
  const baseURL = process.env.AI_INTEGRATIONS_OPENAI_BASE_URL;
  const apiKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY ?? process.env.ANTHROPIC_API_KEY ?? "";

  return new Anthropic({
    apiKey,
    ...(baseURL ? { baseURL } : {}),
  });
}

export const anthropic = createAnthropicClient();
