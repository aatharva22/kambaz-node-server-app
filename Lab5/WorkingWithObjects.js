const assignment = {
  id: 1, title: "NodeJS Assignment",
  description: "Create a NodeJS server with ExpressJS",
  due: "2021-10-10", completed: false, score: 0,
};
const module = {
    id: "1", name: "NodeJS Module",
    description: "Learn NodeJS and ExpressJS",
    course: "Backend Development",
}
export default function WorkingWithObjects(app) {
    
    const getAssignment = (req, res) => {
        res.json(assignment);   
    }
    app.get('/lab5/assignment', getAssignment);
    const getAssignmentTitle = (req, res) => {
        res.send(assignment.title);   
        console.log(assignment)
    }
    app.get('/lab5/assignment/title', getAssignmentTitle);

    const updateAssignmentTitle = (req, res) => {
        assignment.title = req.params.title;
        res.send(assignment.title);
        console.log(assignment)
    }
    app.get('/lab5/assignment/title/:title', updateAssignmentTitle);

    const updateCompletedStatus = (req, res) => {
        assignment.completed = req.params.status;
        res.send(assignment.completed);
        console.log(assignment)
    }
    app.get('/lab5/assignment/completed/:status', updateCompletedStatus);

    const updateScore = (req, res) => {
        assignment.score = parseInt(req.params.score);
        res.send(assignment.score.toString());
        console.log(assignment)
    }
    app.get('/lab5/assignment/score/:score', updateScore);

    const getModule = (req, res) => {
        res.json(module);   
    }
    app.get('/lab5/module', getModule);

    const getModuleName = (req, res) => {
        res.send(module.name);   
    }
    app.get('/lab5/module/name', getModuleName);
    
    const updateModuleName = (req, res) => {
        module.name = req.params.name;
        res.send(module.name);
    }
    app.get('/lab5/module/name/:name', updateModuleName);
}
