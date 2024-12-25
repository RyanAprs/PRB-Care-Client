
import img from "../../assets/data_empty.png";
const EmptyData = () => {
    return (
        <div className="flex  h-screen flex-col items-center justify-center text-center font-bold gap-3 text-3xl  ">
              <img src={img} className="w-52" alt="img" />
              <div>
                Belum Ada Data
                <p className="font-medium text-xl">
                  Data akan muncul di sini ketika tersedia
                </p>
              </div>
            </div>
    )
}
export default EmptyData;