import { configDotenv } from 'dotenv';
configDotenv();
import express from 'express';

import authRoutes from './routes/authRoutes.js'


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;


// routes

app.use("/api/auth", authRoutes);



app.listen(PORT, () => {
  console.log(`Srvr is still alive at ${PORT}`);
});