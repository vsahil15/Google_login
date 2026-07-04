import dotenv from 'dotenv';
dotenv.config({path:'./.env'});

const db_url=process.env.MONGO_URL;
const PORT=process.env.PORT;

export{
    db_url,
    PORT
};