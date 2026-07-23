/**
 * Lightweight keyword hints, not a classifier. These flag the current
 * message so the system prompt can append its proactive-assistance or
 * retention protocol for this turn only — the model still does the actual
 * judgment call about how (or whether) to act on it.
 */
const CANCELLATION_PATTERN =
  /\b(cancel(l?ing)?|refund|downgrade|not worth it|too expensive|close (my|the) account|stop (my )?subscription|unsubscribe)\b/i;

const PRICING_PATTERN =
  /\b(price|pricing|cost|costs|expensive|afford|discount|cheaper|worth it|budget)\b/i;

export function detectCancellationIntent(text: string): boolean {
  return CANCELLATION_PATTERN.test(text);
}

export function detectPricingHesitation(text: string): boolean {
  return PRICING_PATTERN.test(text);
}
