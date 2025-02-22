# workers-sanctions-upload

This script split the workers sanctions file into multiple files and upload them via Supportability API.

## Setup

### 1. Install the dependencies:
```bash
npm install
```

### 2. Setup .env file with AUTH_TOKEN

## Usage

### 1. Split the workers sanctions file into multiple files:

```bash
npm run split
```

### 2. Upload the files to the Supportability API:

2.1. Dry run (only print the curl command):
```bash
npm run upload-dry-run
```

2.2. Real run (call the actual Supportability API):
```bash
npm run upload
```

## Notes

- The script will split the workers sanctions file into multiple files based on the number of workers in each file.
- The script will upload the files to the Supportability API.
- The script will log the response from the Supportability API.
