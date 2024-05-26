import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { createServer } from 'http';
import ImageRouter from './routers/ImageRouter';

const PORT = process.env.PORT || 5000;

const app = express();

export const server = createServer(app);

app.use(cors({
  credentials: true,
  origin: (requestOrigin, callback) => {
    if ([process.env.CLIENT_URL, process.env.BUILD_CLIENT_URL].includes(requestOrigin)) {
      callback(null, true)
    } else {
      callback(null, true)
    }
  }
}));
app.use(express.json());
app.use(cookieParser());
app.use('/', ImageRouter);
app.use('/images', express.static('images'));

const start = async () => {
  try {
    server.listen(PORT, () => {
      console.log(`server started on port ${PORT}`)
    });
  } catch (e) {
    console.log(e);
  }
}

start();
