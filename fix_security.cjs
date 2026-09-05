const fs = require('fs');

// --- 1. Fix blueprint.ts ---
let blueprint = fs.readFileSync('server/routes/blueprint.ts', 'utf-8');
blueprint = blueprint.replace(/const payload = \(req\.body && typeof req\.body === 'object'\) \? req\.body : \{\};\s*if \(\!payload\.projectData\) \{[\s\S]*?const durationWeeks = projectData\.studentProfileSnapshot\?\.durationWeeks \|\| 12;/m, 
`    // Fix: Client-Side Trust (IDOR prevention) - Fetch real project data from DB
    const projectRef = adminDb.collection('users').doc(userId).collection('projects').doc(projectId);
    const projectSnap = await projectRef.get();
    if (!projectSnap.exists) {
      res.status(404).json({ error: 'Project not found or unauthorized' });
      return;
    }
    const projectData = projectSnap.data();
    const skills = projectData.studentProfileSnapshot?.skills || [];
    const durationWeeks = projectData.studentProfileSnapshot?.durationWeeks || 12;`);

blueprint = blueprint.replace(/\/\/ Just return the blueprint for the client to save\s*res\.json\(blueprint\);/m, 
`    // Fix: Save the generated blueprint directly to the database to ensure integrity
    await projectRef.update({
      blueprint,
      status: 'in-progress',
      updatedAt: new Date().toISOString()
    });
    // Return the blueprint to the client
    res.json(blueprint);`);

fs.writeFileSync('server/routes/blueprint.ts', blueprint);


// --- 2. Fix mentor.ts ---
let mentor = fs.readFileSync('server/routes/mentor.ts', 'utf-8');
mentor = mentor.replace(/const payload = \(req\.body && typeof req\.body === 'object'\) \? req\.body : \{\};\s*const userId = req\.user!\.uid;\s*const projectId = req\.params\.projectId;\s*const \{ message, projectData, history \} = payload;\s*if \(\!message \|\| \!projectData\) \{[\s\S]*?let historyText = historyArray\.slice\(\-5\)\.map\(\(h: any\) => \`\$\{h\.role === 'user' \? 'Student' : 'Mentor'\}: \$\{h\.content\}\`\)\.join\('\\n'\);/m, 
`    const userId = req.user!.uid;
    const projectId = req.params.projectId;
    const payload = (req.body && typeof req.body === 'object') ? req.body : {};
    const { message } = payload;
    
    if (!message) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    // Fix: Fetch real project and history from DB instead of trusting client
    const projectRef = adminDb.collection('users').doc(userId).collection('projects').doc(projectId);
    const projectSnap = await projectRef.get();
    if (!projectSnap.exists) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    const projectData = projectSnap.data();

    // Fetch recent history
    const historySnap = await projectRef.collection('mentorMessages').orderBy('createdAt', 'desc').limit(5).get();
    const historyArray = historySnap.docs.map(d => d.data()).reverse();
    let historyText = historyArray.map((h: any) => \`\${h.role === 'user' ? 'Student' : 'Mentor'}: \${h.content}\`).join('\\n');

    // Save the user's message to the database immediately
    await projectRef.collection('mentorMessages').add({
      role: 'user',
      content: message,
      createdAt: new Date().toISOString()
    });
`);

mentor = mentor.replace(/res\.json\(\{ response: responseText \}\);/m, 
`    // Save AI response directly to database
    const aiMsg = {
      role: 'ai',
      content: responseText,
      createdAt: new Date().toISOString()
    };
    await projectRef.collection('mentorMessages').add(aiMsg);

    res.json({ response: responseText, message: aiMsg });`);

fs.writeFileSync('server/routes/mentor.ts', mentor);
console.log("Security fixes applied to backend.");
