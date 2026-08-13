import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";

import authRoutes from "./modules/auth";
import profileRoutes from "./modules/profile/profile.routes";
import projectRoutes from "./modules/projects/project.routes";
import blogRoutes from "./modules/blogs/blog.routes";
import contactRoutes from "./modules/contacts/contact.routes";
import serviceRoutes from "./modules/services/service.routes";
import skillRoutes from "./modules/skills/skill.routes";
import galleryRoutes from "./modules/gallery/gallery.routes";
import settingsRoutes from "./modules/settings/settings.routes";
import testimonialRoutes from "./modules/testimonials/testimonial.routes";
import dashboardRoutes from "./modules/dashboard/dashboard.routes";
import healthRoutes from "./routes/health.routes";



const app = express();

// Security Middleware
app.use(helmet());
app.use(cors());

// Logging Middleware
app.use(morgan("dev"));

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Path for images
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Default Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 Enterprise Portfolio CMS API Running Successfully",
    version: "1.0.0",
  });
});

// Health Check
app.use("/api", healthRoutes);

// Authentication routes
app.use("/api/auth", authRoutes);

//Profile routes
app.use("/api/profile", profileRoutes);

//projects routes
app.use("/api/projects", projectRoutes);

//blog routes
app.use("/api/blogs", blogRoutes);

//contct routes
app.use("/api/contact", contactRoutes);

//service routes
app.use("/api/services", serviceRoutes);

//skills routes
app.use("/api/skills", skillRoutes);

//gallery routes
app.use("/api/gallery", galleryRoutes);

//testimonials routes
app.use("/api/testimonials", testimonialRoutes);

//Dashboard Routes
app.use("/api/dashboard", dashboardRoutes);

//setting routes
app.use("/api/settings", settingsRoutes);

// 404 Route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});
export default app;