import {
  CiSearch,
  CiCircleInfo,
  CiLocationOn,
  CiTwitter,
  CiCamera,
} from "react-icons/ci";
import { BiWorld } from "react-icons/bi";
import { LiaPhoneVolumeSolid } from "react-icons/lia";
import { LuFacebook, LuInstagram } from "react-icons/lu";
import { FiLinkedin } from "react-icons/fi";
import { AiOutlineMail } from "react-icons/ai";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
const Details = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState();
  const params = useParams();
  useEffect(() => {
    const baseURL = process.env.REACT_APP_API_BASE_URL;
    axios
      .get(`${baseURL}/api/v1/company/${params.id}`)
      .then((response) => {
        setData(response.data.data || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);
  console.log("data", data);
  return (
    <>
      <div className="sm:h-32 h-[180px]">
        <div className="relative p-7 w-full">
          <CiSearch className="absolute left-4 top-2 text-[#6B7280] mt-[32px] ml-[30px]" />
          <div className="sm:flex sm:items-center sm:space-x-4">
            <input
              placeholder="Enter domain name"
              className="h-10 p-4 pl-12 w-full sm:w-[400px] rounded-lg bg-gray-100"
            />
            <button className="bg-[#EDE5FF] p-2 text-[#6C2BD9] rounded-lg w-full sm:w-[180px] font-bold mt-4 sm:mt-0">
              Fetch & Save Details
            </button>
          </div>
          <div className="flex p-6 space-x-4 text-[#374151]">
            <p className="cursor-pointer">
              <a href="/">Home</a>
            </p>
            <p>&gt;</p>
            <p>{data.company_name}</p>
          </div>
        </div>
      </div>
      {/* Header - Company Info */}
      <div className="bg-gray-100 min-h-screen p-6 font-sans">
        <header className="flex flex-wrap bg-white p-6 items-center pb-4 mb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-start w-full sm:w-auto">
            <img
              src={data.company_logo}
              alt="Netflix Logo"
              className="h-[160px]  w-34 mr-4 rounded-lg"
            />
            <div className="ml-0 sm:ml-4 mt-2 text-left sm:text-left">
              <h1 className="text-2xl sm:text-4xl font-bold font-inter">
                {data.company_name}
              </h1>
              <div className="flex justify-start items-center sm:justify-start mt-4">
                <CiCircleInfo className="text-[1.5rem]" />
                <p className="text-[#64748B] ml-2">Description</p>
              </div>
              <p className="mt-2 sm:mt-1 w-full sm:w-[300px]">
                {data.description}
              </p>
            </div>
          </div>
          <div className="border-l-2 border-[#ECECEC] hidden sm:block h-32 mx-4"></div>
          <div className="flex flex-col items-start sm:items-start sm:mt-10 mt-6 w-full sm:w-auto">
            <div className="flex items-center">
              <LiaPhoneVolumeSolid className="text-[1.5rem]" />
              <p className="text-[#64748B] ml-1">Phone</p>
            </div>
            <p className="text-md">{data.phone_number}</p>
            <div className="flex items-center mt-2">
              <AiOutlineMail className="text-[1.5rem]" />
              <p className="text-[#64748B] ml-1">Email</p>
            </div>
            <p className="text-md">{data.email}</p>
          </div>
        </header>
        <div className="flex justify-center items-start  gap-3 max-lg:flex-wrap ">
          {/* Left - Company Info */}
          <div className="bg-white rounded-lg shadow p-6 h-fit w-[25%]  max-lg:w-full">
            <h2 className="text-lg font-semibold mb-4">Company Details</h2>
            <div className="space-y-5 text-gray-600">
              <div className="flex flex-col justify-start items-start">
                <div className="flex justify-start items-center gap-2">
                  <BiWorld className="text-[1.5rem]" />
                  <p className="text-[#64748B]">Website</p>
                </div>
                <p className="text-[#000000]">
                  <a
                    href="https://www.netflix.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Netflix.com
                  </a>
                </p>
              </div>
              <div className="flex flex-col justify-start items-start ">
                <div className="flex justify-start items-center gap-2">
                  <CiCircleInfo className="text-[1.5rem]" />
                  <p className="text-[#64748B]">Description</p>
                </div>
                <p className="text-[#000000] text-wrap">{data.description}</p>
              </div>
              <div className="flex flex-col justify-start items-start">
                <div className="flex justify-start items-center gap-2">
                  <CiLocationOn className="text-[1.5rem]" />
                  <p className="text-[#64748B]">Email</p>
                </div>
                <a href="mailto:contact@netflix.com" className="text-[#000000]">
                  {data.email}
                </a>
              </div>
              <div className="flex flex-col justify-start items-start">
                <div className="flex justify-start items-center gap-2">
                  <LuFacebook className="text-[1.5rem] text-[#64748B]" />
                  <p className="text-[#64748B]">Facebook </p>
                </div>
                <p className="text-[#6C2BD9] break-all cursor-pointer">
                  <a
                    href={`https://facebook.com/${data.company_name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://facebook.com/{data.company_name}
                  </a>
                </p>
              </div>
              <div className="flex flex-col justify-start items-start">
                <div className="flex justify-start items-center gap-2">
                  <LuInstagram className="text-[1.5rem]" />
                  <p className="text-[#64748B]">Instagram</p>
                </div>
                <p className="text-[#6C2BD9] break-all cursor-pointer">
                  <a
                    href={`https://instagram.com/${data.company_name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://instagram.com/{data.company_name}
                  </a>
                </p>
              </div>
              <div className="flex flex-col justify-start items-start">
                <div className="flex justify-start items-center gap-2">
                  <CiTwitter className="text-[1.5rem]" />
                  <p className="text-[#64748B]">Twitter</p>
                </div>
                <p className="text-[#6C2BD9] break-all cursor-pointer">
                  <a
                    href={`https://twitter.com/${data.company_name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://twitter.com/{data.company_name}
                  </a>
                </p>
              </div>
              <div className="flex flex-col justify-start items-start">
                <div className="flex justify-start items-center gap-2">
                  <FiLinkedin className="text-[1.5rem] mb-[4px]" />
                  <p className="text-[#64748B]">Linkedin</p>
                </div>
                <p className="text-[#6C2BD9] break-all cursor-pointer">
                  <a
                    href={`https://linkedin.com/${data.company_name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://www.linkedin.com/company/{data.company_name}
                  </a>
                </p>
              </div>
              <div className="flex flex-col justify-start items-start">
                <div className="flex justify-start items-center gap-2">
                  <CiLocationOn className="text-[1.5rem]" />
                  <p className="text-[#64748B]">Address</p>
                </div>
                <p className="text-[#000000]">{data.address}</p>
              </div>
            </div>
          </div>
          {/* Right Section - Screenshot */}
          <div className=" bg-white rounded-lg shadow p-6 w-[75%] max-lg:w-full">
            <div className="flex justify-start items-center gap-2 mb-4">
              <CiCamera className="w-[25px] h-[25px]"/>
              <h2 className="font-semibold max-lg:font-medium text-nowrap text-lg">
                Screenshot of Webpage
              </h2>
            </div>
            <div>
              <img src={data.website_screenshot} alt="Webpage Screenshot" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Details;
