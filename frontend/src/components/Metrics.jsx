import React from "react";

const Metrics = ({ candidates }) => {
    const totalCandidates = candidates.length;
    const pendingCount = candidates.filter(
        (c) => c.status === "Pending"
    ).length;
    const reviewedCount = candidates.filter(
        (c) => c.status === "Reviewed"
    ).length;
    const hiredCount = candidates.filter((c) => c.status === "Hired").length;

    const metrics = [
        {
            name: "Total Referrals",
            value: totalCandidates,
            color: "bg-blue-500",
        },
        { name: "Pending", value: pendingCount, color: "bg-yellow-500" },
        { name: "Reviewed", value: reviewedCount, color: "bg-indigo-500" },
        { name: "Hired", value: hiredCount, color: "bg-green-500" },
    ];

    return (
        <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {metrics.map((metric) => (
                    <div
                        key={metric.name}
                        className="bg-white overflow-hidden shadow rounded-lg"
                    >
                        <div className="px-4 py-5 sm:p-6">
                            <div className="flex items-center">
                                <div
                                    className={`flex-shrink-0 rounded-md p-3 ${metric.color}`}
                                >
                                    <div className="h-6 w-6 text-white"></div>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            {metric.name}
                                        </dt>
                                        <dd className="text-lg font-medium text-gray-900">
                                            {metric.value}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Metrics;
