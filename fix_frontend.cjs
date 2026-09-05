const fs = require('fs');

// --- 1. Fix ProjectDetails.tsx ---
let pd = fs.readFileSync('src/pages/ProjectDetails.tsx', 'utf-8');
pd = pd.replace(/const responseData = await res\.json\(\);\s*const \{ db \} = await import\('\.\.\/lib\/firebase'\);\s*const \{ doc, updateDoc \} = await import\('firebase\/firestore'\);\s*const docRef = doc\(db, 'users', user\.uid, 'projects', id!\);\s*await updateDoc\(docRef, \{\s*blueprint: responseData,\s*status: 'in-progress'\s*\}\);\s*await fetchProject\(\);/m, 
`      await res.json();
      await fetchProject();`);
fs.writeFileSync('src/pages/ProjectDetails.tsx', pd);

// --- 2. Fix Mentor.tsx ---
let mentor = fs.readFileSync('src/pages/Mentor.tsx', 'utf-8');
mentor = mentor.replace(/const \{ collection, addDoc \} = await import\('firebase\/firestore'\);\s*const messagesRef = collection\(db, 'users', auth\.currentUser\.uid, 'projects', id!, 'mentorMessages'\);\s*await addDoc\(messagesRef, \{ \.\.\.newMsg, createdAt: new Date\(\)\.toISOString\(\) \}\);/m, 
`// The backend now saves the user message`);

mentor = mentor.replace(/const aiMsg = \{ role: 'ai' as const, content: data\.response \};\s*await addDoc\(messagesRef, \{ \.\.\.aiMsg, createdAt: new Date\(\)\.toISOString\(\) \}\);/m, 
`const aiMsg = data.message;`);

// Remove the payload object building for the fetch call
mentor = mentor.replace(/body: JSON\.stringify\(\{\s*message: userMessage,\s*projectData: project,\s*history: messages\s*\}\)/m, 
`body: JSON.stringify({ message: userMessage })`);

fs.writeFileSync('src/pages/Mentor.tsx', mentor);
console.log("Security fixes applied to frontend.");
