import { Job } from "../models/job.model.js";



export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;
        const userId = req.id;

        // Check for missing fields or invalid userId
        if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        }
        if (!userId) {
            return res.status(401).json({
                message: "User not authenticated",
                success: false
            });
        }

        // Validate and transform data
        const requirementsArray = typeof requirements === "string" ? requirements.split(",").map(r => r.trim()) : [];
        const salaryNumber = Number(salary);
        if (isNaN(salaryNumber)) {
            return res.status(400).json({
                message: "Salary must be a valid number",
                success: false
            });
        }

        // Create job
        const job = await Job.create({
            title,
            description,
            requirements: requirementsArray,
            salary: salaryNumber,
            location,
            jobType,
            experienceLevel: experience,
            position: Number(position), // Ensure position is a number
            company: companyId,
            created_By: userId
        });

        return res.status(201).json({
            message: "New job created successfully",
            job,
            success: true
        });
    } catch (error) {
        console.error("Error creating job:", {
            message: error.message,
            stack: error.stack,
            body: req.body,
            userId: req.id
        });
        return res.status(500).json({
            message: error.message || "Server error",
            success: false
        });
    }
};

// Get all jobs
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } }
            ]
        };

        const jobs = await Job.find(query).populate({
            path:"company"
        }).sort({createdAt:-1});
        if (!jobs) {
            return res.status(404).json({
                message: "No jobs found",
                success: false
            });
        }

        return res.status(200).json({
            jobs,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};

// Get a job by ID
export const getJobByID = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path:"application"
        });

        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            });
        }

        return res.status(200).json({
            job,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};

// Get all jobs created by admin
export const getAdminJobs = async (req, res) => {
    try {
      const adminId = req.id;
      const jobs = await Job.find({ created_By: adminId })
        .populate("company")
        .sort({ createdAt: -1 }); // Sort by createdAt descending
  
      if (!jobs.length) {
        return res.status(404).json({
          message: "No jobs found",
          success: false,
        });
      }
  
      return res.status(200).json({
        jobs,
        success: true,
      });
    } catch (error) {
      console.error("Error fetching admin jobs:", error);
      return res.status(500).json({
        message: "Server error",
        success: false,
      });
    }
  };
