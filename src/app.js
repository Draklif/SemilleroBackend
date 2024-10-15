import express from 'express';
import cors from 'cors';
import projectRoutes from './routes/projectRoutes.js';

const app = express();

app.use(express.json());
app.use(cors('*'));
app.use(projectRoutes);

app.listen(8080, () => {
  console.log("> Server on port 8080");
});