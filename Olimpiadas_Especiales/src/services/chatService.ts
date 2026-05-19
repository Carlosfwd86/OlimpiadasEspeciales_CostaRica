import apiClient from '../api/apiClient';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const sendMessage = async (messages: Message[]): Promise<string> => {
  try {
    const response = await apiClient.post('/chats', { messages });
    return response.data.message;
  } catch (error) {
    console.error('Error in chat service:', error);
    throw new Error('No se pudo obtener respuesta del asistente.');
  }
};
