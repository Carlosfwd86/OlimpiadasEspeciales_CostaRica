import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const sendMessage = async (messages: Message[]): Promise<string> => {
  try {
    const response = await axios.post(`${API_URL}/chat`, { messages });
    return response.data.message;
  } catch (error) {
    console.error('Error in chat service:', error);
    throw new Error('No se pudo obtener respuesta del asistente.');
  }
};
