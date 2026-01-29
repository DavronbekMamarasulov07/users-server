import 'dotenv/config'
import express from 'express'
import connectDB from './src/config/db.js';
import { authRoutes } from './src/routes/auth.routes.js';
import userRoutes from './src/routes/user.routes.js';
import { swaggerUi, specs } from "./src/config/swagger.js";
const app = express()
app.use(express.json())
connectDB();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use('/auth', authRoutes)
app.use("/users", userRoutes);


app.get('/', (req, res) => {
    res.send("Server ishlamoqda...")
})


const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server: http://localhost:${PORT}`)
})

export default app;