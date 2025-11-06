import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import type { WorkOrder } from '@/types/work-order';

const DATA_FILE = process.env.WO_DATA_FILE || path.join(process.cwd(), 'data', 'work-orders.json');

async function ensureStore() {
  const dir = path.dirname(DATA_FILE);
  try {
    await fs.mkdir(dir, { recursive: true });
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, '[]', 'utf8');
  }
}

async function readAll(): Promise<WorkOrder[]> {
  await ensureStore();
  const raw = await fs.readFile(DATA_FILE, 'utf8');
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as WorkOrder[]) : [];
  } catch {
    await fs.writeFile(DATA_FILE, '[]', 'utf8');
    return [];
  }
}

async function writeAll(items: WorkOrder[]) {
  await ensureStore();
  const tmp = DATA_FILE + '.tmp';
  await fs.writeFile(tmp, JSON.stringify(items, null, 2), 'utf8');
  await fs.rename(tmp, DATA_FILE);
}

export async function listWorkOrders(params?: { status?: WorkOrder['status']; q?: string }) {
  const all = await readAll();
  let filtered = all;
  if (params?.status) filtered = filtered.filter(w => w.status === params.status);
  if (params?.q) {
    const q = params.q.toLowerCase();
    filtered = filtered.filter(w => w.title.toLowerCase().includes(q));
  }
  filtered.sort((a, b) => (b.updatedAt > a.updatedAt ? 1 : -1));
  return filtered;
}

export async function getWorkOrder(id: string) {
  const all = await readAll();
  return all.find(w => w.id === id) ?? null;
}

export async function createWorkOrder(input: Omit<WorkOrder, 'id' | 'updatedAt' | 'status'> & Partial<Pick<WorkOrder, 'status'>>) {
  const now = new Date().toISOString();
  const item: WorkOrder = {
    id: randomUUID(),
    title: input.title,
    description: input.description ?? '',
    priority: input.priority,
    status: input.status ?? 'Open',
    updatedAt: now,
  };
  const all = await readAll();
  all.push(item);
  await writeAll(all);
  return item;
}

export async function updateWorkOrder(id: string, input: Omit<WorkOrder, 'id' | 'updatedAt'>) {
  const all = await readAll();
  const idx = all.findIndex(w => w.id === id);
  if (idx === -1) return null;

  const now = new Date().toISOString();
  const updated: WorkOrder = { ...all[idx], ...input, updatedAt: now };
  all[idx] = updated;
  await writeAll(all);
  return updated;
}

export async function deleteWorkOrder(id: string) {
  const all = await readAll();
  const next = all.filter(w => w.id !== id);
  if (next.length === all.length) return false;
  await writeAll(next);
  return true;
}
