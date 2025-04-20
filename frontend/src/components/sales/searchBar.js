import React from 'react';
import { useSearchStore } from '../../store/searchStore';

export default function SearchBar() {
  const keyword = useSearchStore((state) => state.keyword);
  const setKeyword = useSearchStore((state) => state.setKeyword);

  return (
    <>
      <div className="d-flex justify-content-center mt-4">
        <h3 className="fw-bold">Quản Lý Đơn Hàng</h3>
      </div>
      <div className="input-group mt-2">
          <span className="input-group-text">
            <button className="nav-link"><i className="bi bi-search"></i></button>
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Tìm kiếm theo khách hàng, sản phẩm, số điện thoại..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
      </div>
    </>
  );
}
