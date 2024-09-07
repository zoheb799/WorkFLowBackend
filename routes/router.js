import express from 'express';
import multer from 'multer';
import { register, login, getUser, logout} from '../controllers/authController.js';
import { saveWorkflow, getWorkflows, getWorkflow, executeWorkflow } from '../controllers/workflowController.js';
import { isAuthenticated } from '../middlewares/auth.js';

const upload = multer();

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Hello World!');
});

router.post('/register', register);
router.post('/login', login);
router.post('/logout', isAuthenticated, logout)
router.get('/getuser', isAuthenticated, getUser);
router.post('/workflows', isAuthenticated, saveWorkflow);
router.get('/workflows', isAuthenticated, getWorkflows);
router.get('/workflows/:workflowId', isAuthenticated, getWorkflow);
router.get('/executeWorkflow/:workflowId', isAuthenticated,executeWorkflow);
router.post('/executeWorkflow/:workflowId', upload.single('csvData'), isAuthenticated,executeWorkflow);


export default router;
