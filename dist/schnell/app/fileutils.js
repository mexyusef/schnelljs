import * as fs from 'fs';
import * as path from 'path';
// import * as os from 'os';
// import * as fs from 'fs/promises';
// export async function fileContent(filepath: string): Promise<string> {
//     try {
//         const content = await fs.readFile(filepath, 'utf-8');
//         return content;
//     } catch (err) {
//         return '';
//     }
// }
export function fileContent(filepath) {
    try {
        const content = fs.readFileSync(filepath, 'utf-8');
        return content;
    }
    catch (err) {
        return '';
    }
}
function getEnvVariable(key, defaultValue = null) {
    return process.env[key] || defaultValue;
}
function normalizePath(pathStr) {
    return path.normalize(pathStr);
}
function getUlibpyEnvVars() {
    return Object.keys(process.env).filter(item => item.startsWith('ULIBPY'));
}
function replaceFilepathWithEnvVars(filepath, normalize = false) {
    const envVars = getUlibpyEnvVars();
    for (const envVar of envVars) {
        filepath = filepath.replace(envVar, getEnvVariable(envVar) || '');
    }
    return normalize ? normalizePath(filepath) : filepath;
}
function unpackPath(filePath, normalize = true, debug = false) {
    if (!filePath) {
        console.log(`filePath [${filePath}] is None. Returning...`);
        return filePath;
    }
    let unpackedPath = filePath.replace('__PWD', getEnvVariable('ULIBPY__PWD__', process.cwd()) || '');
    unpackedPath = path.resolve(unpackedPath);
    if (filePath === unpackedPath || filePath.includes('ULIBPY')) {
        unpackedPath = replaceFilepathWithEnvVars(unpackedPath);
    }
    if (normalize) {
        unpackedPath = normalizePath(unpackedPath);
    }
    if (debug) {
        console.log(JSON.stringify(process.env, null, 2));
    }
    return unpackedPath;
}
function isFile(filepath, doExpand = true, strip = false) {
    if (strip) {
        filepath = filepath.trim();
    }
    if (doExpand) {
        const isValidFile = unpackPath(filepath);
        return isValidFile !== null && fs.existsSync(isValidFile) && fs.lstatSync(isValidFile).isFile();
    }
    return fs.existsSync(filepath) && fs.lstatSync(filepath).isFile();
}
function getDefinitionLines(filepath, startRegex, endRegex) {
    const result = [];
    let collecting = false;
    try {
        const fileContent = fs.readFileSync(filepath, 'utf-8');
        const lines = fileContent.split(/\r?\n/);
        for (const line of lines) {
            if (collecting) {
                if (endRegex.test(line)) {
                    return result;
                }
                result.push(line);
            }
            else if (startRegex.test(line)) {
                collecting = true;
            }
        }
    }
    catch (err) {
        console.log(`Error in getDefinitionLines: ${err}`);
        console.log(`filepath: ${filepath}, startRegex: ${startRegex}, endRegex: ${endRegex}`);
    }
    return result;
}
function escapeRegexPattern(pattern) {
    const specialChars = /[\\+*()[\]{}?|<>$]/g;
    return pattern.replace(specialChars, '\\$&');
}
// function getDefinitionByKey(filepath: string, key: string, startPattern: string = '^--%', endPattern: string = '^--#', asList: boolean = false): string | string[] {
//     const escapedKey = escapeRegexPattern(key);
//     let startRegex = new RegExp(`${startPattern}\\s+${escapedKey}`);
//     let definitionLines = getDefinitionLines(filepath, startRegex, new RegExp(endPattern));
//     if (!definitionLines.length) {
//         startRegex = new RegExp(`${startPattern}\\s+(.*)${escapedKey}`);
//         definitionLines = getDefinitionLines(filepath, startRegex, new RegExp(endPattern));
//     }
//     if (asList) {
//         return definitionLines;
//     }
//     return definitionLines.join('');
// }
function getDefinitionByKey(filepath, key, startPattern = '^--%', endPattern = '^--#') {
    const escapedKey = escapeRegexPattern(key);
    let startRegex = new RegExp(`${startPattern}\\s+${escapedKey}`);
    let definitionLines = getDefinitionLines(filepath, startRegex, new RegExp(endPattern));
    if (!definitionLines.length) {
        startRegex = new RegExp(`${startPattern}\\s+(.*)${escapedKey}`);
        definitionLines = getDefinitionLines(filepath, startRegex, new RegExp(endPattern));
    }
    return definitionLines.join('');
}
function getDefinitionByKeyAsList(filepath, key, startPattern = '^--%', endPattern = '^--#') {
    const escapedKey = escapeRegexPattern(key);
    let startRegex = new RegExp(`${startPattern}\\s+${escapedKey}`);
    let definitionLines = getDefinitionLines(filepath, startRegex, new RegExp(endPattern));
    if (!definitionLines.length) {
        startRegex = new RegExp(`${startPattern}\\s+(.*)${escapedKey}`);
        definitionLines = getDefinitionLines(filepath, startRegex, new RegExp(endPattern));
    }
    return definitionLines;
}
export function defineFilepathEqual(filepathBarisentry) {
    const [filepath, barisentry] = filepathBarisentry.split('=').map(str => str.trim());
    return getDefinitionByKey(filepath, barisentry);
}
export function defineFilepathBarisentry(filepath, barisentry) {
    return getDefinitionByKey(filepath, barisentry);
}
