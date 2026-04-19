import { configDotenv } from 'dotenv';
configDotenv();
import express from 'express';


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;






app.listen(PORT, () => {
  console.log(`Srvr is still alive at ${PORT}`);
});