import HttpError = require("../errors");

const getString = (v: unknown): string | undefined =>
  typeof v === "string" && v.trim() !== "" ? v.trim() : undefined;

function getInt(v: unknown, name: string): number | undefined {
  const s = getString(v);
  if (s === undefined) return undefined;
  if (!/^-?\d+$/.test(s)) throw HttpError.badRequest(`${name} must be an integer`);
  return Number(s);
}

function parseId(raw: unknown, name = "id"): number {
  if (typeof raw !== "string" || !/^\d+$/.test(raw) || Number(raw) < 1)
    throw HttpError.badRequest(`${name} must be a positive integer`);
  return Number(raw);
}

const contains = (hay: string | undefined, needle: string) =>
  (hay ?? "").toLowerCase().includes(needle.toLowerCase());

// Sort (?sort=title or ?sort=-year) then paginate (?page=1&limit=10).
function sortAndPaginate<T>(
  items: T[],
  query: Record<string, unknown>,
  sortable: (keyof T & string)[]
) {
  const sortParam = getString(query.sort);
  const list = [...items];

  if (sortParam) {
    const desc = sortParam.startsWith("-");
    const field = (desc ? sortParam.slice(1) : sortParam) as keyof T & string;
    if (!sortable.includes(field))
      throw HttpError.badRequest(
        `sort must be one of: ${sortable.join(", ")} (prefix with - for descending)`
      );
    list.sort((a, b) => {
      const av = a[field] as any;
      const bv = b[field] as any;
      if (av === undefined && bv === undefined) return 0;
      if (av === undefined) return 1;
      if (bv === undefined) return -1;
      const cmp = typeof av === "string" ? av.localeCompare(bv) : av - bv;
      return desc ? -cmp : cmp;
    });
  }

  const page = getInt(query.page, "page") ?? 1;
  const limit = getInt(query.limit, "limit") ?? 10;
  if (page < 1) throw HttpError.badRequest("page must be >= 1");
  if (limit < 1 || limit > 100) throw HttpError.badRequest("limit must be between 1 and 100");

  const total = list.length;
  const data = list.slice((page - 1) * limit, page * limit);
  return { data, meta: { total, page, limit, totalPages: Math.max(1, Math.ceil(total / limit)) } };
}

export = { getString, getInt, parseId, contains, sortAndPaginate };
