import { useState, useEffect } from "react";
import { DataView } from "primereact/dataview";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { useNavigate } from "react-router-dom";
import img from "../../../assets/data_empty.png";
import { Dropdown } from "primereact/dropdown";

export default function Artikel() {
  const [artikel, setArtikel] = useState([]);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(3);
  const navigate = useNavigate();
  const [sortOrder, setSortOrder] = useState(1);
  const sortOptions = [
    { label: "Terbaru ke Terlama", value: 1 },
    { label: "Terlama ke Terbaru", value: 2 },
  ];

  useEffect(() => {
    const fetchArtikel = () => {
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

      if (sortOrder === 1) {
        data.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
      } else {
        data.sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));
      }

      setArtikel(data);
    };

    fetchArtikel();
  }, [sortOrder]);

  const itemTemplate = (article, index) => {
    const maxWords = 50;
    const truncatedIsi = article.isi.split(" ").slice(0, maxWords).join(" ");
    const isTruncated = article.isi.split(" ").length > maxWords;

    return (
      <div className="col-12" key={article.id}>
        <div
          className={classNames(
            "flex flex-col md:p-18 p-10 gap-4 items-center justify-center",
            { "border-top-1 surface-border": index !== 0 }
          )}
        >
          <div className="flex flex-col w-full justify-content-between align-items-center xl:align-items-start flex-1 md:gap-8 gap-4">
            <div className="flex flex-col align-items-center sm:align-items-start gap-3">
              <div className="md:text-5xl text-2xl font-semibold">
                {article.judul}
              </div>
              <div className="flex gap-2 justify-start items-center">
                <span className="text-xl">{article.penulis}</span>
                <span>-</span>
                <span className="text-xl">{article.tanggal}</span>
              </div>
              <p className="mt-2 md:text-2xl text-xl">
                {truncatedIsi}
                {isTruncated && "..."}
              </p>
            </div>
            <div className="flex sm:flex-col align-items-center sm:align-items-end gap-3 sm:gap-2">
              <Button
                label="Baca Selengkapnya"
                icon="pi pi-arrow-right"
                className="p-4 md:w-1/6 w-full bg-lightGreen2"
                onClick={() => handleReadMore(article.id)}
              ></Button>
            </div>
          </div>
          <div className="w-20 h-0.5 bg-lightGreen2 flex items-center justify-center"></div>
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

  return (
    <div className="md:p-4 p-2 dark:bg-black bg-whiteGrays min-h-screen max-h-fit">
      <div className="min-h-screen max-h-fit bg-white dark:bg-blackHover rounded-xl">
        {artikel.length > 0 ? (
          <div className="flex flex-col gap-4 overflow-y-auto h-full p-8">
            <div className="flex md:justify-end justify-center mb-4 gap-2">
              <Dropdown
                value={sortOrder}
                options={sortOptions}
                onChange={(e) => setSortOrder(e.value)}
                placeholder="Pilih dan Urutan"
              />
            </div>
            <DataView
              value={artikel}
              itemTemplate={itemTemplate}
              paginator
              rows={rows}
              first={first}
              onPage={onPageChange}
              totalRecords={artikel.length}
            />
          </div>
        ) : (
          <div className="flex flex-col p-1 gap-4 overflow-y-auto h-full">
            <div className="flex h-screen flex-col items-center justify-center text-center font-bold gap-3 text-3xl">
              <img src={img} className="w-52" alt="img" />
              <div>
                Belum Ada Data
                <p className="font-medium text-xl">
                  Data akan muncul di sini ketika tersedia.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
