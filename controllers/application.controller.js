import { Application } from "../models/application.model.js";

import { Job } from "../models/job.model.js";

export const applyJob = async (req, res) => {
  try {
    const userId = req.id;
    const { id: jobId } = req.params;
    // const jobId=req.params.id;

    if (!jobId) {
      return res.status(400).json({
        message: "jobid is required",
        success: false,
      });
    }
    //check if user has already applied for the job

    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId,
    });
    if (existingApplication) {
      return res.status(400).json({
        message: "you have already applied for jobs",
        success: false,
      });
    }

    //check if job exist or not
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        message: "job not found",
        success: false,
      });
    }
    // create a new application
    const newApplication = await Application.create({
      job: jobId,
      applicant: userId,
    });

    job.application.push(newApplication._id);
    await job.save();
    return res.status(201).json({
      message: "job applied succesfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "server failure",
      success: false,
      error: error.message,
    });
  }
};

export const getAppliedJob = async (req, res) => {
  try {
    const userId = req.id;
    const application = await Application.find({ applicant: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        optons: { sort: { createdAt: -1 } },
        populate: {
          path: "company",
          optons: { sort: { createdAt: -1 } },
        },
      });
    if (!application) {
      return res.status(404).json({
        message: "no application ",
        success: false,
      });
    }

    return res.status(200).json({
      application,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "server failure",
      success: false,
      error: error.message,
    });
  }
};

//admin will how many user has applied

export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId).populate({
      path: "application",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "applicant",
      },
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    return res.status(200).json({
      job,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server failure",
      success: false,
      error: error.message,
    });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;

    if (!status) {
      return res.status(400).json({
        message: "status is required",
        success: false,
      });
    }
    //find the application by applicantion Id
    const application = await Application.findOne({ _id: applicationId });
    if (!application) {
      return res.status(404).json({
        message: "application not found",
        success: false,
      });
    }

    //update the status
    application.status = status.toLowerCase();
    await application.save();
    return res.status(200).json({
      message: "statuts updated succesfullly",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "server failure for updating status",
      success: false,
      error: error.message,
    });
  }
};
