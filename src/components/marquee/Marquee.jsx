import ReactMarquee from "react-fast-marquee";

const Marquee = () => {
  return (
    <ReactMarquee gradient={false} speed={50} className="border-y-[3px] py-2">
      <div className="text-darkColor dark:text-whiteHover">
        <h1 className="text-lg ">
          Jadwal Prolanis | 21 November 2024 | 08:00 | Puskesmas Magelang
        </h1>
      </div>
    </ReactMarquee>
  );
};

export default Marquee;
