import { promises as fs } from 'fs';
import path from 'path';

const homepagePath = path.join(process.cwd(), 'data', 'homepage.json');

export async function GET(req) {
  try {
    const data = await fs.readFile(homepagePath, 'utf-8');
    return new Response(data, { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to load homepage data.' }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    await fs.writeFile(homepagePath, JSON.stringify(body, null, 2), 'utf-8');
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to save homepage data.' }), { status: 500 });
  }
} 