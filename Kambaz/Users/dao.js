
import model from "./model.js";
export default function UsersDao() {
 const createUser = (user) => {} // implemented later
  const findAllUsers = () => model.find();
  const findUserById = (userId) => model.findById(userId);
  const findUserByUsername = (username) =>  model.findOne({ username: username });
  const findUserByCredentials = (username, password) =>  model.findOne({ username, password });
  const updateUser = (userId, user) =>  model.updateOne({ _id: userId }, { $set: user });
  const deleteUser = (userId) => model.deleteOne({ _id: userId });

 return {
    createUser, findAllUsers, findUserById, findUserByUsername, findUserByCredentials, updateUser, deleteUser };
}
