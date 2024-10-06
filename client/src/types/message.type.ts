export interface Message {
  selectedRoom: string;
  id?: string;
  name: string;
  audioUrl?: string;
  audioBlob?: Blob;
}

export interface MessageTab {
  id?: string;
  name: string;
}

export interface MessageState {
  messages: Message[];
  loading: boolean;
  error: string | null;
}
