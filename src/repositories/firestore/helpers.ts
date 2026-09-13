import { DocumentSnapshot, Timestamp } from 'firebase/firestore';

/**
 * Loại bỏ các thuộc tính có giá trị undefined trong object
 * vì Firebase Firestore ném lỗi nếu object chứa undefined
 */
export function cleanUndefined<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined) {
      continue;
    }
    if (value !== null && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Timestamp) && !(value instanceof Date)) {
      result[key] = cleanUndefined(value as Record<string, unknown>);
    } else {
      result[key] = value;
    }
  }

  return result as Partial<T>;
}

/**
 * Chuyển đổi Firestore document snapshot sang entity
 */
export function docToEntity<T>(doc: DocumentSnapshot): T | null {
  if (!doc.exists()) return null;
  const data = doc.data();
  if (!data) return null;

  return {
    id: doc.id,
    ...data,
  } as T;
}

/**
 * Chuyển đổi an toàn giá trị date/timestamp sang ISO string
 */
export function toIsoString(val: unknown): string {
  if (!val) return new Date().toISOString();
  if (val instanceof Timestamp) return val.toDate().toISOString();
  if (val instanceof Date) return val.toISOString();
  if (typeof val === 'string') return val;
  return String(val);
}
