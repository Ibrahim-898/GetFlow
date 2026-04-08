require('dotenv').config();
const app = require('./src/app');
const {connectDB} = require('./src/db/db');
const startPlanExpiryJob = require('./src/jobs/planExpiry.job')
const PORT = process.env.PORT || 8000;
connectDB();
startPlanExpiryJob();
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});