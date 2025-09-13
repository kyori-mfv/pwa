export interface ToolEvent<T = unknown> {
  type: string;
  data: T;
  source: string;
  timestamp: number;
}

export type EventHandler<T = unknown> = (event: ToolEvent<T>) => void;

export interface EventSubscription {
  id: string;
  handler: EventHandler;
}
