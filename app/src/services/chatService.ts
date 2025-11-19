import { apiClient } from './apiClient';

type ChatRole = 'system' | 'user' | 'assistant';

export type ChatMessagePayload = {
  role: ChatRole;
  content: string;
};

type ChatCompletionResponse = {
  message: ChatMessagePayload;
  model: string;
};

type CreateChatCompletionParams = {
  messages: ChatMessagePayload[];
  model?: string;
  temperature?: number;
};

async function createChatCompletion(params: CreateChatCompletionParams): Promise<ChatCompletionResponse> {
  const response = await apiClient.post<ChatCompletionResponse>('/api/v1/chat/completions', params);
  return response.data;
}

export const chatService = {
  createChatCompletion,
};

