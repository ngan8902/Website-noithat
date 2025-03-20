const paginateArray = (dataArray, page = 1, limit = 10) => {
    const total = dataArray.length; // Total items
    const totalPages = Math.ceil(total / limit);
    
    // Ensure page is within range
    const currentPage = Math.max(1, Math.min(page, totalPages));
    
    // Calculate start & end indexes
    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;

    return {
        page: currentPage,
        limit,
        total,
        totalPages,
        data: dataArray.slice(startIndex, endIndex), // Slice the array
    };
};

module.exports = {
    paginateArray
};
