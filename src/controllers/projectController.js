import data from '../data/data.json' assert { type: 'json' };

const dataArr = data;

export const getAllProjects = (req, res) => {
  res.send(dataArr);
};

export const getProjectById = (req, res) => {
  const projectId = parseInt(req.params.id);
  const project = dataArr.projects.find(proj => proj.id === projectId);
  if (!project) {
    return res.status(404).send({ message: 'Project not found' });
  }
  res.send(project);
};

export const addProject = (req, res) => {
  const lastProjectId = dataArr.projects.length
    ? Math.max(...dataArr.projects.map(proj => proj.id))
    : 0;
  const newProject = { id: lastProjectId + 1, ...req.body, id: lastProjectId + 1 };
  dataArr.projects.push(newProject);
  res.send({ message: 'Project added', project: newProject });
};

export const updateProject = (req, res) => {
  const projectId = parseInt(req.params.id);
  const projectIndex = dataArr.projects.findIndex(proj => proj.id === projectId);
  if (projectIndex === -1) {
    return res.status(404).send({ message: 'Project not found' });
  }
  dataArr.projects[projectIndex] = { ...dataArr.projects[projectIndex], ...req.body };
  res.send({ message: 'Project updated' });
};

export const deleteProject = (req, res) => {
  const projectId = parseInt(req.params.id);
  const projectIndex = dataArr.projects.findIndex(proj => proj.id === projectId);
  if (projectIndex === -1) {
    return res.status(404).send({ message: 'Project not found' });
  }
  dataArr.projects.splice(projectIndex, 1);
  res.send({ message: 'Project deleted' });
};
