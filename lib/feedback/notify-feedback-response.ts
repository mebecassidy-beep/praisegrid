import { sendEmail } from "@/lib/email/client";
import { feedbackResponseEmail } from "@/lib/email/templates/feedback-response";
import { sendCrisisAlertSms } from "@/lib/sms/send-crisis-alert";
import { classifyReviewRisk } from "@/lib/reviews/classify-risk";

interface NotifyParams {
  businessEmail: string;
  businessName: string;
  alertPhoneNumber: string | null;
  subscriptionTier: string;
  customerName: string | null;
  rating: number;
  comment: string | null;
}

/**
 * Private-side notification for a Feedback Shield submission. This never
 * decides whether the customer gets a public review invite — that's shown
 * to every respondent unconditionally on the capture page itself — it only
 * alerts the business owner internally, same as any other feedback inbox.
 */
export async function notifyFeedbackResponse(params: NotifyParams): Promise<void> {
  const { businessEmail, businessName, alertPhoneNumber, subscriptionTier, customerName, rating, comment } = params;
  const isLowRating = rating <= 3;

  const { subject, html } = feedbackResponseEmail({
    businessName,
    customerName,
    rating,
    comment,
    isLowRating,
  });

  await sendEmail({ to: businessEmail, subject, html });

  const riskLevel = classifyReviewRisk(rating, comment);
  if (riskLevel === "high" && subscriptionTier === "pro" && alertPhoneNumber) {
    await sendCrisisAlertSms({
      to: alertPhoneNumber,
      businessName,
      reviewText: comment,
    });
  }
}
