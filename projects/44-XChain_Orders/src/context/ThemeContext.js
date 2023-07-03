import React, { createContext, useEffect, useState } from "react";
import {dezThemeSet} from './ThemeDemo';

export const ThemeContext = createContext();

const ThemeContextProvider = (props) => {
	const [sideBarStyle, setSideBarStyle] = useState({ value: "full", label: "Full",});
	const [sidebarposition, setSidebarposition] = useState({ value: "fixed",	label: "Fixed",});
    const [headerposition, setHeaderposition] = useState({ value: "fixed", label: "Fixed", });
    const [sidebarLayout, setSidebarLayout] = useState({ value: "vertical", label: "Vertical",});
	const [direction, setDirection] = useState({ value: "ltr", label: "LTR" });
	const [primaryColor, setPrimaryColor] = useState("color_1");
	const [navigationHader, setNavigationHader] = useState("color_1");
	const [haderColor, setHaderColor] = useState("color_1");
	const [sidebarColor, setSidebarColor] = useState("color_1");
	const [iconHover, setIconHover] = useState(false);
	const [menuToggle, setMenuToggle] = useState(false);
	const [background, setBackground] = useState({ value: "light",	label: "Light",});
	const [containerPosition_, setcontainerPosition_] = useState({value: "wide-boxed", label: "Wide Boxed",});
    const body = document.querySelector("body");
    const [windowWidth, setWindowWidth] = useState(0);
    const [windowHeight, setWindowHeight] = useState(0);

  // layout
  const layoutOption = [
    { value: "vertical", label: "Vertical" },
    { value: "horizontal", label: "Horizontal" },
  ];
  const sideBarOption = [
    { value: "compact", label: "Compact" },
    { value: "full", label: "Full" },
    { value: "mini", label: "Mini" },
    { value: "modern", label: "Modern" },
    { value: "overlay", label: "Overlay" },
    { value: "icon-hover", label: "Icon-hover" },
  ];
  const backgroundOption = [
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
  ];
  const sidebarpositions = [
    { value: "fixed", label: "Fixed" },
    { value: "static", label: "Static" },
  ];
  const headerPositions = [
    { value: "fixed", label: "Fixed" },
    { value: "static", label: "Static" },
  ];
  const containerPosition = [
    { value: "wide-boxed", label: "Wide Boxed" },
    { value: "boxed", label: "Boxed" },
    { value: "wide", label: "Wide" },
  ];
  const colors = [
    "color_1", //spacegrey
    "color_2", //lightpurple
    "color_3", //cyan
    "color_4", //purple
    "color_5", //red
    "color_6", //orange
    "color_7", //yellow honey
    "color_8", //white
    "color_9", //green turquoise
    "color_10", //blue turqise
    "color_11", //ceramic
    "color_12", //grey
    "color_13", //dark grey
    "color_14", //blue
    "color_15", //green
    "color_16", //black
  ];
  const directionPosition = [
    { value: "ltr", label: "LTR" },
    { value: "rtl", label: "RTL" },
  ];
  const fontFamily = [
    { value: "poppins", label: "Poppins" },
    { value: "roboto", label: "Roboto" },
    { value: "cairo", label: "Cairo" },
    { value: "opensans", label: "Open Sans" },
    { value: "HelveticaNeue", label: "HelveticaNeue" },
  ];
  const changePrimaryColor = (name) => {
	setPrimaryColor(name);
    body.setAttribute("data-primary", name);
  };
  const changeNavigationHader = (name) => {
    setNavigationHader(name);
    body.setAttribute("data-nav-headerbg", name);
  };
  const chnageHaderColor = (name) => {
    setHaderColor(name);
    body.setAttribute("data-headerbg", name);
  };
  const chnageSidebarColor = (name) => {
    setSidebarColor(name);
    body.setAttribute("data-sibebarbg", name);
  };
  const changeSideBarPostion = (name) => {
    setSidebarposition(name);
    body.setAttribute("data-sidebar-position", name.value);
  };
  const changeDirectionLayout = (name) => {
    setDirection(name);
    body.setAttribute("direction", name.value);
    let html = document.querySelector("html");
    html.setAttribute("dir", name.value);
    html.className = name.value;
  };
  const changeSideBarLayout = (name) => {
    if (name.value === "horizontal") {
      if (sideBarStyle.value === "overlay") {
        setSidebarLayout(name);
        body.setAttribute("data-layout", name.value);
        setSideBarStyle({ value: "full", label: "Full" });
        body.setAttribute("data-sidebar-style", "full");
      } else {
        setSidebarLayout(name);
        body.setAttribute("data-layout", name.value);
      }
    } else {
      setSidebarLayout(name);
      body.setAttribute("data-layout", name.value);
    }
  };
  const changeSideBarStyle = (name) => {
    if (sidebarLayout.value === "horizontal") {
      if (name.value === "overlay") {
        alert("Sorry! Overlay is not possible in Horizontal layout.");
      } else {
        setSideBarStyle(name);
        setIconHover(name.value === "icon-hover" ? "_i-hover" : "");
        body.setAttribute("data-sidebar-style", name.value);
      }
    } else {
      setSideBarStyle(name);
      setIconHover(name.value === "icon-hover" ? "_i-hover" : "");
      body.setAttribute("data-sidebar-style", name.value);
    }
  };

  const changeHeaderPostion = (name) => {
    setHeaderposition(name);
    body.setAttribute("data-header-position", name.value);
  };

  const openMenuToggle = () => {
    sideBarStyle.value === "overly"
      ? setMenuToggle(true)
      : setMenuToggle(false);
  };

  const changeBackground = (name) => {
    body.setAttribute("data-theme-version", name.value);
    setBackground(name);
  };

  const changeContainerPosition = (name) => {
    setcontainerPosition_(name);
    body.setAttribute("data-container", name.value);
    name.value === "boxed" &&
      changeSideBarStyle({ value: "overlay", label: "Overlay" });
  };
  
  const setDemoTheme = (theme,direction) => {

	var setAttr = {};	
	
	
	var themeSettings = dezThemeSet[theme];	
		
	body.setAttribute("data-typography", themeSettings.typography);
 
	setAttr.value = themeSettings.version;
	changeBackground(setAttr);
	
	setAttr.value = themeSettings.layout;
	changeSideBarLayout(setAttr);
	
	changePrimaryColor(themeSettings.primary);
	
	changeNavigationHader(themeSettings.navheaderBg);
	
	chnageHaderColor(themeSettings.headerBg);
	
	setAttr.value = themeSettings.sidebarStyle;
	changeSideBarStyle(setAttr);
	
	chnageSidebarColor(themeSettings.sidebarBg);
	
	setAttr.value = themeSettings.sidebarPosition;
	changeSideBarPostion(setAttr);
	
	setAttr.value = themeSettings.headerPosition;
	changeHeaderPostion(setAttr);
	
	setAttr.value = themeSettings.containerLayout;
	changeContainerPosition(setAttr);
	
	setAttr.value = direction;
	changeDirectionLayout(setAttr); 
	
	};

  useEffect(() => {
	const body = document.querySelector("body");
    body.setAttribute("data-typography", "poppins");
    body.setAttribute("data-theme-version", "dark");
    body.setAttribute("data-layout", "vertical");
    body.setAttribute("data-primary", "color_1");
    body.setAttribute("data-headerbg", "color_1");
    body.setAttribute("data-nav-headerbg", "color_1");
    body.setAttribute("data-sidebar-style", "full");
    body.setAttribute("data-sibebarbg", "color_16");
    body.setAttribute("data-primary", "color_1");
    body.setAttribute("data-sidebar-position", "fixed");
    body.setAttribute("data-header-position", "fixed");
    body.setAttribute("data-container", "wide");
    body.setAttribute("direction", "ltr");

		let resizeWindow = () => {
			setWindowWidth(window.innerWidth);
			setWindowHeight(window.innerHeight);
			window.innerWidth >= 768 && window.innerWidth < 1024
			? body.setAttribute("data-sidebar-style", "mini")
			: window.innerWidth <= 768
			? body.setAttribute("data-sidebar-style", "overlay")
			: body.setAttribute("data-sidebar-style", "full");
		};
    resizeWindow();
    window.addEventListener("resize", resizeWindow);
    return () => window.removeEventListener("resize", resizeWindow);
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        body,
        sideBarOption,
        layoutOption,
        backgroundOption,
        sidebarposition,
        headerPositions,
        containerPosition,
        directionPosition,
        fontFamily,
		primaryColor,
        navigationHader,
		windowWidth,
		windowHeight,
        changePrimaryColor,
        changeNavigationHader,
        changeSideBarStyle,
        sideBarStyle,
        changeSideBarPostion,
        sidebarpositions,
        changeHeaderPostion,
        headerposition,
        changeSideBarLayout,
        sidebarLayout,
        changeDirectionLayout,
        changeContainerPosition,
        direction,
        colors,
        haderColor,
        chnageHaderColor,
        chnageSidebarColor,
        sidebarColor,
        iconHover,
        menuToggle,
        openMenuToggle,
        changeBackground,
        background,
        containerPosition_,
		setDemoTheme,
	}}
    >
      {props.children}
    </ThemeContext.Provider>
  );
};

export default ThemeContextProvider;


