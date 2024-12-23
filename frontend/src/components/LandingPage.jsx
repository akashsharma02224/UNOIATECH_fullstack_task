import React, { useState, useEffect } from "react";
import { CiFacebook, CiLinkedin, CiSearch } from "react-icons/ci";
import {
  IoIosArrowBack,
  IoIosArrowForward,
  IoLogoTwitter,
  IoMdSearch,
} from "react-icons/io";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Form from "./Form";

export const Mainpage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search,setSearch] = useState('')
  const [selectedIds, setSelectedIds] = useState([]);
  const [openAddForm, setopenForm] = useState(false);
  const [againGet,setAgainGet]=useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const fetchData = async (page) => {
    setLoading(true);
    try {
      const baseURL = process.env.REACT_APP_API_BASE_URL;
      const response = await axios.get(
        `${baseURL}/api/v1/company/all?page=${page}`
      );
      const responseData = response.data;
      setData(responseData.data || []);
      setTotalPages(responseData.pagination?.totalPages || 1);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    const baseURL = process.env.REACT_APP_API_BASE_URL;
    axios
      .get(`${baseURL}/api/v1/company/all`)
      .then((response) => {
        setData(response.data.data.data || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [againGet]);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleCheckboxChange = (id) => {
    console.log("_id", id);
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllChange = (e) => {
    if (e.target.checked) {
      setSelectedIds(data.map((item) => item._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleDelete = async () => {
    if (!selectedIds.length) {
      alert("No items selected for delete.");
      return;
    }
    try {
    const baseURL = process.env.REACT_APP_API_BASE_URL;
      await Promise.all(
        selectedIds.map((id) =>
          axios.delete(`${baseURL}/api/v1/company/${id}`)
        )
      );
      setSelectedIds([]);
      setAgainGet(true);
    } catch (error) {
    }
  };

  const exportToCSV = () => {
    const header = [
      "Company Name",
      "Social Profiles",
      "Description",
      "Address",
      "Phone No.",
      "Email",
    ];
    if(Array.isArray(data)){
      const rows = Array.isArray(data) && data?.map((item) => [
        item.company_name,
        item.social_profiles.join(", "),
        item.description,
        item.address,
        item.phone_number,
        item.email,
      ]);
  
      const csvContent = [
        header.join(","),
        ...rows.map((row) => row.join(",")),
      ].join("\n");
  
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "company_data.csv");
      link.click();
    }

  };

  const redirectDetails = (id) => {
    navigate(`/Details/${id}`);
  };

console.log(search,"sea")

  const handleFetch =async ()=>{
    try {
      const dataUrl = {
        url: search
    }
      const baseURL = process.env.REACT_APP_API_BASE_URL;
      const response = await fetch(`${baseURL}/api/v1/company/scrap`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataUrl)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit form');
      }
      const data = await response.json();
      console.log('Response:', data);
      
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  }

  const handleAddOpen = () => {
    setopenForm(true)
  };

  const closeFormpopUp = () => {
    setopenForm(false)
  }
  return (
    <div>
      <div className="w-full h-[100px] justify-start items-center gap-3 flex">
        <div className="relative p-7 w-full">
          <CiSearch className="absolute left-4 top-2 text-[#6B7280] mt-[32px] ml-[30px]" />
          <div className="sm:flex sm:items-center sm:space-x-4">
            <input
              placeholder="Enter domain name"
              className="h-10 p-4 pl-12 w-full sm:w-[400px] rounded-lg bg-gray-100"
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
            />
            <button className="bg-[#EDE5FF] p-2 text-[#6C2BD9] rounded-lg w-full sm:w-[180px] font-bold mt-4 sm:mt-0" onClick={handleFetch}>
              Fetch & Save Details
            </button>
          </div>
        </div>
      </div>
      <div className="border">
        <div className="overflow-x-auto">
          <div className="flex h-[70px] justify-start items-center gap-3">
            <span className="p-1 w-[98px] h-[20px] text-xs">
              {selectedIds.length} selected
            </span>
            <button
              onClick={handleDelete}
              className="border text-[#A2A2A2] p-1 w-[58px] h-[30px] text-xs hover:bg-sky-700 hover:text-black"
            >
              Delete
            </button>
            <button
              onClick={exportToCSV}
              className="border text-[#A2A2A2] p-1 w-[135px] h-[30px] text-xs flex gap-1 hover:bg-slate-200 justify-center items-center"
            >
              <svg
                width="17"
                height="18"
                viewBox="0 0 17 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M7.79167 9H2.125H7.79167Z" fill="#A2A2A2" />
                <path
                  d="M7.79167 9H2.125"
                  stroke="#A2A2A2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M11.3333 4.75H2.125"
                  stroke="#A2A2A2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M11.3333 13.25H2.125"
                  stroke="#A2A2A2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M12.75 6.875V11.125"
                  stroke="#A2A2A2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M14.875 9H10.625"
                  stroke="#A2A2A2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              Export as CSV
            </button>
            <button className="border text-[#A2A2A2] p-1 w-[80px] h-[30px] text-xs flex gap-1 hover:bg-slate-200 justify-center items-center" onClick={() => handleAddOpen()} >
              Add
            </button>
          </div>
          <table className="min-w-full border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 flex items-center justify-center ml-2">
                  <input
                    type="checkbox"
                    onChange={handleSelectAllChange}
                    checked={selectedIds.length === data.length}
                  />
                </th>
                <th className="py-3 px-6 text-left text-[#6B7280]"></th>
                <th className="py-3 px-6 text-left text-[#6B7280]">Company</th>
                <th className="py-3 px-6 text-left text-[#6B7280]">
                  Social PROFILES
                </th>
                <th className="py-3 px-6 text-left text-[#6B7280]">
                  Description
                </th>
                <th className="py-3 px-6 text-left text-[#6B7280]">Address</th>
                <th className="py-3 px-6 text-left text-[#6B7280]">
                  Phone No.
                </th>
                <th className="py-3 px-6 text-left text-[#6B7280]">Email</th>
              </tr>
            </thead>
            {loading ? (
              <tr>
                <td className="text-center py-5">
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr className="flex justify-center items-center">
                  No data found
              </tr>
            ) : (
              <tbody className="text-gray-600 text-sm font-light">
                {Array.isArray(data) &&
                  data.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 flex items-center justify-center ml-2">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(item._id)}
                          onChange={() => handleCheckboxChange(item._id)}
                        />
                      </td>
                      <td className="py-3 px-6 text-left whitespace-nowrap text-[#6C2BD9] w-[70px] h-[50px]">
                        <img src={item.company_logo} alt={item.company_name} />
                      </td>
                      <td
                        className="py-3 px-6 text-left whitespace-nowrap text-[#6C2BD9] cursor-pointer text-red"
                        onClick={() => redirectDetails(item._id)}
                      >
                        {item.company_name}
                      </td>
                      <td className="py-3 px-6 text-left whitespace-nowrap flex gap-4 items-center">
                        {item.social_profiles}
                        <CiFacebook className="text-[#6B7280]" />
                        <IoLogoTwitter className="text-[#6B7280]" />
                        <CiLinkedin className="text-[#6B7280]" />
                      </td>
                      <td className="py-3 px-6 text-left whitespace-nowrap text-xs max-w-[555px] text-ellipsis ">
                        {item.description}
                      </td>
                      <td className="py-3 px-6 text-left text-xs">
                        {item.address}
                      </td>
                      <td className="py-3 px-6 text-left text-[#6C2BD9] text-xs">
                        {item.phone_number}
                      </td>
                      <td className="py-3 px-6 text-left text-[#6C2BD9] text-xs">
                        {item.email}
                      </td>
                    </tr>
                  ))}
              </tbody>
            )}
          </table>
        </div>

        <div className="flex py-4 justify-start items-center">
          <span>
            Showing {currentPage} of {totalPages}
          </span>
          <button
            className="w-[44px] h-[33px] border rounded ml-3 flex justify-center items-center"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            <IoIosArrowBack />
          </button>
          <button className="w-[31px] h-[33px] border flex justify-center items-center text-[#7438FE] bg-[#D1D5DB]">
            1
          </button>
          <button className="w-[33px] h-[33px] border rounded flex justify-center items-center">
            2
          </button>
          <button
            className="w-[44px] h-[33px] border rounded flex justify-center items-center"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            <IoIosArrowForward />
          </button>
        </div>
        {openAddForm && <Form closeFormpopUp={closeFormpopUp} setAgainGet={setAgainGet} />}
      </div>
    </div>
  );
};
