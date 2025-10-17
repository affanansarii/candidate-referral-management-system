import React, { useState, useEffect } from "react";
import { candidateAPI } from "../utils/api";
import CandidateCard from "./CandidateCard";
import ReferralForm from "./ReferralForm";
import Metrics from "./Metrics";

const Dashboard = () => {
    const [candidates, setCandidates] = useState([]);
    const [filteredCandidates, setFilteredCandidates] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCandidates();
    }, []);

    useEffect(() => {
        filterCandidates();
    }, [candidates, searchTerm, statusFilter]);

    const loadCandidates = async () => {
        try {
            const response = await candidateAPI.getAll();
            setCandidates(response.data);
        } catch (error) {
            console.error("Error loading candidates:", error);
            alert("Error loading candidates");
        } finally {
            setLoading(false);
        }
    };

    const filterCandidates = () => {
        let filtered = candidates;

        if (searchTerm) {
            filtered = filtered.filter(
                (candidate) =>
                    candidate.jobTitle
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    candidate.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
            );
        }

        if (statusFilter !== "All") {
            filtered = filtered.filter(
                (candidate) => candidate.status === statusFilter
            );
        }

        setFilteredCandidates(filtered);
    };

    const handleStatusUpdate = async (candidateId, newStatus) => {
        try {
            await candidateAPI.updateStatus(candidateId, newStatus);
            loadCandidates(); // Reload to get updated data
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Error updating candidate status");
        }
    };

    const handleDeleteCandidate = async (candidateId) => {
        if (window.confirm("Are you sure you want to delete this candidate?")) {
            try {
                await candidateAPI.delete(candidateId);
                loadCandidates(); // Reload to get updated data
            } catch (error) {
                console.error("Error deleting candidate:", error);
                alert("Error deleting candidate");
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="px-4 py-6 sm:px-0">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Candidate Referrals
                        </h1>
                        <button
                            onClick={() => setShowForm(true)}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 cursor-pointer"
                        >
                            Refer Candidate
                        </button>
                    </div>
                </div>

                {/* Metrics */}
                <Metrics candidates={candidates} />

                {/* Search and Filter */}
                <div className="px-4 py-6 sm:px-0">
                    <div className="bg-white p-4 rounded-lg shadow">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="Search by name or job title..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                />
                            </div>
                            <div className="sm:w-48">
                                <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={statusFilter}
                                    onChange={(e) =>
                                        setStatusFilter(e.target.value)
                                    }
                                >
                                    <option value="All">All Status</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Reviewed">Reviewed</option>
                                    <option value="Hired">Hired</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Candidates Grid */}
                <div className="px-4 py-6 sm:px-0">
                    {filteredCandidates.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-lg shadow">
                            <p className="text-gray-500 text-lg">
                                No candidates found
                            </p>
                            <button
                                onClick={() => setShowForm(true)}
                                className="mt-4 text-indigo-600 hover:text-indigo-500 cursor-pointer"
                            >
                                Refer your first candidate
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredCandidates.map((candidate) => (
                                <CandidateCard
                                    key={candidate._id}
                                    candidate={candidate}
                                    onStatusUpdate={handleStatusUpdate}
                                    onDelete={handleDeleteCandidate}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Referral Form Modal */}
            {showForm && (
                <ReferralForm
                    onClose={() => setShowForm(false)}
                    onCandidateAdded={loadCandidates}
                />
            )}
        </div>
    );
};

export default Dashboard;
