import HttpError = require("../errors");

// Returns the text of a query parameter, or undefined if it is missing or empty.
const getString = (value: unknown): string | undefined => {
  if (typeof value === "string" && value.trim() !== "") return value.trim();
  return undefined;
};

// Turns a query parameter like "1958" into the number 1958.
// Sends a 400 error if it is not a whole number.
const getInt = (value: unknown, name: string): number | undefined => {
  const text = getString(value);
  if (text === undefined) return undefined;
  if (!/^-?\d+$/.test(text)) throw HttpError.badRequest(`${name} must be a whole number`);
  return Number(text);
};

// Reads the :id from the URL (for example /books/5 gives 5).
// Sends a 400 error if it is not a positive whole number.
const parseId = (value: unknown): number => {
  if (typeof value !== "string" || !/^\d+$/.test(value) || Number(value) < 1)
    throw HttpError.badRequest("id must be a positive whole number");
  return Number(value);
};

// True if the text contains the search word (ignores upper/lower case).
const contains = (text: string | undefined, search: string): boolean =>
  (text ?? "").toLowerCase().includes(search.toLowerCase());

// ?sort=year sorts smallest to largest. ?sort=-year reverses it.
const sortItems = <T>(items: T[], sort: string | undefined, allowedFields: string[]): T[] => {
  if (!sort) return items;

  const descending = sort.startsWith("-");
  const field = descending ? sort.slice(1) : sort;
  if (!allowedFields.includes(field))
    throw HttpError.badRequest(`sort must be one of: ${allowedFields.join(", ")} (add - for descending)`);

  return [...items].sort((a: any, b: any) => {
    const first = a[field];
    const second = b[field];
    if (first === undefined && second === undefined) return 0;
    if (first === undefined) return 1; // items without the field go last
    if (second === undefined) return -1;
    const result = typeof first === "string" ? first.localeCompare(second) : first - second;
    return descending ? -result : result;
  });
};

// ?page=2&limit=5 returns items 6 to 10, plus totals.
const paginate = <T>(items: T[], query: Record<string, unknown>) => {
  const page = getInt(query.page, "page") ?? 1;
  const limit = getInt(query.limit, "limit") ?? 10;
  if (page < 1) throw HttpError.badRequest("page must be 1 or more");
  if (limit < 1 || limit > 100) throw HttpError.badRequest("limit must be between 1 and 100");

  const start = (page - 1) * limit;
  return {
    data: items.slice(start, start + limit),
    meta: {
      total: items.length,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(items.length / limit)),
    },
  };
};

// Sort first, then take one page of the result.
const sortAndPaginate = <T>(items: T[], query: Record<string, unknown>, allowedFields: string[]) => {
  const sorted = sortItems(items, getString(query.sort), allowedFields);
  return paginate(sorted, query);
};

export = { getString, getInt, parseId, contains, sortAndPaginate };