import React from "react";

const Pagination = ({ totalPages, currentPage, setCurrentPage }) => {
  const generatePageNumbers = () => {
    const pages = [];

    if (totalPages <= 5) {
        // Hiển thị toàn bộ nếu trang ít
        for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
        if (currentPage <= 3) {
        // Đầu danh sách
        pages.push(1, 2, 3, 4, '...', totalPages);
        } else if (currentPage >= totalPages - 2) {
        // Cuối danh sách
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
        } else {
        // Ở giữa
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
        }
    }

    return pages;
    };

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="mt-4">
      <ul className="pagination justify-content-center">
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => goToPage(1)}>‹‹ Trước</button>
        </li>

        {generatePageNumbers().map((page, index) => (
          <li
            key={index}
            className={`page-item ${currentPage === page ? "active" : ""} ${page === "..." ? "disabled" : ""}`}
          >
            {page === "..." ? (
              <span className="page-link">...</span>
            ) : (
              <button className="page-link" onClick={() => goToPage(page)}>
                {page}
              </button>
            )}
          </li>
        ))}

        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => goToPage(totalPages)}>Sau ››</button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;