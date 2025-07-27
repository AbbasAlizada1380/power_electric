import axios from "axios";
import logo from "../../public/photoes/logo.png";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import RegisterUser from "./RegisterUser";
import DeleteUser from "./deleteUser";
import CreateAppointment from "./CreateAppointment";
import Reporting from "./Report";
import UsersInZone from "./users";

const AdminDashboard = () => {
  const token = sessionStorage.getItem("token");
  const id = sessionStorage.getItem("id");
  const [previewUrl, setPreviewUrl] = useState();
  const [selectedOption, setSelectedOption] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("id");
    sessionStorage.removeItem("zone");
    navigate("/");
  };

  const menuItems = [
    { label: "نوبت دهی", value: "CreateAppointment" },
    { label: "ایجاد حساب کاربری جدید", value: "CreateAccount" },
    { label: "حذف حساب کاربری", value: "DeleteAccount" },
    { label: "گزارشات", value: "report" },
    { label: "کارمندان زون", value: "users" },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:8038/users/${id}`);
        const { image } = response.data;
        setPreviewUrl(`http://localhost:8038/uploads/${image}`);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, [id]);

  const renderSection = () => {
    switch (selectedOption) {
      case "CreateAccount":
        return (
          <section className="dir-rtl">
            <h2 className="text-xl font-semibold mb-4">
              ایجاد حساب کاربری جدید
            </h2>
            <RegisterUser id={id} />
          </section>
        );
      case "DeleteAccount":
        return (
          <section>
            <h2 className="text-xl font-semibold mb-4">حذف حساب کاربری</h2>
            <DeleteUser id={id} />
          </section>
        );
      case "CreateAppointment":
        return (
          <section>
            <h2 className="text-xl font-semibold mb-4">نوبت دهی</h2>
            <CreateAppointment id={id} />
          </section>
        );
      case "report":
        return (
          <section>
            <h2 className="text-xl font-semibold mb-4">گزارشات</h2>
            <Reporting id={id} />
          </section>
        );
      case "users":
        return (
          <section>
            <h2 className="text-xl font-semibold mb-4">کارمندان زون</h2>
            <UsersInZone />
          </section>
        );
      default:
        return <section></section>;
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen flex flex-col bg-gradient-to-br from-red-900 via-red-700 to-red-400"
    >
      {/* Navbar */}
      <nav
        dir="ltr"
        className="bg-red-950 text-white p-4 flex justify-between items-center"
      >
        <div className="text-xl font-bold">
          <img src={logo} alt="Logo" className="size-14" />
        </div>
        <div>
          <p className="animate-pulse opacity-0 duration-100 sm:text-xl md:text-2xl lg:text-4xl gradient-text">
            به دشبورد سیستم خوش آمدید
          </p>
        </div>

        <div className="relative">
          <img
            src={previewUrl}
            alt="Profile"
            className="rounded-full w-14 h-14 cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          />
          {dropdownOpen && (
            <div className="z-20 absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
              <Link
                to={`/profile/${id}`}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                <button>بازدید از پروفایل</button>
              </Link>
              <button
                onClick={logout}
                className="block w-full text-right px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                خروج از دشبورد
              </button>
            </div>
          )}
        </div>
      </nav>

      <div className="flex flex-grow flex-col md:flex-row">
        {/* Hamburger Menu (Mobile) */}
        <div className="bg-red-950 text-white p-4 md:hidden flex justify-between items-center">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-xl font-bold"
          >
            ☰
          </button>
        </div>

        {/* Sidebar */}
        <aside
          className={`bg-red-700 text-white w-full md:w-1/4 p-4 transform ${
            sidebarOpen ? "translate-x-0" : "hidden md:flex -translate-x-full"
          } md:translate-x-0 transition-transform duration-300 ease-in-out`}
        >
          <ul>
            {menuItems.map((item) => (
              <li
                key={item.value}
                className={`p-2 cursor-pointer mt-2 ${
                  selectedOption === item.value ? "bg-red-600" : ""
                }`}
                onClick={() => setSelectedOption(item.value)}
              >
                {item.label}
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-grow bg-gray-100 p-4">{renderSection()}</main>
      </div>
    </div>
  );
};

export default AdminDashboard;
