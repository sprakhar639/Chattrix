import mongoose from 'mongoose';
import app from './src/app.js';
import connectDB from './src/db/db.js';


const PORT = process.env.PORT || 3000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});