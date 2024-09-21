import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";
import ReusableTable from "../../../components/rousableTable/RousableTable";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../../config/context/AuthContext";
import { Toast } from "primereact/toast";
import ModalLoading from "/src/components/modalLoading/ModalLoading.jsx";
import { useNavigate } from "react-router-dom";
import { Editor } from "primereact/editor";
import ErrorConnection from "../../../components/errorConnection/ErrorConnection";
import { HandleUnauthorizedAdminPuskesmas } from "../../../utils/HandleUnauthorized";
import {
  handleApiError,
  handleDeleteError,
} from "../../../utils/ApiErrorHandlers";
import { ZodError } from "zod";
import {
  createArtikel,
  deleteArtikel,
  getAllArtikelByAdminPuskesmas,
  getArtikelById,
  updateArtikel,
} from "../../../services/ArtikelService";
import { artikelCreateSchema } from "../../../validations/ArtikelSchema";
import { InputTextarea } from "primereact/inputtextarea";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
import Quill from "quill";
import BlotFormatter from "quill-blot-formatter";
import { useCallback } from "react";
import { debounce } from "lodash";
import { Plus } from "lucide-react";
const DataArtikel = () => {
  const handleTextChange = useCallback(
    debounce((htmlValue) => {
      setDatas((prev) => ({
        ...prev,
        isi: htmlValue,
      }));
    }, 500),
    []
  );
  const ImageFormatAttributesList = ["height", "width", "style"];
  const allowedStyles = {
    display: ["inline"],
    float: ["left", "right"],
    margin: [],
  };
  const BaseImageFormat = Quill.import("formats/image");
  class ImageFormat extends BaseImageFormat {
    static formats(domNode) {
      const formats = {};
      ImageFormatAttributesList.forEach((attribute) => {
        if (domNode.hasAttribute(attribute)) {
          formats[attribute] = domNode.getAttribute(attribute);
        }
      });
      return formats;
    }
    format(name, value) {
      if (ImageFormatAttributesList.includes(name)) {
        if (name === "style" && value) {
          const styleEntries = value
            .split(";")
            .map((entry) => entry.trim())
            .filter(Boolean);
          const newStyles = {};

          styleEntries.forEach((entry) => {
            const [key, val] = entry.split(":").map((item) => item.trim());
            if (
              allowedStyles[key] &&
              (allowedStyles[key].length === 0 ||
                allowedStyles[key].includes(val))
            ) {
              newStyles[key] = val;
            }
          });
          const styleString = Object.entries(newStyles)
            .map(([key, val]) => `${key}: ${val}`)
            .join("; ");
          this.domNode.setAttribute("style", styleString);
        } else if (value) {
          this.domNode.setAttribute(name, value);
        } else {
          this.domNode.removeAttribute(name);
        }
      } else {
        super.format(name, value);
      }
    }
  }
  Quill.register(ImageFormat, true);
  Quill.register("modules/blotFormatter", BlotFormatter);

  const [beforeModalLoading, setBeforeModalLoading] = useState(false);
  const { dispatch, token, id } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [datas, setDatas] = useState({
    judul: "",
    isi: "",
    ringkasan: "",
    banner: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const [currentName, setCurrentName] = useState("");
  const [errors, setErrors] = useState({});
  const toast = useRef(null);
  const title = "Artikel";
  const navigate = useNavigate();
  const [isConnectionError, setisConnectionError] = useState(false);
  const [isButtonLoading, setButtonLoading] = useState(null);
  const [visibleCropImage, setVisibleCropImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const imageRef = useRef(null);
  const cropperRef = useRef(null);

  const baseUrl = `${import.meta.env.VITE_API_BASE_URI}/static/`;

  const customSort = (a, b) => {
    if (a.status < b.status) return -1;
    if (a.status > b.status) return 1;
    if (a.tanggalPublikasi < b.tanggalPublikasi) return -1;
    if (a.tanggalPublikasi > b.tanggalPublikasi) return 1;
    return 0;
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getAllArtikelByAdminPuskesmas(id);
      const sortedData = response.sort(customSort);
      setData(sortedData);
      setLoading(false);
      setisConnectionError(false);
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
        setisConnectionError(true);
      }
      HandleUnauthorizedAdminPuskesmas(error.response, dispatch, navigate);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token, navigate, dispatch]);

  const handleModalCreate = () => {
    setErrors({});
    setCroppedImage(null);
    setSelectedImage(null);
    if (cropperRef.current) {
      cropperRef.current.destroy();
      cropperRef.current = null;
    }
    setDatas({
      judul: "",
      isi: "",
      ringkasan: "",
      banner: "",
    });
    setVisible(true);
    setIsEditMode(false);
  };

  const handleCreate = async () => {
    try {
      setButtonLoading(true);
      artikelCreateSchema.parse(datas);
      const formData = new FormData();
      formData.append("judul", datas.judul);
      formData.append("isi", datas.isi);
      formData.append("ringkasan", datas.ringkasan);
      if (datas.banner instanceof Blob) {
        formData.append("banner", datas.banner);
      }
      const response = await createArtikel(formData);

      if (response.status === 201) {
        toast.current.show({
          severity: "success",
          summary: "Berhasil",
          detail: "Data artikel ditambahkan",
          life: 3000,
        });
        setVisible(false);
        setButtonLoading(false);

        try {
          setLoading(true);
          const response = await getAllArtikelByAdminPuskesmas(id);
          const sortedData = response.sort(customSort);
          setData(sortedData);
          setLoading(false);
          setisConnectionError(false);
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
            setisConnectionError(true);
          }
          HandleUnauthorizedAdminPuskesmas(error.response, dispatch, navigate);
          setLoading(false);
        }
      }
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

  const handleModalUpdate = async (data) => {
    setBeforeModalLoading(true);
    setCroppedImage(null);
    setSelectedImage(null);
    if (cropperRef.current) {
      cropperRef.current.destroy();
      cropperRef.current = null;
    }
    setErrors({});
    try {
      const dataResponse = await getArtikelById(data.id);
      if (dataResponse.isi) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(dataResponse.isi, "text/html");

        doc.querySelectorAll("img").forEach((img) => {
          if (
            !img.src.startsWith("data:") &&
            !img.src.startsWith("http://localhost:3000/static/")
          ) {
            const imageName = img.src.split("/").pop();
            img.src = `http://localhost:3000/static/${imageName}`;
          }
        });

        dataResponse.isi = doc.body.innerHTML;
      }
      if (dataResponse) {
        setDatas({
          judul: dataResponse.judul,
          isi: dataResponse.isi,
          ringkasan: dataResponse.ringkasan,
          banner: dataResponse.banner,
        });
        setCurrentId(data.id);
        setIsEditMode(true);
        setVisible(true);
      }
    } catch (error) {
      HandleUnauthorizedAdminPuskesmas(error.response, dispatch, navigate);
      handleApiError(error, toast);
    }
    setBeforeModalLoading(false);
  };

  const handleUpdate = async () => {
    try {
      setButtonLoading(true);
      artikelCreateSchema.parse(datas);
      const parser = new DOMParser();
      const doc = parser.parseFromString(datas.isi, "text/html");

      doc.querySelectorAll("img").forEach((img) => {
        if (!img.src.startsWith("data:")) {
          const imageName = img.src.split("/").pop();
          img.src = imageName;
        }
      });

      datas.isi = doc.body.innerHTML;

      const response = await updateArtikel(currentId, datas);
      if (response.status === 200) {
        toast.current.show({
          severity: "success",
          summary: "Berhasil",
          detail: "Data artikel diperbarui",
          life: 3000,
        });
        setVisible(false);
        setButtonLoading(false);
        try {
          setLoading(true);
          const response = await getAllArtikelByAdminPuskesmas(id);
          const sortedData = response.sort(customSort);
          setData(sortedData);
          setLoading(false);
          setisConnectionError(false);
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
            setisConnectionError(true);
          }
          HandleUnauthorizedAdminPuskesmas(error.response, dispatch, navigate);
          setLoading(false);
        }
      }
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
  const handleModalDelete = async (data) => {
    setBeforeModalLoading(true);
    setCurrentId(data.id);
    setCurrentName(data.judul);
    setVisibleDelete(true);
    setBeforeModalLoading(false);
  };

  const handleDelete = async () => {
    try {
      setButtonLoading(true);
      const response = await deleteArtikel(currentId);
      if (response.status === 200) {
        setVisibleDelete(false);
        toast.current.show({
          severity: "success",
          summary: "Berhasil",
          detail: "Data artikel dihapus",
          life: 3000,
        });
        try {
          setLoading(true);
          const response = await getAllArtikelByAdminPuskesmas(id);
          const sortedData = response.sort(customSort);
          setData(sortedData);
          setLoading(false);
          setisConnectionError(false);
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
            setisConnectionError(true);
          }
          HandleUnauthorizedAdminPuskesmas(error.response, dispatch, navigate);
          setLoading(false);
        }
      }
    } catch (error) {
      HandleUnauthorizedAdminPuskesmas(error.response, dispatch, navigate);
      handleDeleteError(error, toast, title);
    } finally {
      setButtonLoading(false);
    }
  };

  useEffect(() => {
    if (selectedImage && imageRef.current) {
      if (!cropperRef.current) {
        cropperRef.current = new Cropper(imageRef.current, {
          aspectRatio: 1200 / 630,
          viewMode: 1,
          autoCropArea: 1,
          movable: true,
          zoomable: true,
          scalable: false,
          cropBoxMovable: true,
          cropBoxResizable: true,
          guides: true,
          highlight: true,
          background: true,
        });
      }
    }
  }, [selectedImage]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    const validFormats = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!validFormats.includes(file.type)) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Format gambar tidak valid",
      });
      setSelectedImage(null);
      return;
    }

    if (file.size > 500 * 1024) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail:
          "Ukuran gambar terlalu besar, compres atau ganti gambar terlebih dahulu",
      });
      setSelectedImage(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setVisibleCropImage(true);
      setCroppedImage(null);
      if (cropperRef.current) {
        cropperRef.current.destroy();
        cropperRef.current = null;
      }
      setSelectedImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleCrop = async () => {
    if (cropperRef.current) {
      const canvas = cropperRef.current.getCroppedCanvas({
        width: 1200,
        height: 630,
      });

      canvas.toBlob(
        async (blob) => {
          if (blob) {
            const file = new File([blob], "banner.jpg", {
              type: "image/jpeg",
            });

            setDatas((prev) => ({
              ...prev,
              banner: file,
            }));

            const previewUrl = URL.createObjectURL(blob);
            setCroppedImage(previewUrl);
          }
        },
        "image/jpeg",
        1
      );
    }

    setVisibleCropImage(false);
  };

  const handleCloseCropModal = () => {
    setVisibleCropImage(false);

    if (cropperRef.current) {
      cropperRef.current.destroy();
      cropperRef.current = null;
    }
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

        <select className="ql-size" aria-label="Font Size">
          <option value="small">Small</option>
          <option value="">Normal</option>
          <option value="large">Large</option>
          <option value="huge">Huge</option>
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
          value="bullet"
          aria-label="Bullet List"
        ></button>
        <button className="ql-indent" value="+1" aria-label="Indent"></button>
        <button className="ql-indent" value="-1" aria-label="Outdent"></button>
        <button className="ql-align" value="" aria-label="Left Align"></button>
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
        <button className="ql-image" aria-label="Insert Image"></button>
        <select className="ql-color" aria-label="Text Color"></select>
        <select
          className="ql-background"
          aria-label="Background Color"
        ></select>

        <button
          className="ql-script"
          value="sub"
          aria-label="Subscript"
        ></button>
        <button
          className="ql-script"
          value="super"
          aria-label="Superscript"
        ></button>

        <button className="ql-clean" aria-label="Clear Formatting"></button>
      </span>
    );
  };

  const header = renderHeader();

  if (loading)
    return (
      <div className="min-h-screen flex flex-col gap-4 p-4 z-10">
        <Toast
          ref={toast}
          position={window.innerWidth <= 767 ? "top-center" : "top-right"}
        />
        <div className="bg-white min-h-screen dark:bg-blackHover p-4 rounded-xl flex items-center justify-center">
          <ProgressSpinner />
        </div>
      </div>
    );

  if (isConnectionError) {
    return <ErrorConnection fetchData={fetchData} />;
  }

  const columns = [
    { header: "Judul", field: "judul" },
    { header: "Tanggal Publikasi", field: "tanggalPublikasi" },
    { header: "Ringkasan", field: "ringkasan" },
    { header: "Banner", field: "banner" },
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
        blockScroll={true}
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
            Ringkasan Artikel:
          </label>

          <InputTextarea
            type="text"
            placeholder="Ringkasan Artikel"
            className="p-input text-lg p-3  rounded"
            value={datas.ringkasan}
            onChange={(e) =>
              setDatas((prev) => ({
                ...prev,
                ringkasan: e.target.value,
              }))
            }
          />

          {errors.ringkasan && (
            <small className="p-error -mt-3 text-sm">{errors.ringkasan}</small>
          )}

          <label htmlFor="" className="-mb-3">
            Pilih Banner Artikel:
          </label>

          <div className="flex flex-col gap-4">
            <input
              id="file-upload"
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleImageChange}
              className="hidden"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex items-center w-28 justify-center px-4 py-2 bg-mainGreen text-white rounded-lg hover:bg-darkGreen transition-all"
            >
              <Plus size={32} />
            </label>

            {!croppedImage && datas.banner && isEditMode && (
              <img
                src={`${baseUrl}${datas.banner}`}
                alt="Banner"
                style={{ maxWidth: "100%" }}
              />
            )}

            {croppedImage && (
              <div>
                <h3>Hasil Cropping:</h3>
                <img
                  src={croppedImage}
                  alt="Cropped"
                  style={{ maxWidth: "100%" }}
                />
              </div>
            )}
          </div>

          <Editor
            value={datas.isi}
            headerTemplate={header}
            placeholder="Isi artikel..."
            onTextChange={(e) => handleTextChange(e.htmlValue)}
            className={`h-full`}
            modules={{
              blotFormatter: {},
            }}
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
        header="Preview Gambar"
        visible={visibleCropImage}
        className="md:w-1/2 w-full "
        onHide={handleCloseCropModal}
        blockScroll={true}
        onShow={() => {
          if (
            selectedImage &&
            imageRef.current &&
            cropperRef.current === null
          ) {
            cropperRef.current = new Cropper(imageRef.current, {
              aspectRatio: 1200 / 630,
              viewMode: 1,
              autoCropArea: 1,
              movable: true,
              zoomable: true,
              scalable: false,
              cropBoxMovable: true,
              cropBoxResizable: true,
              guides: true,
              highlight: true,
              background: true,
            });
          }
        }}
      >
        <div className="flex flex-col gap-8">
          <div>
            {selectedImage && (
              <img
                ref={imageRef}
                src={selectedImage}
                alt="Selected"
                style={{ maxWidth: "100%" }}
              />
            )}
          </div>
          <div className="flex gap-4 items-end justify-end">
            <Button
              label="Crop"
              onClick={handleCrop}
              className="bg-mainGreen text-white dark:bg-extraLightGreen dark:text-black hover:bg-mainDarkGreen dark:hover:bg-lightGreen p-4 w-full flex justify-center rounded-xl hover:mainGreen transition-all"
            />
          </div>
        </div>
      </Dialog>
      ;
      <Dialog
        header="Hapus Data Artikel"
        visible={visibleDelete}
        className="md:w-1/2 w-full "
        onHide={() => {
          if (!visibleDelete) return;
          setVisibleDelete(false);
        }}
        blockScroll={true}
      >
        <div className="flex flex-col gap-8">
          <div className="text-xl">
            Apakah anda yakin ingin menghapus data artikel dengan judul{" "}
            {currentName}?
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
