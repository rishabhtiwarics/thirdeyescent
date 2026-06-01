const fs = require('fs');
try {
  fs.copyFileSync(
    'C:\\Users\\INTEL\\.gemini\\antigravity-ide\\brain\\60b58409-9e3c-4d62-aed6-322ecf7e18bb\\contact_showcase_1780311945573.png',
    'c:\\Users\\INTEL\\OneDrive\\Desktop\\thirdeyescent\\public\\img\\newsection\\contact_showcase.png'
  );
  console.log('Success');
} catch (e) {
  console.error(e);
}
