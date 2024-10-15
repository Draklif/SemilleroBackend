import express from 'express'
import cors from 'cors'
import data from './data.json' assert { type: 'json' }
import { OAuth2Client } from 'google-auth-library'

async function verifyGoogleToken(token) {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      
      const payload = ticket.getPayload();
      const userid = payload['sub'];
      
      return {
        isValid: true,
        userId: userid,
        email: payload['email'],
        name: payload['name']
      };
    } catch (error) {
      console.error('Error verifying token:', error);
      return { isValid: false, error: error.message };
    }
}

const validate = async ( request, response, next ) => {
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
        return response.status(401).send({ message: 'Unauthorized. Please log in.'});
    }

    const result = await verifyGoogleToken(token);

    if (!result.isValid) {
        return response.status(401).json({ error: 'Invalid token' });
    }

    next()
}

const dataArr = data
const app = express()

app.use(express.json())
app.use(cors('*'))

app.get('/data', ( request, response ) => {
    response.send(dataArr)
})

app.get('/data/:id', (request, response) => {
    const projectId = parseInt(request.params.id);
    const project = dataArr.projects.find(proj => proj.id === projectId);

    if (!project) {
        return response.status(404).send({ message: 'Project not found' });
    }

    response.send(project);
});

app.post('/data', validate, ( request, response ) => {
    const lastProjectId = dataArr.projects.length ? Math.max(...dataArr.projects.map(proj => proj.id)) : 0
    const newProject = { id: lastProjectId + 1, ...request.body }
    
    dataArr.projects.push(newProject)
    response.send({ message: 'Project added', project: newProject })
})

app.delete('/data/:id', validate, ( request, response ) => {
    const projectId = parseInt(request.params.id)
    const projectIndex = dataArr.projects.findIndex(proj => proj.id === projectId)

    if (projectIndex === -1) {
        return response.status(404).send({ message: 'Project not found' })
    }

    dataArr.projects.splice(projectIndex, 1)

    response.send({ message: 'Project deleted' })
})

app.put('/data/:id', validate, (request, response) => {
    const projectId = parseInt(request.params.id)
    const projectIndex = dataArr.projects.findIndex(proj => proj.id === projectId)

    if (projectIndex === -1) {
        return response.status(404).send({ message: 'Project not found' })
    }

    dataArr.projects[projectIndex] = { ...dataArr.projects[projectIndex], ...request.body }

    response.send({ message: 'Project updated' })
})

app.listen('8080', () => {
    console.log("> Server on port 8080");
})