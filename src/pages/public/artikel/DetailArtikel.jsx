import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getArtikelById } from "../../../services/ArtikelService";
import { AuthContext } from "../../../config/context/AuthContext";
import { ProgressSpinner } from "primereact/progressspinner";
import ErrorConnection from "../../../components/errorConnection/ErrorConnection";
import NotFound from "../../NotFound";
import { convertUnixToHuman } from "../../../utils/DateConverter";
import { Editor } from "primereact/editor";
import Quill from "quill";

const preloadQuill = () => {
  return import("quill");
};
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

const baseUrl = `${import.meta.env.VITE_API_BASE_URI}/static/`;

const DetailArtikel = () => {
  const { id } = useParams();
  const { token, dispatch } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [isConnectionError, setIsConnectionError] = useState(false);
  const [data, setData] = useState({});
  const [isNotfound, setIsNotFound] = useState(false);
  const [quillLoaded, setQuillLoaded] = useState(false);

  useEffect(() => {
    preloadQuill().then(() => setQuillLoaded(true));
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getArtikelById(id);
      if (response.isi) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(response.isi, "text/html");

        doc.querySelectorAll("img").forEach((img) => {
          if (!img.src.startsWith("data:") && !img.src.startsWith(baseUrl)) {
            const imageName = img.src.split("/").pop();
            img.src = baseUrl + imageName;
          }
        });

        response.isi = doc.body.innerHTML;
      }
      setData(response);
      setLoading(false);
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
        } else if (
          error.response.status === 404 ||
          error.response.status === 500 ||
          error.response.status === 400
        ) {
          setIsNotFound(true);
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

  if (loading || !quillLoaded) {
    return (
      <div className="md:p-4 p-2 dark:bg-black bg-whiteGrays min-h-screen flex justify-center items-center">
        <div className="p-8 w-full min-h-screen flex items-center justify-center bg-white dark:bg-blackHover rounded-xl">
          <ProgressSpinner />
        </div>
      </div>
    );
  }

  if (isNotfound) {
    return <NotFound />;
  }

  if (isConnectionError) {
    return <ErrorConnection fetchData={fetchData} />;
  }

  const tanggal = convertUnixToHuman(data.tanggalPublikasi);

  const editorModules = {
    toolbar: false,
  };

  return (
    <div className="md:p-4 p-2 dark:bg-black bg-whiteGrays min-h-screen text-[#495057] dark:text-white max-h-fit">
      <div className="min-h-screen max-h-fit bg-white dark:bg-blackHover rounded-xl p-6 md:p-10 md:px-48">
        <div className="flex flex-col w-full justify-content-center align-items-center flex-1 md:gap-4 gap-2">

          <div className="md:text-6xl text-4xl  font-semibold">
            {data.judul}
          </div>
          <div className="flex md:flex-row flex-col md:gap-2 justify-start md:items-center items-start">
            <span className="text-lg">{data.adminPuskesmas.namaPuskesmas}</span>
            <span className={`md:block hidden`}>-</span>
            <span className="text-lg text-justify ">
                  {tanggal}
                </span>
          </div>
          <div
              className={`h-0.5 border-[#495057] border-b-2 dark:border-white`}
          ></div>
          {data.banner && (
              <div className="flex flex-col gap-2 md:gap-4">

                <div className=" w-full h-full flex justify-center items-center">
                  <img
                      src={`${baseUrl}${data.banner}`}
                      alt={data.judul}
                      className="object-cover w-full h-full"
                  />
                </div>

                <div
                    className={`h-0.5 border-[#495057] border-b-2 dark:border-white`}
                ></div>
              </div>

          )}

          <div className="w-full ">
            <Editor
              className={`text-black dark:text-white`}
              value={data.isi}
              readOnly={true}
              style={{ height: "auto" }}
              modules={editorModules}
              headerTemplate={<></>}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailArtikel;
