const express = require('express');
const router = express.Router();
const axios = require('axios');


router.get('/drive-image/:id', async (req, res) => {
    const { id } = req.params;
    const imageUrl = `https://drive.google.com/thumbnail?id=${id}`;

    try {
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });

        res.setHeader('Content-Type', response.headers['content-type']);
        res.send(response.data);
    } catch (error) {
        console.error('Error fetching image:', error.response?.status, error.message);
        res.status(500).json({ message: 'Không thể tải ảnh từ Google Drive' });
    }
});

module.exports = router;
