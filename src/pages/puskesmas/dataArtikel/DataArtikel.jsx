import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";
import ReusableTable from "../../../components/rousableTable/RousableTable";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../../config/context/AuthContext";
import { Toast } from "primereact/toast";
import ModalLoading from "/src/components/modalLoading/ModalLoading.jsx";
import { useNavigate } from "react-router-dom";
import { convertHumanToUnix } from "../../../utils/DateConverter";
import { Editor } from "primereact/editor";
import ErrorConnection from "../../../components/errorConnection/ErrorConnection";
import { createArtikelSchema } from "../../../validations/ArtikelSchema";
import { HandleUnauthorizedAdminPuskesmas } from "../../../utils/HandleUnauthorized";
import { handleApiError } from "../../../utils/ApiErrorHandlers";
import { ZodError } from "zod";

const DataArtikel = () => {
  const [beforeModalLoading, setBeforeModalLoading] = useState(false);
  const { dispatch } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [datas, setDatas] = useState({
    judul: "",
    isi: "",
    tanggal: 0,
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const [errors, setErrors] = useState({});
  const toast = useRef(null);
  const title = "Artikel";
  const navigate = useNavigate();
  const [isConnectionError, setisConnectionError] = useState(false);
  const [isButtonLoading, setButtonLoading] = useState(null);
  const customSort = (a, b) => {
    if (a.status < b.status) return -1;
    if (a.status > b.status) return 1;
    if (a.tanggal < b.tanggal) return -1;
    if (a.tanggal > b.tanggal) return 1;
    return 0;
  };

  const fetchData = async () => {
    const data = [
      {
        id: 1,
        judul: "Judul Artikel 1 ANJAY GURINJAY KURA-KURA NINJAY WKWKWKK",
        penulis: "John Doe",
        tanggal: "2022-01-01",
        isi: "Lorem ipsum odor amet, consectetuer adipiscing elit. Primis netus ultrices rutrum donec magna congue consequat enim. Fusce semper habitant himenaeos sodales eu. Aliquam convallis ut efficitur feugiat fringilla. Commodo bibendum placerat netus molestie ac fusce ipsum. Gravida ipsum mauris tellus mauris, tempor sollicitudin ante convallis potenti. Curabitur iaculis malesuada maecenas odio fusce in.",
      },
      {
        id: 2,
        judul: "Judul Artikel 2",
        penulis: "John Doe",
        tanggal: "2022-02-02",
        isi: "Lorem ipsum odor amet, consectetuer adipiscing elit. Primis netus ultrices rutrum donec magna congue consequat enim. Fusce semper habitant himenaeos sodales eu. Aliquam convallis ut efficitur feugiat fringilla. Commodo bibendum placerat netus molestie ac fusce ipsum. Gravida ipsum mauris tellus mauris, tempor sollicitudin ante convallis potenti. Curabitur iaculis malesuada maecenas odio fusce in.",
      },
      {
        id: 3,
        judul: "Judul Artikel 3",
        penulis: "John Doe",
        tanggal: "2022-03-03",
        isi: "Lorem ipsum odor amet, consectetuer adipiscing elit. Primis netus ultrices rutrum donec magna congue consequat enim. Fusce semper habitant himenaeos sodales eu. Aliquam convallis ut efficitur feugiat fringilla. Commodo bibendum placerat netus molestie ac fusce ipsum. Gravida ipsum mauris tellus mauris, tempor sollicitudin ante convallis potenti. Curabitur iaculis malesuada maecenas odio fusce in.",
      },
      {
        id: 4,
        judul: "Judul Artikel 4",
        penulis: "John Doe",
        tanggal: "2022-04-04",
        isi: "Lorem ipsum odor amet, consectetuer adipiscing elit. Primis netus ultrices rutrum donec magna congue consequat enim. Fusce semper habitant himenaeos sodales eu. Aliquam convallis ut efficitur feugiat fringilla. Commodo bibendum placerat netus molestie ac fusce ipsum. Gravida ipsum mauris tellus mauris, tempor sollicitudin ante convallis potenti. Curabitur iaculis malesuada maecenas odio fusce in.",
      },
      {
        id: 5,
        judul: "Judul Artikel 5",
        penulis: "John Doe",
        tanggal: "2022-05-05",
        isi: "Lorem ipsum odor amet, consectetuer adipiscing elit. Primis netus ultrices rutrum donec magna congue consequat enim. Fusce semper habitant himenaeos sodales eu. Aliquam convallis ut efficitur feugiat fringilla. Commodo bibendum placerat netus molestie ac fusce ipsum. Gravida ipsum mauris tellus mauris, tempor sollicitudin ante convallis potenti. Curabitur iaculis malesuada maecenas odio fusce in.",
      },
    ];
    setData(data);
  };

  useEffect(() => {
    fetchData();
  });

  const handleModalCreate = () => {
    setErrors({});
    setSelectedDate(null);
    setDatas({
      judul: "",
      isi: "",
      tanggal: 0,
    });
    setVisible(true);
    setIsEditMode(false);
  };

  const handleCreate = async () => {
    console.log(datas);

    try {
      //   setButtonLoading(true);
      createArtikelSchema.parse(datas);
      //   const response = await createPasien(datas);
      //   if (response.status === 201) {
      //     toast.current.show({
      //       severity: "success",
      //       summary: "Berhasil",
      //       detail: "Data pasien ditambahkan",
      //       life: 3000,
      //     });
      //     setVisible(false);
      //     setButtonLoading(false);
      //     try {
      //       setLoading(true);
      //       const response = await getAllPasien();
      //       const sortedData = response.sort(customSort);
      //       setData(sortedData);
      //       setLoading(false);
      //       setisConnectionError(false);
      //     } catch (error) {
      //       if (
      //         error.code === "ERR_NETWORK" ||
      //         error.code === "ETIMEDOUT" ||
      //         error.code === "ECONNABORTED" ||
      //         error.code === "ENOTFOUND" ||
      //         error.code === "ECONNREFUSED" ||
      //         error.code === "EAI_AGAIN" ||
      //         error.code === "EHOSTUNREACH" ||
      //         error.code === "ECONNRESET" ||
      //         error.code === "EPIPE"
      //       ) {
      //         setisConnectionError(true);
      //       }
      //       HandleUnauthorizedAdminPuskesmas(error.response, dispatch, navigate);
      //       setLoading(false);
      //     }
      //   }
    } catch (error) {
      setButtonLoading(false);
      if (error instanceof ZodError) {
        const newErrors = {};
        error.errors.forEach((e) => {
          newErrors[e.path[0]] = e.message;
        });
        setErrors(newErrors);
      } else {
        setVisible(false);
        HandleUnauthorizedAdminPuskesmas(error.response, dispatch, navigate);
        handleApiError(error, toast);
      }
    }
  };

  const handleModalUpdate = () => {};

  const handleUpdate = () => {};

  const handleModalDelete = () => {};

  const handleDelete = () => {};

  const handleCalendarChange = (e) => {
    setSelectedDate(e.value);
    const unixTimestamp = convertHumanToUnix(e.value);
    setDatas((prev) => ({
      ...prev,
      tanggal: unixTimestamp,
    }));
  };

  const renderHeader = () => {
    return (
      <span className="ql-formats">
        <select className="ql-header" aria-label="Heading">
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
          <option value="4">Heading 4</option>
          <option value="5">Heading 5</option>
          <option value="6">Heading 6</option>
          <option value="">Normal</option>
        </select>
        <button className="ql-bold" aria-label="Bold"></button>
        <button className="ql-italic" aria-label="Italic"></button>
        <button className="ql-underline" aria-label="Underline"></button>
        <button className="ql-strike" aria-label="Strike-through"></button>
        <button className="ql-blockquote" aria-label="Blockquote"></button>
        <button className="ql-code-block" aria-label="Code Block"></button>
        <button
          className="ql-list"
          value="ordered"
          aria-label="Ordered List"
        ></button>
        <button
          className="ql-list"
          value="bulleted"
          aria-label="Bullet List"
        ></button>
        <button
          className="ql-align"
          value="center"
          aria-label="Center Align"
        ></button>
        <button
          className="ql-align"
          value="right"
          aria-label="Right Align"
        ></button>
        <button
          className="ql-align"
          value="justify"
          aria-label="Justify"
        ></button>
        <button className="ql-link" aria-label="Link"></button>
      </span>
    );
  };

  const header = renderHeader();

  //   if (loading)
  //     return (
  //       <div className="min-h-screen flex flex-col gap-4 p-4 z-10 ">
  //         <Toast
  //           ref={toast}
  //           position={window.innerWidth <= 767 ? "top-center" : "top-right"}
  //         />
  //         <div className="bg-white min-h-screen dark:bg-blackHover p-4 rounded-xl flex items-center justify-center">
  //           <ProgressSpinner />
  //         </div>
  //       </div>
  //     );

  //   if (isConnectionError) {
  //     return <ErrorConnection fetchData={fetchData} />;
  //   }

  const columns = [
    { header: "Judul", field: "judul" },
    { header: "Tanggal", field: "tanggal" },
    { header: "Isi", field: "isi" },
  ];

  return (
    <div className="min-h-screen flex flex-col gap-4 p-4 z-10 ">
      <Toast
        ref={toast}
        position={window.innerWidth <= 767 ? "top-center" : "top-right"}
      />
      <ModalLoading className={beforeModalLoading ? `` : `hidden`} />
      <div className="bg-white min-h-screen dark:bg-blackHover rounded-xl">
        <ReusableTable
          columns={columns}
          data={data}
          onCreate={handleModalCreate}
          onEdit={handleModalUpdate}
          onDelete={handleModalDelete}
        />
      </div>
      <Dialog
        header={isEditMode ? "Ubah Data Artikel" : "Tambah Data Artikel"}
        visible={visible}
        maximizable
        className="md:w-1/2 w-full "
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
      >
        <div className="flex flex-col p-4 gap-4">
          <label htmlFor="" className="-mb-3">
            Judul Artikel:
          </label>

          <InputText
            type="text"
            placeholder="Judul Artikel"
            className="p-input text-lg p-3  rounded"
            value={datas.judul}
            onChange={(e) =>
              setDatas((prev) => ({
                ...prev,
                judul: e.target.value,
              }))
            }
          />
          {errors.judul && (
            <small className="p-error -mt-3 text-sm">{errors.judul}</small>
          )}

          <label htmlFor="" className="-mb-3">
            Tanggal:
          </label>

          <Calendar
            id="buttondisplay"
            className="p-input text-lg rounded"
            placeholder="Pilih Tanggal"
            value={selectedDate}
            onChange={handleCalendarChange}
            showIcon
            locale="id"
            showButtonBar
            readOnlyInput
            hideOnRangeSelection
          />

          {errors.tanggal && (
            <small className="p-error -mt-3 text-sm">{errors.tanggal}</small>
          )}

          <Editor
            value={datas.isi}
            headerTemplate={header}
            placeholder="Tulis artikel..."
            onTextChange={(e) =>
              setDatas((prev) => ({
                ...prev,
                isi: e.htmlValue,
              }))
            }
            style={{ height: "320px" }}
          />

          {errors.isi && (
            <small className="p-error -mt-3 text-sm">{errors.isi}</small>
          )}
          <Button
            disabled={isButtonLoading}
            className="bg-mainGreen text-white dark:bg-extraLightGreen dark:text-black hover:bg-mainDarkGreen dark:hover:bg-lightGreen p-4 w-full flex justify-center rounded-xl hover:mainGreen transition-all"
            onClick={isEditMode ? handleUpdate : handleCreate}
          >
            {isButtonLoading ? (
              <ProgressSpinner
                style={{ width: "24px", height: "24px" }}
                strokeWidth="8"
                animationDuration="1s"
                color="white"
              />
            ) : (
              <p>{isEditMode ? "Edit" : "Simpan"}</p>
            )}
          </Button>
        </div>
      </Dialog>

      <Dialog
        header="Hapus Data Artikel"
        visible={visibleDelete}
        className="md:w-1/2 w-full "
        onHide={() => {
          if (!visibleDelete) return;
          setVisibleDelete(false);
        }}
      >
        <div className="flex flex-col gap-8">
          <div className="text-xl">
            Apakah anda yakin ingin menghapus data artikel ini?
          </div>
          <div className="flex gap-4 items-end justify-end">
            <Button
              label="Batal"
              onClick={() => setVisibleDelete(false)}
              className="p-button-text text-mainGreen dark:text-extraLightGreen hover:text-mainDarkGreen dark:hover:text-lightGreen rounded-xl transition-all"
            />
            <Button
              disabled={isButtonLoading}
              className="bg-mainGreen w-[85px] items-center justify-center text-white dark:bg-extraLightGreen dark:text-black hover:bg-mainDarkGreen dark:hover:bg-lightGreen flex rounded-xl transition-all"
              onClick={handleDelete}
            >
              {isButtonLoading ? (
                <ProgressSpinner
                  style={{ width: "24px", height: "24px" }}
                  strokeWidth="8"
                  animationDuration="1s"
                  color="white"
                />
              ) : (
                <p>Hapus</p>
              )}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default DataArtikel;
