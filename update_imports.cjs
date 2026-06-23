const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

walk('./src', (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    content = content.replace(/import\s*\{([^}]*)\}\s*from\s*['"](\.\.?\/.+?)\/AuthContext['"];/g, (match, imports, basePath) => {
      let importedItems = imports.split(',').map(s => s.trim()).filter(s => s);
      let authUtilsItems = [];
      let authContextItems = [];
      importedItems.forEach(item => {
        if (item === 'useAuth' || item === 'SignUpData' || item === 'AuthContext') {
          authUtilsItems.push(item);
        } else {
          authContextItems.push(item);
        }
      });
      let result = '';
      if (authContextItems.length > 0) {
        result += `import { ${authContextItems.join(', ')} } from '${basePath}/AuthContext';\n`;
      }
      if (authUtilsItems.length > 0) {
        result += `import { ${authUtilsItems.join(', ')} } from '${basePath}/authUtils';\n`;
      }
      return result.trim();
    });

    content = content.replace(/import\s*\{([^}]*)\}\s*from\s*['"](\.\.?\/.+?)\/ThemeContext['"];/g, (match, imports, basePath) => {
      let importedItems = imports.split(',').map(s => s.trim()).filter(s => s);
      let themeUtilsItems = [];
      let themeContextItems = [];
      importedItems.forEach(item => {
        if (item === 'useTheme' || item === 'ThemeContext' || item === 'Theme') {
          themeUtilsItems.push(item);
        } else {
          themeContextItems.push(item);
        }
      });
      let result = '';
      if (themeContextItems.length > 0) {
        result += `import { ${themeContextItems.join(', ')} } from '${basePath}/ThemeContext';\n`;
      }
      if (themeUtilsItems.length > 0) {
        result += `import { ${themeUtilsItems.join(', ')} } from '${basePath}/themeUtils';\n`;
      }
      return result.trim();
    });

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated ' + filePath);
    }
  }
});
