import type { EventHandler, EventSubscription, ToolEvent } from "@/shared/types/event";

class EventBus {
  private subscriptions = new Map<string, EventSubscription[]>();

  subscribe<T>(eventType: string, handler: EventHandler<T>): string {
    const subscriptionId = `${eventType}-${Date.now()}-${Math.random()}`;
    const subscription: EventSubscription = {
      id: subscriptionId,
      handler: handler as EventHandler,
    };

    if (!this.subscriptions.has(eventType)) {
      this.subscriptions.set(eventType, []);
    }

    this.subscriptions.get(eventType)?.push(subscription);
    return subscriptionId;
  }

  unsubscribe(subscriptionId: string): boolean {
    for (const [eventType, subs] of this.subscriptions.entries()) {
      const index = subs.findIndex((sub) => sub.id === subscriptionId);
      if (index !== -1) {
        subs.splice(index, 1);
        if (subs.length === 0) {
          this.subscriptions.delete(eventType);
        }
        return true;
      }
    }
    return false;
  }

  emit<T>(eventType: string, data: T, source: string): void {
    const event: ToolEvent<T> = {
      type: eventType,
      data,
      source,
      timestamp: Date.now(),
    };

    const subscriptions = this.subscriptions.get(eventType);
    if (subscriptions) {
      for (const sub of subscriptions) {
        try {
          sub.handler(event);
        } catch (error) {
          console.error(`Error in event handler for ${eventType}:`, error);
        }
      }
    }
  }
}

export const eventBus = new EventBus();
