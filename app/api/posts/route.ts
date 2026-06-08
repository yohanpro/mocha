import { NextRequest, NextResponse } from "next/server";
import { getPosts, PAGE_SIZE } from "@/src/entities/post/api";

export async function GET(request: NextRequest) {
  const cursor = request.nextUrl.searchParams.get("cursor") ?? undefined;

  const posts = await getPosts({ cursor, limit: PAGE_SIZE });
  const hasMore = posts.length === PAGE_SIZE;

  return NextResponse.json({ posts, hasMore });
}
