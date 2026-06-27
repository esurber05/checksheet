import type { SupabaseClient } from "@supabase/supabase-js";
import { parseStudentRecord } from "@/lib/schemas/student.ts";
import type { StudentRecord } from "@/lib/schemas/student.ts";

const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function generateStudentId(): string {
  let id = "U-";
  for (let i = 0; i < 6; i++) {
    id += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return id;
}

type Row = { student_id: string; record: unknown };

function parseRow(row: Row): StudentRecord & { studentId: string } {
  const record = parseStudentRecord(row.record);
  return { ...record, studentId: row.student_id };
}

/** Look up the current user's student record by auth user_id. */
export async function getStudentRecord(
  supabase: SupabaseClient,
  userId: string
): Promise<StudentRecord | null> {
  const { data, error } = await supabase
    .from("student_records")
    .select("student_id, record")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) return null;
  try {
    return parseRow(data as Row);
  } catch {
    return null;
  }
}

/** Look up a student record by studentId (URL param). Verifies user_id matches for security. */
export async function getStudentRecordById(
  supabase: SupabaseClient,
  studentId: string,
  userId: string
): Promise<StudentRecord | null> {
  const { data, error } = await supabase
    .from("student_records")
    .select("student_id, record")
    .eq("student_id", studentId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) return null;
  try {
    return parseRow(data as Row);
  } catch {
    return null;
  }
}

/** Insert a new student record. Returns the saved record with the generated studentId. */
export async function createStudentRecord(
  supabase: SupabaseClient,
  userId: string,
  record: StudentRecord
): Promise<StudentRecord> {
  const studentId = generateStudentId();
  const fullRecord = { ...record, studentId };

  const { error } = await supabase.from("student_records").insert({
    user_id: userId,
    student_id: studentId,
    record: fullRecord,
  });

  if (error) throw new Error(`Failed to create student record: ${error.message}`);
  return fullRecord;
}

/** Overwrite the record JSONB column for the current user. */
export async function updateStudentRecord(
  supabase: SupabaseClient,
  userId: string,
  record: StudentRecord
): Promise<void> {
  const { error } = await supabase
    .from("student_records")
    .update({ record, updated_at: new Date().toISOString() })
    .eq("user_id", userId);

  if (error) throw new Error(`Failed to update student record: ${error.message}`);
}

/**
 * Convenience helper for layouts: returns the current user's studentId string,
 * or an empty string if no record exists or the user is not authenticated.
 */
export async function getSessionStudentId(
  supabase: SupabaseClient
): Promise<string> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return "";

  const { data } = await supabase
    .from("student_records")
    .select("student_id")
    .eq("user_id", user.id)
    .maybeSingle();

  return (data as { student_id?: string } | null)?.student_id ?? "";
}
