import ReactMarquee from "react-fast-marquee";

const Marquee = ({ data }) => {


  return (
    <div className="w-full flex flex-col md:flex-row gap-2 ">
      <ReactMarquee gradient={false} speed={50} className="border-y-[3px] py-2">
        {data.length > 0 ? (
          data.map((item, index) => (
            <div className="text-darkColor dark:text-whiteHover" key={index}>
              <h1 className="text-md">
                  {" "}
                  ‎ 📢 {item.adminPuskesmas.namaPuskesmas}: Jadwal prolanis mulai {item.waktuMulai} hingga {item.waktuSelesai + " "}
                  {" "}
              </h1>
            </div>
          ))
        ) : (
          <div>Belum ada jadwal prolanis</div>
        )}
      </ReactMarquee>
    </div>
  );
};

export default Marquee;
