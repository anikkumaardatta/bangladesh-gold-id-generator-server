const fs = require('fs').promises;

const deleteImage = async (customerImagePath) => {
  try {
    await fs.access(customerImagePath);
    await fs.unlink(customerImagePath);
    console.log('Customer image was deleted.');
  } catch (error) {
    console.error('Customer image does not exist!');
  }
};
module.exports = { deleteImage };
