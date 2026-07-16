const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const outputFile = path.join(rootDir, 'all_code.md');
let mdContent = '# TOÀN BỘ SOURCE CODE DỰ ÁN LMSJS\n\n';

function appendFile(filePath, displayName) {
    if (fs.existsSync(filePath)) {
        const ext = path.extname(filePath).substring(1);
        let lang = ext;
        if (ext === 'js' || ext === 'jsx') lang = 'javascript';
        
        const content = fs.readFileSync(filePath, 'utf8');
        mdContent += `## File: ${displayName}\n\n`;
        mdContent += '```' + lang + '\n';
        mdContent += content;
        mdContent += '\n```\n\n';
    }
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else {
            const relPath = path.relative(rootDir, fullPath).replace(/\\/g, '/');
            appendFile(fullPath, relPath);
        }
    }
}

try {
    appendFile(path.join(rootDir, 'package.json'), 'package.json');
    appendFile(path.join(rootDir, 'database.json'), 'database.json');
    walkDir(path.join(rootDir, 'src'));
    fs.writeFileSync(outputFile, mdContent, 'utf8');
    console.log('Đã tạo thành công file all_code.md');
} catch(e) {
    console.error(e);
}
