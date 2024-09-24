export interface MessageRoom {
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

export interface MessageRoomState {
  rooms: MessageRoom[];
  loading: boolean;
  error: string | null;
}
