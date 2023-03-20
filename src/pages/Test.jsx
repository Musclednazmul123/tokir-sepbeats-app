import React, { useState } from 'react';
import axios from 'axios';

const Test = () => {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("image", image);
    // Retrieve the access token
    const accessToken = 'shpua_e64ba9b70315e5bd6e689236b8d2c33c';

    // Set up the API endpoint
    const apiUrl = 'https://toqeermuscled.myshopify.com/admin/products/8152254742804/images.json';

    // Create a FormData object
    const formData = new FormData();
    formData.append('image', image);

    // Send the API request
    try {
      const response = await axios.post(apiUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-Shopify-Access-Token': accessToken,
        },
      });

      // Handle the response
      setImageUrl(response.data.image.src);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleImageChange} />
        <button type="submit">Upload</button>
      </form>
      {imageUrl && (
        <img src={imageUrl} alt="Uploaded image" style={{ width: '100%' }} />
      )}
    </div>
  );
};

export default Test;
