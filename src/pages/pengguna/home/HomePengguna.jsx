import img from "../../../assets/prbcare.svg";
const HomePengguna = () => {
  return (
    <div className="flex md:flex-row flex-col items-center md:justify-center min-h-screen h-fit dark:bg-black bg-whiteGrays dark:text-white md:px-40 px-4 gap-4">
      <div className="flex md:w-1/2 w-full">
        <div className="flex flex-col justify-start items-center gap-10 md:p-12 p-4">
          <img src={img} className="md:hidden mt-10 w-4/5" alt="img" />
          <h1 className="md:text-6xl text-4xl font-semibold text-center md:px-5 md:text-start dark:text-whiteHover">
            Kesehatan Anda, Diujung Jari Anda.
          </h1>
          <h3 className="text-xl text-center md:px-5 md:text-start">
            PRB Care adalah aplikasi yang dirancang untuk membantu Anda
            mengingatkan kapan harus mengambil obat ke apotek dan kapan harus
            melakukan kontrol kesehatan ke puskesmas.
          </h3>
        </div>
      </div>

      <img src={img} className="md:w-1/3 md:block hidden" alt="img" />
    </div>
  );
};

export default HomePengguna;
