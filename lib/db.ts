import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) {
  console.warn("DATABASE_URL not set — database queries will fail at runtime");
}

const _sql = url ? neon(url) : null;

function sql(strings: TemplateStringsArray, ...values: unknown[]) {
  if (!_sql) throw new Error("DATABASE_URL is not set");
  return _sql(strings, ...values);
}

export { sql };
