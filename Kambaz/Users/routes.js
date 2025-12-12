import UsersDao from "./dao.js";
// let currentUser = null; commenting so we can use session-based auth, and have multiple users signed in simultaneously
export default function UserRoutes(app) {
 const dao = UsersDao();
 
  const deleteUser = async (req, res) => {
      const status = await dao.deleteUser(req.params.userId);
      console.log(status);
      res.json(status);
  };

    const findAllUsers = async (req, res) => {
    const users = await dao.findAllUsers();
    const { role,name } = req.query;
    if (role) {
      const users = await dao.findUsersByRole(role);
      res.json(users);
      return;
    }
    if (name) {
      const users = await dao.findUsersByPartialName(name);
      res.json(users);
      return;
    }

    res.json(users);
  };
  
  const findUserById =  async (req, res) => {
    const user = await dao.findUserById(req.params.userId);
    res.json(user);
};
  const updateUser = async (req, res) => { 
    const userId = req.params.userId;
    const userUpdates = req.body;
    await dao.updateUser(userId, userUpdates);
    const currentUser = req.session["currentUser"];
   if (currentUser && currentUser._id === userId) {
     req.session["currentUser"] = { ...currentUser, ...userUpdates };
   }
    res.json(currentUser);

  };
  const signin = async (req, res) => { 
    const { username, password } = req.body;
    const currentUser = await dao.findUserByCredentials(username, password);
    if (currentUser) {
        req.session["currentUser"] = currentUser; // Store user in session
        res.json(currentUser);// Return user data
    } else {
        console.log(currentUser)
        res.status(401).json({ message: "Unable to login. Try again later." });
    }
    
  };
  const signup = async (req, res) => {
    const user = await dao.findUserByUsername(req.body.username);
    if (user) {
      res.status(400).json(
        { message: "Username already in use" });
      return;
    }
    const currentUser = await dao.createUser(req.body);
    req.session["currentUser"] = currentUser;
   };
  const signout = (req, res) => { 
    // currentUser = null;
    req.session.destroy(); // Destroy the session
    res.sendStatus(200);
  };
  const profile = (req, res) => { 
     const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      console.log(currentUser);
      return;
    }


    res.json(currentUser);
  };
  const createUser = async (req, res) => {
    const user = await dao.createUser(req.body);
    res.json(user);
  };

  app.post("/api/users", createUser);
  app.get("/api/users", findAllUsers);
  app.get("/api/users/:userId", findUserById);
  app.put("/api/users/:userId", updateUser);
  app.delete("/api/users/:userId", deleteUser);
  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.post("/api/users/profile", profile);

}
