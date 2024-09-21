import React, { useState, useEffect, useContext } from "react";
import { DataView } from "primereact/dataview";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import img from "../../../assets/data_empty.png";
import { Dropdown } from "primereact/dropdown";
import { getAllArtikel } from "../../../services/ArtikelService";
import { AuthContext } from "../../../config/context/AuthContext";
import { ProgressSpinner } from "primereact/progressspinner";
import ErrorConnection from "../../../components/errorConnection/ErrorConnection";
import { InputText } from "primereact/inputtext";
import { Search } from "lucide-react";

const baseUrl = `${import.meta.env.VITE_API_BASE_URI}/static/`;

export default function Artikel() {
  const { token, dispatch } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(3);
  const navigate = useNavigate();
  const [sortOrder, setSortOrder] = useState(0);
  const [login, setLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isConnectionError, setIsConnectionError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const sortOptions = [
    { label: "Terbaru ke Terlama", value: 1 },
    { label: "Terlama ke Terbaru", value: -1 },
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getAllArtikel();

      const transformedData = response.map((item, index) => ({
        ...item,
        nomor: index,
      }));
      setData(transformedData);
      setLoading(false);
      setLogin(true);
      setIsConnectionError(false);
    } catch (error) {
      if (
        error.code === "ERR_NETWORK" ||
        error.code === "ETIMEDOUT" ||
        error.code === "ECONNABORTED" ||
        error.code === "ENOTFOUND" ||
        error.code === "ECONNREFUSED" ||
        error.code === "EAI_AGAIN" ||
        error.code === "EHOSTUNREACH" ||
        error.code === "ECONNRESET" ||
        error.code === "EPIPE"
      ) {
        setIsConnectionError(true);
      } else if (error.response) {
        if (error.response.status === 401 || error.response.status === 403) {
          dispatch({ type: "LOGOUT" });
          setIsConnectionError(false);
          setLogin(false);
        }
      } else {
        console.error("An unexpected error occurred:", error);
      }

      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token, dispatch]);

  const sortData = () => {
    const filteredData = data.filter((item) =>
      item.judul.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sortedData = [...filteredData].sort((a, b) => {
      const dateA = new Date(a.tanggalPublikasi);
      const dateB = new Date(b.tanggalPublikasi);
      return sortOrder === 1 || sortOrder === 0 ? dateB - dateA : dateA - dateB;
    });

    return sortedData.map((item, index) => ({
      ...item,
      nomor: index,
    }));
  };

  const itemTemplate = (data) => {
    return (
      <div className={`col-12 font-poppins mx-4 mb-16`} key={data.id}>
        <div className="flex flex-col gap-4 items-center justify-center border-top-1 surface-border">
          <div className="flex flex-col w-full justify-content-center align-items-center flex-1 gap-4 px-2">
            <div className="flex flex-col gap-2 md:gap-4">

              <div className="md:text-6xl text-4xl font-semibold">
                {data.judul}
              </div>
              <div className="flex md:flex-row flex-col md:gap-2 justify-start md:items-center items-start">
                <span className="text-lg">
                  {data.adminPuskesmas.namaPuskesmas}
                </span>
                <span className={`md:block hidden`}>-</span>
                <span className="text-lg text-justify ">
                  {data.tanggalPublikasi}
                </span>
              </div>
              {data.banner && (
                  <div className=" w-full md:h-80 h-fit  flex justify-center items-center">
                    <img
                        src={`${baseUrl}${data.banner}`}
                        alt={data.judul}
                        className="object-cover w-full h-full"
                    />
                  </div>
              )}
              <p className="text-xl text-justify" style={{
                display: '-webkit-box',
                WebkitLineClamp: 4,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {data.ringkasan}
              </p>
            </div>

            <div className="flex sm:flex-col align-items-center sm:align-items-end gap-3 sm:gap-2">
              <Button
                  label="Baca Selengkapnya"
                  className="p-ripple bg-mainGreen dark:bg-extraLightGreen dark:text-black hover:bg-mainDarkGreen dark:hover:bg-lightGreen md:w-fit w-full flex items-center justify-center gap-2 transition-all text-white p-4 rounded-xl"
                onClick={() => handleReadMore(data.id)}
              ></Button>
            </div>
          </div>
          <div
            className={`w-20 h-0.5 bg-lightGreen2 flex items-center justify-center`}
          ></div>
        </div>
      </div>
    );
  };

  const handleReadMore = (id) => {
    navigate(`/artikel/${id}`);
  };

  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  if (loading) {
    return (
      <div className="md:p-4 p-2 dark:bg-black bg-whiteGrays min-h-screen flex justify-center items-center">
        <div className="p-8 w-full min-h-screen flex items-center justify-center bg-white dark:bg-blackHover rounded-xl">
          <ProgressSpinner />
        </div>
      </div>
    );
  }

  if (isConnectionError) {
    return <ErrorConnection fetchData={fetchData} />;
  }

  if (!login) {
    return (
      <div className="md:p-4 p-2 dark:bg-black bg-whiteGrays h-screen flex justify-center items-center">
        <div className="p-8 w-full h-full flex flex-col items-center justify-center bg-white dark:bg-blackHover rounded-xl">
          <div className="flex h-screen flex-col items-center justify-center text-center font-bold gap-3 text-3xl">
            Login Untuk Akses
            <p className="font-medium text-xl">
              Lakukan login terlebih dahulu untuk melihat data.
            </p>
            <Button
              label="Login"
              onClick={() => navigate("/pengguna/login")}
              className="bg-mainGreen py-2 dark:bg-extraLightGreen dark:text-black hover:bg-mainDarkGreen dark:hover:bg-lightGreen  md:w-auto flex items-center justify-center gap-2 transition-all text-white p-4 rounded-xl"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="md:p-4 p-2 dark:bg-black bg-whiteGrays min-h-screen max-h-fit w-full md:max-w-screen ">
      <div className="min-h-screen max-h-fit bg-white dark:bg-blackHover rounded-xl">
        {data.length > 0 ? (
          <div className="flex flex-col  h-full md:py-5 md:px-40">
            <div className="flex flex-col md:flex-row md:justify-between p-6 pb-4  items-center justify-center gap-4">
              <div className="p-inputgroup md:w-1/4 w-full">
                <span className="p-inputgroup-addon bg-grays dark:bg-darkGrays">
                  <Search size={16} />
                </span>
                <InputText
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="p-inputtext-sm p-2"
                />
              </div>

              <Dropdown
                value={sortOrder}
                options={sortOptions}
                onChange={(e) => setSortOrder(e.value)}
                placeholder="Pilih dan Urutkan"
              />
            </div>
            <DataView
              value={sortData()}
              itemTemplate={itemTemplate}
              paginator={sortData().length > rows}
              rows={rows}
              first={first}
              onPage={onPageChange}
              emptyMessage={
                <div className="text-center text-gray-500 dark:text-gray-400">
                  Tidak ada data
                </div>
              }
              totalRecords={sortData().length}
            />
          </div>
        ) : (
          <div className="flex  h-screen flex-col items-center justify-center text-center font-bold gap-3 text-3xl  ">
            <img src={img} className="w-52" alt="img" />
            <div>
              Belum Ada Data
              <p className="font-medium text-xl">
                Data akan muncul di sini ketika tersedia.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
