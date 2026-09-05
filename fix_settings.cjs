const fs = require('fs');

let settingsTsx = fs.readFileSync('src/pages/Settings.tsx', 'utf-8');

settingsTsx = settingsTsx.replace(
  /import \{ useState, useEffect \} from 'react';/,
  `import React, { useState, useEffect } from 'react';`
);

fs.writeFileSync('src/pages/Settings.tsx', settingsTsx);
