import ky from 'ky';

const { CLOUDFLARE_D1_TOKEN, CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_D1_DATABASE_ID } = process.env;

const D1_API_BASE_URL = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/d1/database/${CLOUDFLARE_D1_DATABASE_ID}`;

// Define proper interfaces for the API responses
interface D1QueryResultItem {
  [key: string]: string | number | boolean | null;
}

interface D1QueryResult {
  success: boolean;
  results: D1QueryResultItem[];
  meta?: unknown;
}

interface D1ApiResponse {
  success: boolean;
  errors: string[];
  messages: string[];
  result: D1QueryResult[];
}

// Acceptable parameter types for D1 queries
type SqlParam = string | number | boolean | null | undefined;

const d1HttpClient = ky.create({
  prefixUrl: D1_API_BASE_URL,
  headers: {
    Authorization: `Bearer ${CLOUDFLARE_D1_TOKEN}`,
  },
});

export const d1HttpDriver = async (sql: string, params: SqlParam[], method: string) => {
  const res = await d1HttpClient.post('query', {
    json: { sql, params, method },
  });

  const data = (await res.json()) as D1ApiResponse;

  if (data.errors.length > 0 || !data.success) {
    throw new Error(`Error from sqlite proxy server: \n${JSON.stringify(data)}}`);
  }

  const qResult = data.result[0];

  if (!qResult.success) {
    throw new Error(`Error from sqlite proxy server: \n${JSON.stringify(data)}`);
  }

  // https://orm.drizzle.team/docs/get-started-sqlite#http-proxy
  return { rows: qResult.results.map((r) => Object.values(r)) };
};
