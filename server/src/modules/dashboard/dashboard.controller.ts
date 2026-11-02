import { Request, Response } from "express";
import dashboardService from "./dashboard.service";

export const getDashboard = async (
  req: Request,
  res: Response
) => {
  try {
    const dashboard =
      await dashboardService.getDashboard();

    return res.status(200).json({
      success: true,
      data: dashboard,
    });
  } catch (error) {
    console.error("Dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
    });
  }
};