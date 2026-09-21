import HttpError = require("../errors");

// Settings for pagination
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

// Returns the value as text, or undefined if it is missing or empty.
function getText(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim() !== "") {
    return value.trim();
  }
  return undefined;
}

// Turns "1958" into the number 1958. Sends a 400 error if it is not a whole number.
function toNumber(value: unknown, name: string): number | undefined {
  const text = getText(value);
  if (text === undefined) return undefined;

  const number = Number(text);
  if (!Number.isInteger(number)) {
    throw new HttpError(400, `${name} must be a whole number`);
  }
  return number;
}

// Reads the :id from the URL (/books/5 gives 5). Must be 1 or more.
function parseId(value: unknown): number {
  const id = toNumber(value, "id");
  if (id === undefined || id < 1) {
    throw new HttpError(400, "id must be a positive whole number");
  }
  return id;
}

// True if the text contains the search word (upper/lower case is ignored).
function contains(text: string, search: string): boolean {
  return text.toLowerCase().includes(search.toLowerCase());
}

// ?sort=year sorts smallest to largest. ?sort=-year reverses it.
function sortItems(items: any[], sort: unknown, allowedFields: string[]): any[] {
  const text = getText(sort);
  if (text === undefined) return items;

  const descending = text.startsWith("-");
  const field = descending ? text.slice(1) : text;
  if (!allowedFields.includes(field)) {
    throw new HttpError(400, `sort must be one of: ${allowedFields.join(", ")}`);
  }

  const sorted = [...items].sort((a, b) => {
    if (typeof a[field] === "string") return a[field].localeCompare(b[field]);
    return (a[field] ?? 0) - (b[field] ?? 0); // a missing number counts as 0
  });
  return descending ? sorted.reverse() : sorted;
}

// ?page=2&limit=5 returns items 6 to 10, plus the totals.
function paginate(items: any[], pageValue: unknown, limitValue: unknown) {
  const page = toNumber(pageValue, "page") ?? 1;
  const limit = toNumber(limitValue, "limit") ?? DEFAULT_LIMIT;
  if (page < 1) throw new HttpError(400, "page must be 1 or more");
  if (limit < 1 || limit > MAX_LIMIT) {
    throw new HttpError(400, `limit must be between 1 and ${MAX_LIMIT}`);
  }

  const start = (page - 1) * limit;
  return {
    page,
    limit,
    total: items.length,
    totalPages: Math.max(1, Math.ceil(items.length / limit)),
    data: items.slice(start, start + limit),
  };
}

export = { getText, toNumber, parseId, contains, sortItems, paginate };
