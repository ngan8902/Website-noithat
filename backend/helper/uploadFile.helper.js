const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFREHS_TOKENS;

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({ version: 'v3', auth: oAuth2Client });

class UploadFileHelper {

    static async setFilePublic(fileId) {
        await drive.permissions.create({
            fileId,
            requestBody: { role: 'reader', type: 'anyone' }
        });

        const result = await drive.files.get({
            fileId,
            fields: 'webViewLink, webContentLink'
        });

        return result.data;
    }

    static async uploadFile(imagePath, { imgName = 'image.jpg', shared = true }) {
        const fileMeta = {
            name: imgName,
        };

        const media = {
            mimeType: 'image/jpeg',
            body: fs.createReadStream(imagePath),
        };

        const file = await drive.files.create({
            requestBody: fileMeta,
            media,
        });

        console.log('✅ File uploaded:', file.data);

        if (shared) {
            const publicLink = await UploadFileHelper.setFilePublic(file.data.id);
            console.log('🌍 Public link:', publicLink);
            return publicLink;
        }

        return file.data;
    }
}

module.exports = UploadFileHelper;
