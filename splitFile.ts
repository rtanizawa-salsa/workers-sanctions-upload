import * as fs from 'fs';
import * as path from 'path';

const DEFAULT_LINES_PER_FILE = 1000;

// Get command-line arguments
const args = process.argv.slice(2);
if (args.length < 1) {
    console.error("Usage: node splitFile.js <inputFilePath> [linesPerFile]");
    process.exit(1);
}

const inputFilePath = args[0];
const linesPerFile = args[1] ? parseInt(args[1], 10) : DEFAULT_LINES_PER_FILE;

// Extract filename and extension
const fileExt = path.extname(inputFilePath);
const fileName = path.basename(inputFilePath, fileExt);

if (isNaN(linesPerFile) || linesPerFile <= 0) {
    console.error("Invalid number of lines per file. It must be a positive integer.");
    process.exit(1);
}

const outputDirectory = path.join(process.cwd(), 'output');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory);
}

try {
    const fileContent = fs.readFileSync(inputFilePath, 'utf-8');
    const lines = fileContent.split(/\r?\n/);
    const totalLines = lines.length;
    
    // Extract header from the first line
    const header = lines[0];
    // Remove header from lines array to avoid duplicating it in first chunk
    const dataLines = lines.slice(1);
    
    console.log(`Splitting ${inputFilePath} (${totalLines} lines) into chunks of ${linesPerFile} lines...`);

    let fileIndex = 1;
    for (let i = 0; i < dataLines.length; i += linesPerFile) {
        const chunk = [
            header,  // Add header as first line
            ...dataLines.slice(i, i + linesPerFile)  // Add chunk of data lines
        ].join("\n");
        
        const outputFileName = `${fileName}_${fileIndex}${fileExt}`;
        const outputFilePath = path.join(outputDirectory, outputFileName);

        fs.writeFileSync(outputFilePath, chunk, 'utf-8');
        console.log(`Created: ${outputFileName}`);
        fileIndex++;
    }

    console.log("File splitting completed successfully.");
} catch (error) {
    console.error("Error processing the file:", error);
    process.exit(1);
}
