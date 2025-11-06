import { NextRequest, NextResponse } from 'next/server';
import { getWorkOrder, updateWorkOrder, deleteWorkOrder } from '@/lib/data/workOrders';
import { updateWorkOrderSchema, zodErrorToFieldMap } from '@/lib/validation/workOrder';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function cleanId(raw: string) {
  let id = decodeURIComponent(raw.trim());
  if ((id.startsWith('"') && id.endsWith('"')) || (id.startsWith("'") && id.endsWith("'"))) {
    id = id.slice(1, -1);
  }
  return id;
}

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params;
  console.log('id', id);
  const item = await getWorkOrder(id);
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params;
  console.log('id', id);
  try {
    const json = await req.json();
    const parsed = updateWorkOrderSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', fields: zodErrorToFieldMap(parsed.error) },
        { status: 400 }
      );
    }
    const updated = await updateWorkOrder(id, parsed.data);
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(updated, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params;
  console.log('id', id);
  const ok = await deleteWorkOrder(id);
  if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return new NextResponse(null, { status: 204 });
}
