import { API_BASE_URL } from '@/const/api.const';
import axios from 'axios';

export const playAudio = async (audioUrl: string) => {
  try {
    await axios.post(`${API_BASE_URL}/play-audio`, { audioUrl });
  } catch (error) {
    console.error('Error playing audio:', error);
  }
};
