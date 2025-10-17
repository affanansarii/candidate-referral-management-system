import React, { useState } from "react";
import { candidateAPI } from "../utils/api";

const ReferralForm = ({ onClose, onCandidateAdded }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        jobTitle: "",
    });
    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        // Clear error when user starts typing
        if (errors[e.target.name]) {
            setErrors({
                ...errors,
                [e.target.name]: "",
            });
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type !== "application/pdf") {
            setErrors({
                ...errors,
                resume: "Only PDF files are allowed",
            });
            setResume(null);
        } else {
            setResume(file);
            setErrors({
                ...errors,
                resume: "",
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "Phone is required";
        }

        if (!formData.jobTitle.trim()) {
            newErrors.jobTitle = "Job title is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const submitData = new FormData();
            submitData.append("name", formData.name);
            submitData.append("email", formData.email);
            submitData.append("phone", formData.phone);
            submitData.append("jobTitle", formData.jobTitle);

            if (resume) {
                submitData.append("resume", resume);
            }

            await candidateAPI.create(submitData);
            onCandidateAdded();
            onClose();
        } catch (error) {
            console.error("Error creating candidate:", error);
            alert(error.response?.data?.message || "Error creating candidate");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-lg flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Refer a Candidate
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 cursor-pointer"
                        >
                            ✕
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Candidate Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                    errors.name
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                                placeholder="Enter candidate's full name"
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email *
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                    errors.email
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                                placeholder="Enter candidate's email"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number *
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                    errors.phone
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                                placeholder="Enter candidate's phone number"
                            />
                            {errors.phone && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.phone}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Job Title *
                            </label>
                            <input
                                type="text"
                                name="jobTitle"
                                value={formData.jobTitle}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                    errors.jobTitle
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                                placeholder="Enter job title"
                            />
                            {errors.jobTitle && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.jobTitle}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Resume (PDF only)
                            </label>
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={handleFileChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            {errors.resume && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.resume}
                                </p>
                            )}
                            <p className="text-gray-500 text-sm mt-1">
                                Optional: Upload PDF resume (max 5MB)
                            </p>
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 cursor-pointer"
                            >
                                {loading ? "Submitting..." : "Refer Candidate"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ReferralForm;
