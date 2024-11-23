import ReactMarquee from "react-fast-marquee";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";

const Marquee = ({ data }) => {
  const navigate = useNavigate();

  const handleClickButton = () => {
    navigate("/prolanis");
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-2 ">
      <ReactMarquee gradient={false} speed={50} className="border-y-[3px] py-2">
        {data.length > 0 ? (
          data.map((item, index) => (
            <div className="text-darkColor dark:text-whiteHover" key={index}>
              <h1 className="text-md ">
                {" "}
                | Jadwal Prolanis: {item.waktuMulai} - {item.waktuSelesai} di{" "}
                {item.adminPuskesmas.namaPuskesmas}{" "}
              </h1>
            </div>
          ))
        ) : (
          <div>Belum ada jadwal prolanis</div>
        )}
      </ReactMarquee>

      {data.length > 0 ? (
        <Button
          size="small"
          className="bg-mainGreen px-3 flex items-center justify-center"
          onClick={handleClickButton}
        >
          Selengkapnya
        </Button>
      ) : null}
    </div>
  );
};

export default Marquee;
