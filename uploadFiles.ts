import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import FormData from 'form-data';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const UPLOAD_URL = 'https://api.salsa.dev/api/rest/supportability/transmissionObligation/action/upload';
const METADATA = {
    name: "PROCESS_SANCTIONS_FILE",
    parameters: {},
    dryRun: false,
    executedBy: "Rafael"
};
const AUTH_TOKEN = process.env.AUTH_TOKEN;

if (!AUTH_TOKEN) {
    console.error("Please set AUTH_TOKEN environment variable");
    process.exit(1);
}

// Get command line arguments with default values
const filePrefix = process.argv[2] || 'input';
const fileExtension = process.argv[3] || 'csv';
const dryRun = process.argv[4] === '--dry-run';
const directoryPath = './output';

const files = fs.readdirSync(directoryPath).filter(file =>
    file.startsWith(filePrefix + "_") && file.endsWith("." + fileExtension)
);

if (files.length === 0) {
    console.log("No split files found.");
    process.exit(1);
}

// Function to upload a file
const uploadFile = async (filePath: string) => {
    if (dryRun) {
        const curlCommand = `curl -v -X POST ${UPLOAD_URL} \
 -H "Content-Type: multipart/form-data" \
 -H "Authorization: Bearer ${AUTH_TOKEN}" \
 -F 'input=${JSON.stringify(METADATA)}' \
 -F "file=@${filePath}"`;
        console.log("");
        console.log(`${curlCommand}`);
        return;
    }

    try {
        const formData = new FormData();
        formData.append('input', JSON.stringify(METADATA));
        formData.append('file', fs.createReadStream(filePath));

        const response = await axios.post(UPLOAD_URL, formData, {
            headers: {
                ...formData.getHeaders(),
                'Authorization': `Bearer ${AUTH_TOKEN}`,
            },
        });

        console.log(`Uploaded ${path.basename(filePath)} successfully:`, response.data, "\n");
    } catch (error: any) {
        if (error.response) {
            console.error(`Error uploading ${path.basename(filePath)}:`, {
                status: error.response.status,
                data: error.response.data
            });
        } else {
            console.error(`Error uploading ${path.basename(filePath)}:`, error.message);
        }
    }
};

// Upload each split file
(async () => {
    console.log("dryRun: ", dryRun);
    for (const file of files) {
        await uploadFile(path.join(directoryPath, file));
    }
    console.log("All files uploaded.");
})();
