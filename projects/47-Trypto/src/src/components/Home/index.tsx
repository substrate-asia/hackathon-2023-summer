import { useEffect, useState } from "react";
import StudioRoomImg from "../../assets/landing-bg.png";
import Avatar9 from "../../assets/avatar/9.png";
import Avatar1 from "../../assets/avatar/1.png";
import Avatar2 from "../../assets/avatar/2.png";
import Avatar3 from "../../assets/avatar/3.png";
import Avatar4 from "../../assets/avatar/4.png";
import Avatar5 from "../../assets/avatar/5.png";
import Avatar6 from "../../assets/avatar/6.png";
import Avatar7 from "../../assets/avatar/7.png";
import Avatar8 from "../../assets/avatar/8.png";
import Dots from "../../assets/dots.svg";
import DaoICon from "../../assets/icons/dao.svg";
import DepinIcon from "../../assets/icons/depin.svg";
import AIIcon from "../../assets/icons/ai.svg";
import WalletIcon from "../../assets/icons/empty-wallet.svg";
import { BaseButton, ServiceCard } from "../Global";
import { animateScroll as scroll, scroller, Link, Element } from "react-scroll";
import { web3Accounts, web3Enable } from "@polkadot/extension-dapp";
import { useNavigate } from "react-router-dom";

import AOS from "aos";
import "aos/dist/aos.css";
import MenuIcon from "../../assets/icons/menu-icon.svg";

AOS.init({
  once: false,
  mirror: true,
  offset: 120,
  easing: "ease",
});

const scrollTo = () => {
  scroller.scrollTo("scroll-to-element", {
    duration: 800,
    delay: 0,
    smooth: "easeInOutQuart",
  });
};

export const Home = () => {
  const [isActive, setActive] = useState(false);
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      await web3Enable("Trypto");
      const allAccounts = await web3Accounts();
      navigate("/DeMap", { state: { users: allAccounts } });
    } catch (error) {
      console.log(error);
    }
  };

  const onClickMenu = () => {
    setActive(!isActive);
  };
  return (
    <div className="bg-white font-averta h-full ">
      <div className="container   overflow-x-hidden px-5 scroll-smooth md:mx-auto">
        <div className="flex flex-wrap items-center justify-between w-full py-8">
          <h1 className="font-bold text-2xl">Trypto</h1>
          <div>
            <img
              loading="lazy"
              onClick={() => onClickMenu()}
              className="h-6 w-6 cursor-pointer md:hidden block"
              src={MenuIcon}
            />
          </div>
          <div
            className={`${
              !isActive ? "hidden" : null
            } w-full md:flex md:items-center md:w-auto`}
          >
            <ul className="flex flex-col md:flex-row space-y-4 md:space-y-0 pt-5">
              <li className="mr-10 cursor-pointer">
                <Link
                  to="home"
                  spy={true}
                  smooth={true}
                  duration={500}
                  onClick={() => scrollTo()}
                >
                  Home
                </Link>
              </li>
              <li className="mr-10 cursor-pointer">
                <Link
                  to="services"
                  spy={true}
                  smooth={true}
                  duration={500}
                  onClick={() => scrollTo()}
                >
                  What We Do
                </Link>
              </li>
              <li className="mr-10 cursor-pointer">
                <Link
                  to="services"
                  spy={true}
                  smooth={true}
                  duration={500}
                  onClick={() => scrollTo()}
                >
                  Tech
                </Link>
              </li>

              <li className="mr-10 cursor-pointer">
                <Link
                  to="contact"
                  spy={true}
                  smooth={true}
                  duration={500}
                  onClick={() => scrollTo()}
                >
                  Blog
                </Link>
              </li>
              <li className="mr-10 cursor-pointer">
                <Link
                  to="Dapp"
                  spy={true}
                  smooth={true}
                  duration={500}
                  onClick={() => scrollTo()}
                >
                  Dapp
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="bg-white font-averta h-full ">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 md:gap-4 items-center">
            <div className="col-span-5 relative">
              <div className="relative z-20">
                <div
                  data-aos="fade-up"
                  data-aos-duration="500"
                  className="text-black text-5xl"
                >
                  <b>The Safeguard of Web3 Communication and Collaboration</b>
                </div>
                <div
                  data-aos="fade-up"
                  data-aos-duration="1000"
                  className="py-10 w-full lg:w-3/5"
                >
                  <p className="text-sx text-[26px] font-bold text-[#565656]">
                    - Privacy
                  </p>
                  <p className="text-sx text-[26px] font-bold text-[#565656]">
                    - Collaboration
                  </p>
                  <p className="text-sx text-[26px] font-bold text-[#565656]">
                    - Sharing
                  </p>
                </div>
                <div data-aos="fade-down" data-aos-duration="1500">
                  <button
                    className={`bg-primary text-white text-sm py-3 lg:py-5 px-5 lg:px-10 rounded-full whitespace-nowrap text-sx text-[18px] font-light text-[#fcf7f7]}`}
                    onClick={handleClick}
                  >
                    Use DeMap
                  </button>
                </div>
              </div>
              <div className="absolute -bottom-28 z-10 -left-20">
                <img src={Dots} />
              </div>
            </div>
            <div className="col-span-7 relative pt-10">
              <div className="h-40 w-40 rounded-full bg-[#DAE9FF] absolute -left-20 z-10"></div>
              <div
                data-aos="fade-left"
                data-aos-duration="1000"
                className="relative z-20 "
              >
                <img
                  loading="lazy"
                  src={StudioRoomImg}
                  alt=""
                  className="rounded-tr-2xl"
                />
              </div>
              <div className="h-40 w-40 bg-[#FFF5DB] rounded-br-[100px] absolute right-20 -bottom-24 z-10"></div>
            </div>
          </div>
          <div>
            <section id="services" className="relative">
              <div className="absolute w-[1047px] h-[619px] bg-[#F4F9FF] rounded-tl-[150px] -right-[5vw]"></div>
              <div className="flex  flex-col lg:flex-row items-center justify-between w-full pt-40">
                <div className="relative z-20">
                  <div
                    data-aos="fade-up"
                    data-aos-duration="500"
                    className="text-black text-4xl"
                  >
                    How can we help your in Blockchain ?
                  </div>
                  <div className="absolute -bottom-28 -left-22 z-index-negative">
                    <img loading="lazy" src={Dots} />
                  </div>
                  <br />
                  <p
                    className="text-grey"
                    data-aos="fade-up"
                    data-aos-duration="1000"
                  >
                    {" "}
                    We provide secure and efficient identity-based encrypted
                    secret sharing services
                  </p>
                </div>
                <div className="flex items-center justify-center w-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                    <div className="flex flex-col space-y-8 mt-20">
                      <ServiceCard
                        className="pt-0 lg:pt-20"
                        color="bg-[#F1F7FF]"
                        icon={DaoICon}
                        title="DAO Infrastructure"
                        subtitle="Dao organizations can use Trypto to freely and fairly manage members and private content"
                      />
                      <ServiceCard
                        icon={WalletIcon}
                        color="bg-[#FFF2F8]"
                        title="Multi-Party Secure Wallet"
                        subtitle="Trypto can provide multi-user wallet services to enterprise users, supporting multi-signature and single-signature for a single wallet"
                      />
                    </div>
                    <div className="flex flex-col space-y-8">
                      <ServiceCard
                        className="pt-20"
                        color="bg-[#FFF7E3]"
                        icon={AIIcon}
                        title="Access Security for AI"
                        subtitle="Trypto can provide data privacy and efficient access security to all kinds of AI application scenarios"
                      />
                      <ServiceCard
                        icon={DepinIcon}
                        color="bg-[#DEFFEE]"
                        title="Depin"
                        subtitle="Depin networks involve a lot of communication, storage and system incentives, and the Trypto protocol is expected to provide efficient and secure services for depin."
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="pt-40">
              <div className="flex justify-center">
                <div>
                  <div
                    data-aos="fade-up"
                    data-aos-delay="500"
                    className="text-black text-4xl"
                  >
                    What the Trypto protocol is doing
                  </div>
                  {/* <p
                  data-aos="fade-up"
                  data-aos-delay="700"
                  className="text-grey pt-5"
                >
                  Several selected clients, who already believe in our service.
                </p> */}
                </div>
              </div>
              {/* Testimonals */}
              <div className="flex flex-col space-x-2 justify-between lg:flex-row h-full w-full items-center pt-10">
                <div className="w-full lg:w-2/3">
                  <div className="flex flex-col space-y-5 lg:space-y-0 lg:flex-row items-center space-x-10">
                    <div
                      data-aos="fade-up"
                      data-aos-duration="1000"
                      className="w-2/3 lg:w-full"
                    >
                      <div className="relative">
                        <img
                          loading="lazy"
                          src={Avatar9}
                          className="rounded-br-full relative rounded-bl-full rounded-tl-full z-10"
                          alt=""
                        />
                        <div className="absolute bottom-2">
                          <div className="w-[120px] h-[120px] border-8 border-[#3340a0] rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    <div className="w-full">
                      {/* <div
                      data-aos="fade-left"
                      data-aos-delay="500"
                      className="font-normal text-sm leading-relaxed text-[#565656] pt-5"
                    >
                    </div> */}
                      <div
                        data-aos="fade-right"
                        data-aos-delay="500"
                        className="text-black font-bold text-xl"
                      >
                        #Access Control #Content distribution #Task distribution
                        #Community #Communication #Distributed storage #DID
                        #Secret Sharing
                      </div>
                      <div className="pt-[40px]">
                        <div className="h-4 w-4 rounded-full bg-blue-700"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-[340px] relative">
                  <div className="animate-spin-slow relative z-20">
                    <div className=" w-[600px] h-[415px]">
                      <div className="absolute left-[40%] ">
                        <div className="animate-neg-spin-slow">
                          <img loading="lazy" src={Avatar1} alt="" />
                        </div>
                      </div>
                      <div className="absolute top-[20%]">
                        <div className="animate-neg-spin-slow">
                          <img
                            src={Avatar5}
                            className="w-[78px] h-[78px]"
                            alt=""
                          />
                        </div>
                      </div>
                      <div className="absolute top-[60%]">
                        <div className="animate-neg-spin-slow">
                          <img
                            src={Avatar3}
                            className="w-[68px] h-[68px]"
                            alt=""
                          />
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-[30%]">
                        <div className="animate-neg-spin-slow">
                          <img
                            src={Avatar6}
                            className="w-[64px] h-[65px]"
                            alt=""
                          />
                        </div>
                      </div>
                      <div className="absolute bottom-[20%] right-[10%]">
                        <div className="animate-neg-spin-slow">
                          <img
                            src={Avatar7}
                            className="w-[68px] h-[68px]"
                            alt=""
                          />
                        </div>
                      </div>
                      <div className="absolute top-[15%] right-[10%]">
                        <div className="animate-neg-spin-slow">
                          <img
                            src={Avatar4}
                            className="w-[54px] h-[54px]"
                            alt=""
                          />
                        </div>
                      </div>
                      <div className="absolute top-[40%] right-0">
                        <div className="animate-neg-spin-slow">
                          <img
                            src={Avatar2}
                            className="w-[54px] h-[54px]"
                            alt=""
                          />
                        </div>
                      </div>
                      <div className="absolute top-[40%] right-0">
                        <div className="animate-neg-spin-slow">
                          <img
                            src={Avatar2}
                            className="w-[54px] h-[54px]"
                            alt=""
                          />
                        </div>
                      </div>
                      <div className="absolute top-[50%] left-[50%] -mt-[50px] -ml-[50px]">
                        <div className="animate-neg-spin-slow">
                          <img
                            src={Avatar8}
                            className="w-[120px] h-[120px]"
                            alt=""
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-16 left-10">
                    <div className="w-[184px] h-[184px] rounded-full bg-[#FFF5DB]"></div>
                  </div>
                </div>
              </div>
            </section>

            <section className="pt-40">
              <Element name="dapp">
                <div className="relative h-[292px]">
                  <div className="border-0 rounded-3xl h-full  bg-[#F4F9FF] rounded-br-0 rounded-tr-0 lg:rounded-br-[100px] lg:rounded-tr-[100px]">
                    <div className="flex">
                      <div className="w-full"></div>
                      <div className="w-full">
                        <div className="flex justify-end">
                          <div className="h-[292px] rounded-br-[100px] rounded-tr-[100px] rounded-tl-[190px] rounded-bl-[240px] w-3/4 bg-blue-700 hidden lg:block"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute z-10 top-0 h-full w-full">
                    <div className="flex flex-col lg:flex-row w-full items-center h-full justify-around">
                      <div className="flex flex-col space-y-4">
                        <div
                          data-aos="fade-up"
                          data-aos-delay="500"
                          className="text-4xl font-extrabold"
                        >
                          Subscribe Newsletter
                        </div>
                        <div
                          data-aos="fade-up"
                          data-aos-delay="700"
                          className="text-[#757575]"
                        >
                          I will update good news and promotion service not spam
                        </div>
                      </div>
                      <div className="w-full lg:w-1/2">
                        <div
                          data-aos="fade-up"
                          className="flex items-center space-x-2 p-3 w-full rounded-full justify-between bg-white h-full shadow-3xl"
                        >
                          <div className="w-full h-full pl-4">
                            <input
                              className="w-full h-full focus:outline-0"
                              placeholder="Enter your email address..."
                            />
                          </div>
                          <div>
                            <BaseButton className="whitespace-nowrap">
                              Enter in
                            </BaseButton>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Element>
            </section>
            <section className="pt-40 pb-20">
              <div className="border-t border-b">
                <div className="pt-16 pb-16">
                  <div className="grid grid-cols-1 lg:grid-cols-6">
                    <div className="lg:col-span-2">
                      <div className="pb-7 font-black">Trypto</div>
                      <div className="w-2/3">
                        Trypto is a collaborative management system for secret
                        sharing based on personalized user profiles
                      </div>
                    </div>
                    <div>
                      <div className="font-black pb-7 pt-10 md:pt-0">
                        What We do
                      </div>
                      <div>
                        <ul className="font-thin text-xs leading-8">
                          <li>DAO Infrastructure</li>
                          <li>Multi-Party Secure Wallet</li>
                          <li>Access Security for AI</li>
                          <li>Depin</li>
                        </ul>
                      </div>
                    </div>
                    <div>
                      <div className="font-black pb-7 pt-10 md:pt-0">
                        Company
                      </div>
                      <div>
                        <ul className="font-thin text-xs leading-8">
                          <li>About Us</li>
                          <li>Career</li>
                          <li>Become Investor</li>
                        </ul>
                      </div>
                    </div>
                    <div>
                      <div className="font-black pb-7 pt-10 md:pt-0">
                        Support
                      </div>
                      <div>
                        <ul className="font-thin text-xs leading-8">
                          <li>FAQ</li>
                          <li>Policy</li>
                          <li>Business</li>
                        </ul>
                      </div>
                    </div>
                    <div>
                      <div className="font-black pb-7 pt-10 md:pt-0">
                        Contact
                      </div>
                      <div>
                        <ul className="font-thin text-xs leading-8">
                          <li>WhatsApp</li>
                          <li>Support 24</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
