const encoder = new TextEncoder();

type DemoRequest = {
  submission_id: string;
  full_name: string;
  business_name: string;
  email: string;
  phone: string;
  business_type: string;
  team_size: number;
  message: string;
  website: string;
};

type StoredRequest = Omit<DemoRequest, "website"> & {
  id: string;
  status: "new" | "contacted" | "closed";
  notification_status: "pending" | "sent" | "failed";
};

const jsonHeaders = { "Content-Type": "application/json; charset=utf-8" };

function getAllowedOrigins(): string[] {
  return (Deno.env.get("ALLOWED_ORIGINS") ?? "")
    .split(",")
    .map((origin) => origin.trim().replace(/\/+$/, ""))
    .filter(Boolean);
}

function response(
  origin: string,
  allowedOrigins: string[],
  status: number,
  body: Record<string, unknown>,
): Response {
  const headers = new Headers(jsonHeaders);
  if (allowedOrigins.includes(origin)) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Vary", "Origin");
    headers.set("Access-Control-Allow-Headers", "authorization, x-client-info, apikey, content-type");
    headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    headers.set("Access-Control-Max-Age", "86400");
  }
  return new Response(status === 204 ? null : JSON.stringify(body), { status, headers });
}

function validateRequest(value: unknown): DemoRequest | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const input = value as Record<string, unknown>;
  const textFields = [
    "submission_id", "full_name", "business_name", "email",
    "phone", "business_type", "message", "website",
  ];
  if (textFields.some((field) => typeof input[field] !== "string")) return null;
  if (!Number.isInteger(input.team_size)) return null;

  const request = input as DemoRequest;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    .test(request.submission_id)) return null;
  if (request.full_name.trim().length < 1 || request.full_name.length > 120) return null;
  if (request.business_name.trim().length < 1 || request.business_name.length > 160) return null;
  if (request.email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(request.email)) return null;
  if (request.phone.trim().length < 7 || request.phone.length > 32) return null;
  if (request.business_type.trim().length < 1 || request.business_type.length > 160) return null;
  if ((request.team_size as number) < 0 || (request.team_size as number) > 10000) return null;
  if (request.message.length > 3000 || request.website.length > 500) return null;

  return {
    ...request,
    full_name: request.full_name.trim(),
    business_name: request.business_name.trim(),
    email: request.email.trim().toLowerCase(),
    phone: request.phone.trim(),
    business_type: request.business_type.trim(),
    message: request.message.trim(),
  };
}

function matchesStoredRequest(stored: StoredRequest, input: Omit<DemoRequest, "website">): boolean {
  return stored.full_name === input.full_name &&
    stored.business_name === input.business_name &&
    stored.email === input.email &&
    stored.phone === input.phone &&
    stored.business_type === input.business_type &&
    stored.team_size === input.team_size &&
    stored.message === input.message;
}

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(value));
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function supabaseRequest(
  path: string,
  method: string,
  serviceKey: string,
  body?: unknown,
  prefer = "return=representation",
): Promise<Response> {
  const baseUrl = Deno.env.get("SUPABASE_URL");
  if (!baseUrl) throw new Error("Missing SUPABASE_URL");
  return await fetch(`${baseUrl.replace(/\/+$/, "")}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      Prefer: prefer,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

async function notifyAdmin(
  request: DemoRequest,
  resendApiKey: string,
  adminEmail: string,
  sender: string,
): Promise<boolean> {
  const message = [
    "A new Nut Ledger demo request was submitted.",
    "",
    `Name: ${request.full_name}`,
    `Business: ${request.business_name}`,
    `Email: ${request.email}`,
    `Phone / WhatsApp: ${request.phone}`,
    `Business type: ${request.business_type}`,
    `Secretaries / workers: ${request.team_size}`,
    "",
    "Message:",
    request.message || "(No message provided)",
    "",
    `Submission ID: ${request.submission_id}`,
  ].join("\n");

  try {
    const result = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: sender,
        to: [adminEmail],
        reply_to: request.email,
        subject: "New Nut Ledger demo request",
        text: message,
      }),
    });
    if (!result.ok) {
      console.error("Administrator email provider returned status", result.status);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Administrator email request failed", error);
    return false;
  }
}

Deno.serve(async (request) => {
  const origin = (request.headers.get("Origin") ?? "").replace(/\/+$/, "");
  const allowedOrigins = getAllowedOrigins();

  if (!allowedOrigins.includes(origin)) {
    return response(origin, allowedOrigins, 403, { error: "Origin is not allowed." });
  }
  if (request.method === "OPTIONS") {
    return response(origin, allowedOrigins, 204, {});
  }
  if (request.method !== "POST") {
    return response(origin, allowedOrigins, 405, { error: "Method not allowed." });
  }
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return response(origin, allowedOrigins, 415, { error: "Content-Type must be application/json." });
  }

  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const rateLimitSecret = Deno.env.get("RATE_LIMIT_SECRET");
  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  const adminEmail = Deno.env.get("ADMIN_NOTIFICATION_EMAIL") ?? "amwahid005@gmail.com";
  const sender = Deno.env.get("RESEND_FROM_EMAIL");
  if (!serviceKey || !rateLimitSecret || !resendApiKey || !sender) {
    console.error("Demo request function is missing required server configuration.");
    return response(origin, allowedOrigins, 503, { error: "Demo requests are not configured." });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return response(origin, allowedOrigins, 400, { error: "Invalid JSON request." });
  }
  const demoRequest = validateRequest(body);
  if (!demoRequest) {
    return response(origin, allowedOrigins, 400, { error: "Please check the submitted details." });
  }

  if (demoRequest.website) {
    return response(origin, allowedOrigins, 200, { saved: true, notified: true });
  }

  const clientIp = request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (!clientIp) {
    return response(origin, allowedOrigins, 400, { error: "Unable to validate this request." });
  }

  try {
    const ipHash = await sha256Hex(`${rateLimitSecret}:${clientIp}`);
    const rateLimitResponse = await supabaseRequest(
      "rpc/consume_demo_request_rate_limit",
      "POST",
      serviceKey,
      { p_ip_hash: ipHash, p_limit: 5, p_window_seconds: 900 },
    );
    if (!rateLimitResponse.ok) {
      console.error("Demo request rate limit check failed with status", rateLimitResponse.status);
      return response(origin, allowedOrigins, 503, { error: "Demo requests are temporarily unavailable." });
    }
    if (await rateLimitResponse.json() !== true) {
      return response(origin, allowedOrigins, 429, { error: "Please wait before submitting another request." });
    }

    const { website: _website, ...storedInput } = demoRequest;
    const insertResponse = await supabaseRequest(
      "demo_requests?on_conflict=submission_id",
      "POST",
      serviceKey,
      storedInput,
      "resolution=ignore-duplicates,return=representation",
    );
    if (!insertResponse.ok) {
      console.error("Demo request storage failed with status", insertResponse.status);
      return response(origin, allowedOrigins, 503, { error: "The request could not be saved." });
    }

    let rows = await insertResponse.json() as StoredRequest[];
    let stored = rows[0];
    if (!stored) {
      const existingResponse = await supabaseRequest(
        `demo_requests?submission_id=eq.${encodeURIComponent(demoRequest.submission_id)}&select=*`,
        "GET",
        serviceKey,
      );
      if (!existingResponse.ok) {
        console.error("Idempotent demo request lookup failed with status", existingResponse.status);
        return response(origin, allowedOrigins, 503, { error: "The request could not be confirmed." });
      }
      rows = await existingResponse.json() as StoredRequest[];
      stored = rows[0];
      if (!stored || !matchesStoredRequest(stored, storedInput)) {
        return response(origin, allowedOrigins, 409, { error: "This request could not be confirmed." });
      }
      if (stored.notification_status === "sent") {
        return response(origin, allowedOrigins, 200, { saved: true, notified: true });
      }
    }

    const notified = await notifyAdmin(demoRequest, resendApiKey, adminEmail, sender);
    const notificationUpdate = await supabaseRequest(
      `demo_requests?id=eq.${encodeURIComponent(stored.id)}`,
      "PATCH",
      serviceKey,
      { notification_status: notified ? "sent" : "failed" },
    );
    if (!notificationUpdate.ok) {
      console.error("Demo request notification status update failed with status", notificationUpdate.status);
    }

    return response(
      origin,
      allowedOrigins,
      notified ? 200 : 502,
      { saved: true, notified },
    );
  } catch (error) {
    console.error("Demo request processing failed", error);
    return response(origin, allowedOrigins, 503, { error: "Demo requests are temporarily unavailable." });
  }
});
