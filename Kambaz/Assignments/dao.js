import { v4 as uuidv4 } from "uuid";

export default function AssignmentsDao(db) {
  function findAssignmentsForCourse(courseId) {
    const { assignments } = db;
    return assignments.filter((a) => a.course === courseId);
  }

  function findAssignmentById(assignmentId) {
    const { assignments } = db;
    return assignments.find((a) => a._id === assignmentId);
  }

  function createAssignment(assignment) {
    const newAssignment = { ...assignment, _id: uuidv4(), editing: false };
    db.assignments = [...db.assignments, newAssignment];
    return newAssignment;
  }

  function deleteAssignment(assignmentId) {
    const { assignments } = db;
    db.assignments = assignments.filter((a) => a._id !== assignmentId);
    return { status: "deleted" };
  }

  function updateAssignment(assignmentId, updates) {
    const { assignments } = db;
    const assignment = assignments.find((a) => a._id === assignmentId);
    Object.assign(assignment, updates);
    return assignment;
  }

  return {
    findAssignmentsForCourse,
    findAssignmentById,
    createAssignment,
    deleteAssignment,
    updateAssignment,
  };
}
