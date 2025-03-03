const Pagination = ({ totalPages, currentPage, setCurrentPage }) => {
    const generatePageNumbers = () => {
        const pages = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 3) {
                // Nếu ở trang đầu: 1 2 3 4 5 ... N
                pages.push(1, 2, 3, 4, 5, "...");
            } else if (currentPage >= totalPages - 2) {
                // Nếu ở trang cuối: 1 ... N-4 N-3 N-2 N-1 N
                pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                // Nếu ở giữa: 1 ... X-1 X X+1 ... N
                pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
            }
        }
        return pages;
    };

    return (
        <nav className="mt-4">
            <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>‹‹ Trước</button>
                </li>

                {generatePageNumbers().map((page, index) => (
                    <li key={index} className={`page-item ${currentPage === page ? "active" : ""} ${page === "..." ? "disabled" : ""}`}>
                        {page === "..." ? (
                            <span className="page-link">...</span>
                        ) : (
                            <button className="page-link" onClick={() => setCurrentPage(page)}>
                                {page}
                            </button>
                        )}
                    </li>
                ))}

                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>Sau ››</button>
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;