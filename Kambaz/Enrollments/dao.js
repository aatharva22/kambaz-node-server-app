import { v4 as uuidv4 } from "uuid";

export default function EnrollmentsDao(db) {
  function findEnrollmentsByUser(userId) {
    const { enrollments } = db;
    return enrollments.filter((e) => e.user === userId);
  }
  function enrollUserInCourse(userId, courseId) {
    const { enrollments } = db;
    enrollments.push({ _id: uuidv4(), user: userId, course: courseId });
  }

  function enroll(userId, courseId) {
    const newEnrollment = {
      _id: uuidv4(),
      user: userId,
      course: courseId,
    };

    db.enrollments = [...db.enrollments, newEnrollment];
    return newEnrollment;
  }

  function unEnroll(userId, courseId) {
    const { enrollments } = db;

    db.enrollments = enrollments.filter(
      (e) => !(e.user === userId && e.course === courseId)
    );

    return { status: "unenrolled" };
  }

  return {
    findEnrollmentsByUser,
    enroll,
    unEnroll,
    enrollUserInCourse,
  };
}
