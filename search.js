const fs = require('fs');
const path = require('path');
const keywords = require('./open-type.js');

// 获取当前文件夹路径
const folderPath = __dirname;
// 要匹配的字符数组
const searchArray = keywords;

// 递归遍历文件夹并查找匹配的文件
function searchFiles(folderPath, searchArray) {
  const files = fs.readdirSync(folderPath);

  for (const file of files) {
	if(file === 'node_modules') continue;
	if(file === 'open-type.js') continue;
	if(file === 'search.js') continue;
	if(file === 'dist') continue;
    const filePath = path.join(folderPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      searchFiles(filePath, searchArray); // 递归处理子文件夹
    } else {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const matchedKeywords = searchArray.filter(keyword => fileContent.includes(keyword));

      if (matchedKeywords.length > 0) {
        const rowData = `File Path: ${filePath}\nKeywords: ${matchedKeywords.join(', ')}\n\n`;
        fs.appendFileSync('search_results.txt', rowData);
      }
    }
  }
}

// 清空或创建新的文本文件
fs.writeFileSync('search_results.txt', '');

// 调用函数开始查找
searchFiles(folderPath, searchArray);

console.log('Text file generated: search_results.txt');
