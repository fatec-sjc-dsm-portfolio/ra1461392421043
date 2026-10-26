import express, { Request, Response } from 'express';
import cors from 'cors';
import { technologies } from '../lib/data/technologies';
import { projects } from '../lib/data/projects';
import { localize } from '../lib/localize';
import { education } from '../lib/data/education';

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173', // Vite default dev port
    'http://localhost:4173', // Vite preview
    'https://fabiohiroshi.vercel.app',
    ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : [])
  ]
}));
app.use(express.json());


// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'API is running on Vercel!',
    timestamp: new Date().toISOString()
  });
});

// Technologies endpoints
app.get('/api/technologies', (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    
    let filteredTechnologies = technologies;
    
    if (category && category !== 'all') {
      filteredTechnologies = technologies.filter(tech => tech.category === category);
    }
    
    res.status(200).json({
      success: true,
      data: filteredTechnologies,
      count: filteredTechnologies.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

app.get('/api/technologies/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const technology = technologies.find(tech => tech.id === parseInt(id));

    if (!technology) {
      return res.status(404).json({
        success: false,
        message: 'Tecnologia não encontrada'
      });
    }

    res.status(200).json({
      success: true,
      data: technology
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Projects endpoints
app.get('/api/projects', (req: Request, res: Response) => {
  try {
    const { category, lang } = req.query;
    
    let filteredProjects = projects;
    
    if (category && category !== 'all') {
      filteredProjects = projects.filter(project => project.category === category);
    }

    filteredProjects = filteredProjects.map(project => localize(project, lang));
    
    res.status(200).json({
      success: true,
      data: filteredProjects,
      count: filteredProjects.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

app.get('/api/projects/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const found = projects.find(proj => proj.id === id);
    const project = found && localize(found, req.query.lang);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Projeto não encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Education endpoints
app.get('/api/education', (req: Request, res: Response) => {
  try {
    res.status(200).json({
      success: true,
      data: education,
      count: education.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

app.get('/api/education/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const edu = education.find(item => item.id === parseInt(id));

    if (!edu) {
      return res.status(404).json({
        success: false,
        message: 'Formação não encontrada'
      });
    }

    res.status(200).json({
      success: true,
      data: edu
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// 404 handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada'
  });
});

// Local development: `npm run dev:api` (repo root) starts a server on PORT (default 3001)
if (require.main === module) {
  const port = Number(process.env.PORT) || 3001;
  app.listen(port, () => console.log(`Portfolio API on http://localhost:${port}`));
}

// Export for Vercel
export default app;