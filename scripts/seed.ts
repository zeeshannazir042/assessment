import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import type { WorkOrder } from '@/types/work-order';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'work-orders.json');
const now = () => new Date().toISOString();

const sample: WorkOrder[] = [
  { id: randomUUID(), title: 'Replace air filter in Unit A', description: 'Replace HVAC air filter MERV 11.', priority: 'Medium', status: 'Open', updatedAt: now() },
  { id: randomUUID(), title: 'Inspect electrical panel', description: 'Check loose breakers; thermal scan.', priority: 'High', status: 'In Progress', updatedAt: now() },
  { id: randomUUID(), title: 'Touch-up wall paint in Lobby', description: 'Scuffs near elevator; match color.', priority: 'Low', status: 'Done', updatedAt: now() },
];

async function main() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(sample, null, 2), 'utf8');
  console.log(`Seeded ${sample.length} work orders -> ${DATA_FILE}`);
}
main().catch(e => { console.error(e); process.exit(1); });
