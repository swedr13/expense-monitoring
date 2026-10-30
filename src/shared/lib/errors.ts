/**
 * Maps database errors and the common auth/network failures to text you can
 * act on. Unknown errors fall back to a generic message.
 */
const messages: Record<string, string> = {
  forbidden: "You don't have permission to do that.",
  not_authenticated: "This device isn't connected yet. Reload and try again.",
};

const getRawMessage = (error: unknown): string => {
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in error) {
    const { message } = error as { message: unknown };
    if (typeof message === "string") return message;
  }
  return "";
};

export const getErrorMessage = (error: unknown): string => {
  const raw = getRawMessage(error).trim();

  if (messages[raw]) return messages[raw];
  if (/anonymous sign-ins are disabled/i.test(raw))
    return "Anonymous sign-ins are turned off for this project. Turn them on in Supabase Auth.";
  if (/captcha/i.test(raw)) return "Please complete the security check and try again.";
  if (/invalid schema|schema must be one of/i.test(raw))
    return "The expenses schema isn't exposed yet. Add it under Data API → Exposed schemas.";
  if (/permission denied|row-level security/i.test(raw)) return messages.forbidden;
  if (/violates check constraint/i.test(raw)) return "That amount or category isn't valid.";
  if (/failed to fetch|networkerror|network request failed/i.test(raw))
    return "Can't reach the server. Check your connection and try again.";

  return "Something went wrong. Please try again.";
};
