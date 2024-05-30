import { fileContent } from './fileutils';
export async function printFile(filepath) {
    try {
        const content = await fileContent(filepath);
        if (content.length > 0) {
            console.log(content);
        }
        else {
            console.error('Error reading file');
        }
    }
    catch (err) {
        // console.error('Error: ' + err.message);
        if (err instanceof Error) {
            console.error('Error: ' + err.message);
        }
        else {
            console.error('Unknown error occurred');
        }
    }
}
