import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Products = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState("All");

  const itemsPerPage = 5;

  const getProduct = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://fakestoreapi.com/products");
      setData(response.data);
      setFilteredData(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProduct();
  }, []);

  const categories = ["All", ...new Set(data.map((item) => item.category))];

  const handleCategory = (e) => {
    const selected = e.target.value;
    setCategory(selected);
    setCurrentPage(1);
    if (selected === "All") {
      setFilteredData(data);
    } else {
      setFilteredData(data.filter((item) => item.category === selected));
    }
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container py-3">
      <h2 className="text-center mb-4">Products</h2>

      <div className="mb-4 d-flex justify-content-end">
    <label htmlFor="Category" className="mx-2">Category :</label>
        <select
          className="form-select w-auto"
          id="Category"
          value={category}
          onChange={handleCategory}
        >
          {categories.map((cat, idx) => (
            <option key={idx} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <>
          <div className="row g-4">
            {currentItems.map((item) => (
              <div key={item.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                <div className="card h-100 shadow-sm">
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title text-truncate">{item.title}</h5>
                    <p className="card-text fw-bold mb-2">${item.price}</p>
                    <p className="text-muted small">{item.category}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <nav className="mt-4">
            <ul className="pagination justify-content-center">
              {[...Array(totalPages).keys()].map((num) => (
                <li
                  key={num}
                  className={`page-item ${currentPage === num + 1 ? "active" : ""}`}
                >
                  <button className="page-link" onClick={() => handlePageChange(num + 1)}>
                    {num + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </>
      )}
    </div>
  );
};

export default Products;
