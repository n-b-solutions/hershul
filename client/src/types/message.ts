export interface MessageRoom {
    selectedRoom:string;
    id?: string;
    name: string;
    audioUrl?: string;
    audioBlob?: Blob;
  }

 export interface MessageRoomState {
    rooms: MessageRoom[];
    loading: boolean;
    error: string | null;
  }