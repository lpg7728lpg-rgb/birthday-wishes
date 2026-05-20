import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "src", "data", "db.json");

// Ensure the data directory exists
const ensureDirExists = () => {
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

export async function GET() {
  try {
    ensureDirExists();
    if (!fs.existsSync(dbPath)) {
      return NextResponse.json({ error: "Database file not found" }, { status: 404 });
    }
    const fileContent = fs.readFileSync(dbPath, "utf8");
    const data = JSON.parse(fileContent);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Database read error:", error);
    return NextResponse.json({ error: "Failed to read database: " + error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    ensureDirExists();
    const body = await request.json();
    
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid data structure" }, { status: 400 });
    }
    
    // Write pretty-formatted JSON to the database file
    fs.writeFileSync(dbPath, JSON.stringify(body, null, 2), "utf8");
    
    return NextResponse.json({ success: true, message: "Database saved successfully" });
  } catch (error: any) {
    console.error("Database write error:", error);
    return NextResponse.json({ error: "Failed to save database: " + error.message }, { status: 500 });
  }
}
