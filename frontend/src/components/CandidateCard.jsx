import React from "react";

const CandidateCard = ({ candidate, onStatusUpdate, onDelete }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case "Pending":
                return "bg-yellow-100 text-yellow-800";
            case "Reviewed":
                return "bg-blue-100 text-blue-800";
            case "Hired":
                return "bg-green-100 text-green-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getNextStatus = (currentStatus) => {
        switch (currentStatus) {
            case "Pending":
                return "Reviewed";
            case "Reviewed":
                return "Hired";
            default:
                return null;
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        {candidate.name}
                    </h3>
                    <p className="text-gray-600">{candidate.jobTitle}</p>
                </div>
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        candidate.status
                    )}`}
                >
                    {candidate.status}
                </span>
            </div>

            <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600">
                    <span className="font-medium">Email:</span>{" "}
                    {candidate.email}
                </p>
                <p className="text-sm text-gray-600">
                    <span className="font-medium">Phone:</span>{" "}
                    {candidate.phone}
                </p>
                {candidate.resume && (
                    <p className="text-sm text-gray-600">
                        <span className="font-medium">Resume:</span>{" "}
                        <a
                            href={`http://localhost:5000/uploads/${candidate.resume.filename}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-500"
                        >
                            View PDF
                        </a>
                    </p>
                )}
            </div>

            <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                    {getNextStatus(candidate.status) && (
                        <button
                            onClick={() =>
                                onStatusUpdate(
                                    candidate._id,
                                    getNextStatus(candidate.status)
                                )
                            }
                            className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 cursor-pointer"
                        >
                            Mark as {getNextStatus(candidate.status)}
                        </button>
                    )}
                </div>

                <button
                    onClick={() => onDelete(candidate._id)}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 cursor-pointer"
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default CandidateCard;
