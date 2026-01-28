import express, { Application, Request, Response } from "express";
import cors from "cors";
import path from "path";
import userRoutes from "./routes/user.routes";

const app: Application = express();
const PORT = process.env.PORT || 3678;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "User Management API",
    version: "1.0.0",
    endpoints: {
      users: "/api/users",
    },
  });
});

app.use("/api/users", userRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api/users`);
});

export default app;
