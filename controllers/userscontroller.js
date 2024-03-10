import User from '../models/users.js';
export const createUser = async (req, res) => {
    try {
      const { username, email } = req.body;
      const user = await User.create({ username, email });
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
export const getUsers = async (req, res) => {
    try {
      const users = await User.findAll();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
export const updateUser = async (req, res) => {
    try {
      const { id } = req.params;
      const { username, email } = req.body;
      await User.update({ username, email }, { where: { id } });
      res.json({ message: 'User updated successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
export const  deleteUser = async (req, res) => {
    try {
      const { id } = req.params;
      await User.destroy({ where: { id } });
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

