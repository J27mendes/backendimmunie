const fs = require("fs");
const path = require("path");
const { Storage } = require("@google-cloud/storage");
const { getCurrentDay, getOneYearLater } = require("./dateUtils");
const dotenv = require("dotenv");
dotenv.config();

let keyFilename;
if (process.env.NODE_ENV === "production") {
  keyFilename = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);
} else {
  keyFilename = path.join(
    __dirname,
    "../immuniedbcarteirinha-524fe8d59379.json"
  );
}
// Configura o cliente do Google Cloud Storage com as credenciais lidas
const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  credentials: keyFilename,
});

const bucketName = process.env.GCS_BUCKET_NAME;

async function uploadToGCS(filePath, mimetype) {
  const bucket = storage.bucket(bucketName);
  const fileName = `photo_${Date.now()}_${path.basename(filePath)}`;
  const file = bucket.file(fileName);

  await bucket.upload(filePath, {
    destination: file,
    metadata: {
      contentType: mimetype,
      metadata: {
        uploaded_at: getCurrentDay(),
        edited_at: getOneYearLater(),
      },
    },
  });

  const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;

  return {
    url: publicUrl,
    uploaded_at: getCurrentDay(),
    edited_at: getOneYearLater(),
  };
}

async function uploadBucketToGCS(file) {
  const current_day = getCurrentDay();
  const one_year_later = getOneYearLater();

  const bucket = storage.bucket(bucketName);
  const photoFilename = `photo_${Date.now()}_${path.basename(file.path)}`;
  const photoFile = bucket.file(photoFilename);

  await bucket.upload(file.path, {
    destination: photoFile,
    metadata: {
      contentType: file.mimetype,
      metadata: {
        uploaded_at: current_day,
        edited_at: one_year_later,
      },
    },
  });

  const publicUrl = `https://storage.googleapis.com/${bucketName}/${photoFilename}`;

  // Remove arquivo temporário após o upload para GCS
  fs.unlinkSync(file.path);

  return {
    url: publicUrl,
    uploaded_at: current_day,
    edited_at: one_year_later,
  };
}

module.exports = {
  uploadToGCS,
  uploadBucketToGCS,
};
