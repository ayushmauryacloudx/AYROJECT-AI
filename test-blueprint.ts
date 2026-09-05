import { adminDb } from './server/firebase-admin';

async function run() {
  const users = await adminDb.collection('users').get();
  let projectId = null;
  let userId = null;
  for (const userDoc of users.docs) {
    const projects = await adminDb.collection('users').doc(userDoc.id).collection('projects').get();
    if (projects.docs.length > 0) {
      projectId = projects.docs[0].id;
      userId = userDoc.id;
      break;
    }
  }
  console.log("Found project:", projectId, "for user:", userId);

  // Now let's try to run the blueprint logic
  const projectRef = adminDb.collection('users').doc(userId).collection('projects').doc(projectId);
  const projectSnap = await projectRef.get();
  const projectData = projectSnap.data();
  console.log("Project Data:", projectData);
}
run();
