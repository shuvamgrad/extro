export interface ChatMessage {
  id: string;
  sender: string; // Public key of sender
  content: string; // Text content
  timestamp: number;
}

export interface Chat {
  id: string;
  name: string; // e.g. "John and Jane" or "Crypto Devs Group"
  members: string[]; // Array of public keys
  messages: ChatMessage[];
}
