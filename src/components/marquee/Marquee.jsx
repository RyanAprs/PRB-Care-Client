import ReactMarquee from "react-fast-marquee";

const Marquee = ({ data }) => {
  return (
    <div className={`w-full flex-col md:flex-row gap-2 ${data.length > 0 ? "flex":"hidden"}` }>
      <ReactMarquee gradient={false} speed={50} className={`border-y-[3px] py-2`}>
          {data.map((item, index) => (
              <div className="text-darkColor break-all dark:text-whiteHover" key={index}>
                  <h1 className="text-md ">
                      {" "}
                      ‎ 📢 Jadwal prolanis {item.adminPuskesmas.namaPuskesmas} mulai {item.waktuMulai} hingga {item.waktuSelesai + " "}
                      {" "}
                  </h1>
              </div>
          ))}
      </ReactMarquee>
    </div>
  );
};

export default Marquee;
