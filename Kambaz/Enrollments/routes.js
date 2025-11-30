import EnrollmentsDao from "./dao.js";

export default function EnrollmentsRoutes(app, db) {
  const dao = EnrollmentsDao(db);

  // GET all enrollments for a given user
  app.get("/api/users/:userId/enrollments", (req, res) => {
    const { userId } = req.params;
    const enrollments = dao.findEnrollmentsByUser(userId);
    res.json(enrollments);
  });

  // POST: enroll user in a course
  app.post("/api/users/:userId/enrollments/:courseId", (req, res) => {
    const { userId, courseId } = req.params;
    const newEnrollment = dao.enroll(userId, courseId);
    res.json(newEnrollment);
  });

  // DELETE: un-enroll user from a course
  app.delete("/api/users/:userId/enrollments/:courseId", (req, res) => {
    const { userId, courseId } = req.params;
    const status = dao.unEnroll(userId, courseId);
    res.json(status);
  });
}
