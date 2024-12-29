import colors from 'colors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';

const dotenvConfig = dotenv.config();
dotenvExpand.expand(dotenvConfig);

const connect = () => {
    mongoose.connect(process.env.DB_URI || '')
        .then(async () =>  {
            console.log(`[DB] ${colors.green(`Connected to the ${process.env.DB_NAME} DB`)}`);
        })
        .catch((err) => console.log(`[DB] ${colors.red(`Error while connecting to the DB: ${err}`)}`));
};

export default { connect };