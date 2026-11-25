/**
 * The single server endpoint for AI. All the rules live in lib/server/handler.ts.
 *
 * GET  /api/ai/   is this access code good, and how much allowance is left?
 * POST /api/ai/   one AI request
 *
 * The access code travels in a request header, never in the address.
 */

import { handleAi, handleCheck } from "@/lib/server/handler";

// Always run on the server at request time. Never cached, never pre-built.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export function GET(request: Request): Promise<Response> {
  return handleCheck(request);
}

export function POST(request: Request): Promise<Response> {
  return handleAi(request);
}
