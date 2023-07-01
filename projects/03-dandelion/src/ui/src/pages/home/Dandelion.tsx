import { DANDELION_DESC } from "../../constants";
function Dandelion() {
  return (
    <div className=" relative z-10 mt-20">
      <h2 className="text-center mb-20">
        <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
          <span className="whitespace-pre-wrap">About Dandelion</span>
        </span>
      </h2>
      <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-20 lg:gap-8">
        {DANDELION_DESC.map((item, index) => {
          return (
            <li
              key={index}
              className="mb-16 sm:mb-0 rounded-3xl "
              data-aos="flip-left"
            >
              <div className="px-6 lg:px-7 pb-12">
                <h3 className="text-xl font-bold text-center sm:text-left ">
                  {item.title}
                </h3>
                <p className="my-2">{item.desc}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Dandelion;
