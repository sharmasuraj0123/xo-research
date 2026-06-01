import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

type Commit = {
  sha: string;
  shortSha: string;
  author: string;
  date: string;
  subject: string;
};

export const runtime = "nodejs";

export async function GET() {
  try {
    const { stdout } = await execFileAsync("git", [
      "log",
      "-n",
      "30",
      "--date=short",
      "--pretty=format:%H%x1f%h%x1f%an%x1f%ad%x1f%s",
    ]);

    const commits: Commit[] = stdout
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        const [sha, shortSha, author, date, subject] = line.split("\u001f");
        return { sha, shortSha, author, date, subject };
      });

    return Response.json({ commits });
  } catch {
    return Response.json({ commits: [] }, { status: 200 });
  }
}
