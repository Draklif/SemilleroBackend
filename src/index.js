import express from 'express'
import cors from 'cors'
import data from './data.json' assert { type: 'json' }

const dataArr = data
const app = express()

app.use(express.json())
app.use(cors('*'))

app.get('/data', ( request, response ) => {
    response.send(dataArr)
})

app.post('/data', ( request, response ) => {
    const lastProjectId = dataArr.projects.length ? Math.max(...dataArr.projects.map(proj => proj.id)) : 0
    const newProject = { id: lastProjectId + 1, ...request.body }
    
    dataArr.projects.push(newProject)
    response.send({ message: 'Project added', project: newProject })
})

app.delete('/data/:id', ( request, response ) => {
    const projectId = parseInt(request.params.id)
    const projectIndex = dataArr.projects.findIndex(proj => proj.id === projectId)

    if (projectIndex === -1) {
        return response.status(404).send({ message: 'Project not found' })
    }

    dataArr.projects.splice(projectIndex, 1)

    response.send({ message: 'Project deleted' })
})

app.put('/data/:id', (request, response) => {
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