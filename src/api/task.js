export async function getTask(token, project_id) {
  const res = await fetch(
    `http://localhost:5000/api/projects/${project_id}/task`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return res.json();
}

export async function createTask(token, project_id) {
  const response = await fetch(
    `http://localhost:5000/api/projects/${project_id}/task`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.json();
}

// export async function deleteDocument(token, id, project_id) {
//   return fetch(
//     `http://localhost:5000/api/projects/${project_id}/documents/${id}`,
//     {
//       method: "DELETE",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     },
//   );
// }
