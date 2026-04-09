const fs = require('fs');
const path = require('path');

const postsDir = path.join(process.cwd(), 'src', 'content', 'posts');
const files = fs.readdirSync(postsDir);

files.forEach(file => {
    if (!file.endsWith('.md')) return;
    
    const filePath = path.join(postsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // title: ... 라인을 찾아서 따옴표가 없으면 따옴표로 감쌉니다.
    content = content.replace(/^title:\s*(.*)$/m, (match, p1) => {
        let title = p1.trim();
        if ((title.startsWith('"') && title.endsWith('"')) || (title.startsWith("'") && title.endsWith("'"))) {
            return match;
        }
        // 이미 따옴표가 없다면 쌍따옴표로 감쌉니다. 내부의 쌍따옴표는 이스케이프가 필요할 수 있으나 제목에는 드무니 기본적으로 감쌉니다.
        return `title: "${title.replace(/"/g, '\\"')}"`;
    });
    
    // summary: ... 라인도 똑같이 처리합니다.
    content = content.replace(/^summary:\s*(.*)$/m, (match, p1) => {
        let summary = p1.trim();
        if ((summary.startsWith('"') && summary.endsWith('"')) || (summary.startsWith("'") && summary.endsWith("'"))) {
            return match;
        }
        return `summary: "${summary.replace(/"/g, '\\"')}"`;
    });
    
    fs.writeFileSync(filePath, content, 'utf8');
});

console.log('✅ 모든 블로그 포스트의 YAML 형식을 수정했습니다.');
