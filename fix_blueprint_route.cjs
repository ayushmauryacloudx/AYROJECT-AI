const fs = require('fs');

let blueprintTs = fs.readFileSync('server/routes/blueprint.ts', 'utf-8');

blueprintTs = blueprintTs.replace(
  /\/\/ Fix: Client-Side Trust[\s\S]*?const durationWeeks = projectData\.studentProfileSnapshot\?\.durationWeeks \|\| 12;/m,
  `const projectData = req.body.projectData;
    if (!projectData) {
      res.status(400).json({ error: 'Missing projectData in request body' });
      return;
    }
    const skills = projectData.studentProfileSnapshot?.skills || [];
    const durationWeeks = projectData.studentProfileSnapshot?.durationWeeks || 12;`
);

blueprintTs = blueprintTs.replace(
  /\/\/ Fix: Save the generated blueprint directly to the database[\s\S]*?updatedAt: new Date\(\)\.toISOString\(\)\n    \}\);/m,
  `// Return the blueprint to the client, the client SDK will save it.`
);

fs.writeFileSync('server/routes/blueprint.ts', blueprintTs);
