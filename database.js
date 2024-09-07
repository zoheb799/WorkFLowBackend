import mongoose from "mongoose";

export const connectDatabase = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then((c) => {
      console.log('connection to db success');
      
    })
    .catch((e) => {
      console.log(e, 'error');
    });
};
