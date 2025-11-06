import { NextRequest, NextResponse } from 'next/server';
import { listWorkOrders, createWorkOrder } from '@/lib/data/workOrders';
import { createWorkOrderSchema, zodErrorToFieldMap } from '@/lib/validation/workOrder';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const statusParam = searchParams.get("status") ?? undefined;
  const query = searchParams.get("q") ?? undefined;

  const status = statusParam as "Open" | "In Progress" | "Done" | undefined;

  let data = await listWorkOrders({ status });

  if (query) {
    const lowerQuery = query.toLowerCase();
    data = data.filter((w) => w.title.toLowerCase().includes(lowerQuery));
  }

  return NextResponse.json(data, { status: 200 });
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = createWorkOrderSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', fields: zodErrorToFieldMap(parsed.error) },
        { status: 400 }
      );
    }
    const created = await createWorkOrder(parsed.data);
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }
}
