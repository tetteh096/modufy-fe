export type CancelLateAction = "forfeit_deposit" | "fixed_fee" | "none";

export function buildCancellationPolicyPreview(
  windowHours: number,
  lateAction: CancelLateAction,
  feeAmount: number,
  currency: string
): { enabled: boolean; text: string } {
  const enabled = lateAction !== "none" && windowHours > 0;

  if (!enabled) {
    return {
      enabled: false,
      text: "You may cancel your booking at any time before your appointment.",
    };
  }

  const base = `Free cancellation up to ${windowHours} hours before your appointment. `;

  if (lateAction === "fixed_fee") {
    if (feeAmount > 0) {
      return {
        enabled: true,
        text:
          base +
          `Cancellations within ${windowHours} hours are subject to a fee of ${currency} ${feeAmount.toFixed(2)}; any deposit paid may be applied to this fee.`,
      };
    }
    return {
      enabled: true,
      text: base + `Cancellations within ${windowHours} hours may forfeit your deposit.`,
    };
  }

  return {
    enabled: true,
    text:
      base +
      `Cancellations within ${windowHours} hours are non-refundable — your deposit will not be returned.`,
  };
}
