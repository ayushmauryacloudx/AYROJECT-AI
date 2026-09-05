const fs = require('fs');

let pd = fs.readFileSync('src/pages/ProjectDetails.tsx', 'utf-8');

pd = pd.replace(
  /await res\.json\(\);\n\s*await fetchProject\(\);/m,
  `const blueprint = await res.json();
      
      const { db } = await import('../lib/firebase');
      const { doc, updateDoc } = await import('firebase/firestore');
      const docRef = doc(db, 'users', user.uid, 'projects', project.id);
      await updateDoc(docRef, {
        blueprint: blueprint,
        status: 'in-progress',
        updatedAt: new Date().toISOString()
      });

      await fetchProject();`
);

fs.writeFileSync('src/pages/ProjectDetails.tsx', pd);
