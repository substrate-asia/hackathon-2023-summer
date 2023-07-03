import { dorahacks, oneblock, substrate } from "assets";

const Partners = [
  {
    img: dorahacks,
    className: "justify-self-start",
  },
  {
    img: oneblock,
    className: "justify-self-center",
  },
  {
    img: substrate,
    className: "justify-self-end",
  },
];
function Partner() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 mt-10 mb-20">
      <h2 className="text-center mb-20">
        <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
          <span className="whitespace-pre-wrap">Partner</span>
        </span>
      </h2>
      <div className="grid grid-cols-3 gap-20 auto-rows-max justify-between items-center ">
        {Partners.map((item, index) => {
          return (
            <img src={item.img} alt="" key={index} className={item.className} />
          );
        })}
      </div>
    </div>
  );
}

export default Partner;
