const User = require('../models/users.js');
exports.createUser = async (req, res) => {
  try {
    const { username, password, status } = req.body;
    let user = { username, password, status };

    // Check if an image was uploaded
    if (req.body.image) {
      const imageData = req.body.image;
      const imageName = `${username}_${Date.now()}.jpg`; // Generate a unique name for the image
      const imagePath = path.join(__dirname, '../client/publuc/img', imageName); // Path to save the image

      // Write the image data to the file
      await writeFileAsync(imagePath, imageData, 'base64');
      
      // Attach the image path to the user object
      user.imagePath = imagePath;
    }

    // Save the user object to the database
    user = await User.create(user);
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password,status } = req.body;
    await User.update({ username, password,status }, { where: { id } });
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.destroy({ where: { id } });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
