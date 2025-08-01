export enum UserRole {
  STUDENT = "Student",
  STUDENT_LEADER = "Student Leader",
  FACULTY = "Faculty",
  INSTITUTION_ADMIN = "Institution Admin",
  OY_ADMIN = "OY Admin",
  PENDING = "Pending",
}

export const USER_ROLES = [
  UserRole.STUDENT,
  UserRole.STUDENT_LEADER,
  UserRole.FACULTY,
  UserRole.INSTITUTION_ADMIN,
  UserRole.OY_ADMIN,
  UserRole.PENDING,
] as const;
