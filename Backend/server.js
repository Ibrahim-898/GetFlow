require('dotenv').config();
const app = require('./src/app');
const {connectDB} = require('./src/db/db');
const startPlanExpiryJob = require('./src/jobs/planExpiry.job')

connectDB();
startPlanExpiryJob();
app.listen(8000,()=>{
    console.log('Server is running on port 8000');
});