import { Request, Response } from "express";
import serviceService from "./service.service";

export const createService = async (
  req: Request,
  res: Response
) => {
  try {
    const service = await serviceService.createService(
      req.body
    );

    return res.status(201).json({
      success: true,
      message: "Service created successfully",
      data: service,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create service",
    });
  }
};

export const getServices = async (
  req: Request,
  res: Response
) => {
  try {
    const services = await serviceService.getServices();

    return res.status(200).json({
      success: true,
      data: services,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch services",
    });
  }
};

export const getActiveServices = async (
  req: Request,
  res: Response
) => {
  try {
    const services =
      await serviceService.getActiveServices();

    return res.status(200).json({
      success: true,
      data: services,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch active services",
    });
  }
};

export const getServiceById = async (
  req: Request,
  res: Response
) => {
  try {
    const serviceId = String(req.params.id);

    const service =
      await serviceService.getServiceById(serviceId);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch service",
    });
  }
};

export const getServiceBySlug = async (
  req: Request,
  res: Response
) => {
  try {
    const slug = String(req.params.slug);

    const service =
      await serviceService.getServiceBySlug(slug);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch service",
    });
  }
};

export const updateService = async (
  req: Request,
  res: Response
) => {
  try {
    const serviceId = String(req.params.id);

    const existingService =
      await serviceService.getServiceById(serviceId);

    if (!existingService) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    const service =
      await serviceService.updateService(
        serviceId,
        req.body
      );

    return res.status(200).json({
      success: true,
      message: "Service updated successfully",
      data: service,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update service",
    });
  }
};

export const deleteService = async (
  req: Request,
  res: Response
) => {
  try {
    const serviceId = String(req.params.id);

    const existingService =
      await serviceService.getServiceById(serviceId);

    if (!existingService) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    await serviceService.deleteService(serviceId);

    return res.status(200).json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete service",
    });
  }
};