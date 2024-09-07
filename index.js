import { app } from './app.js';
import dotenv from 'dotenv';
import { connectDatabase } from './database.js';

dotenv.config();

connectDatabase();

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
