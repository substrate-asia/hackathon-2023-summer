/*
 * @Description:
 * @Autor: fage
 * @Date: 2022-08-01 17:24:18
 * @LastEditors: chenbinfa
 * @LastEditTime: 2022-08-03 09:39:07
 * @description: 描述信息
 * @author: chenbinfa
 */
export default function ({ hash, title, onClick }) {
	if (!hash || hash.length < 3) {
		hash = "cXa";
	}
	let n = hash.substring(hash.length - 1).toLowerCase();
	const obj = {};
	obj["0"] = (
		<svg className="account-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
			<path
				fill="#464646"
				d="M7.8 4.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M12.8 4.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M12.8 19.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M7.8 19.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M2.8 9.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M17.8 9.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M17.8 14.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M2.8 14.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0"></path>
			<path fill="#5b5b5b" d="M12 7L7 7L7 2ZM12 7L12 2L17 2ZM12 17L17 17L17 22ZM12 17L12 22L7 22ZM7 12L2 12L2 7ZM17 12L17 7L22 7ZM17 12L22 12L22 17ZM7 12L7 17L2 17Z"></path>
			<path
				fill="#3d6cb7"
				d="M7.8 4.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M12.8 4.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M12.8 19.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M7.8 19.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M2.8 9.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M17.8 9.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M17.8 14.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M2.8 14.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0"></path>
		</svg>
	);
	obj["1"] = (
		<svg className="account-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
			<path
				fill="#3d6cb7"
				d="M7.8 4.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M12.8 4.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M12.8 19.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M7.8 19.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M2.8 9.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M17.8 9.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M17.8 14.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M2.8 14.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0"></path>
			<path
				fill="#84a6d6"
				d="M2.8 4.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M17.8 4.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M17.8 19.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M2.8 19.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M7 7L12 7L12 7.8L9.9 12L7 12ZM17 7L17 12L16.2 12L12 9.9L12 7ZM17 17L12 17L12 16.2L14.1 12L17 12ZM7 17L7 12L7.8 12L12 14.1L12 17Z"></path>
			<path
				fill="#464646"
				d="M7.8 4.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M12.8 4.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M12.8 19.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M7.8 19.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M2.8 9.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M17.8 9.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M17.8 14.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M2.8 14.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0"></path>
		</svg>
	);
	obj["2"] = (
		<svg className="account-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
			<path
				fill="#84a6d6"
				d="M2.8 4.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M17.8 4.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M17.8 19.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M2.8 19.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M7 7L12 7L12 7.8L9.9 12L7 12ZM17 7L17 12L16.2 12L12 9.9L12 7ZM17 17L12 17L12 16.2L14.1 12L17 12ZM7 17L7 12L7.8 12L12 14.1L12 17Z"></path>
			<path
				fill="#464646"
				d="M7.8 4.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M12.8 4.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M12.8 19.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M7.8 19.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M2.8 9.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M17.8 9.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M17.8 14.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M2.8 14.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0"></path>
			<path fill="#5b5b5b" d="M12 7L7 7L7 2ZM12 7L12 2L17 2ZM12 17L17 17L17 22ZM12 17L12 22L7 22ZM7 12L2 12L2 7ZM17 12L17 7L22 7ZM17 12L22 12L22 17ZM7 12L7 17L2 17Z"></path>
		</svg>
	);
	obj["3"] = (
		<svg className="account-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
			<path
				fill="#464646"
				d="M7.8 4.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M12.8 4.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M12.8 19.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M7.8 19.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M2.8 9.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M17.8 9.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M17.8 14.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M2.8 14.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0"></path>
		</svg>
	);
	obj["4"] = (
		<svg className="account-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
			<path
				fill="#cee5b2"
				d="M7 7L12 7L12 12L7 12ZM8.8 10.1a1.3,1.3 0 1,0 2.6,0a1.3,1.3 0 1,0 -2.6,0M17 7L17 12L12 12L12 7ZM12.6 10.1a1.3,1.3 0 1,0 2.6,0a1.3,1.3 0 1,0 -2.6,0M17 17L12 17L12 12L17 12ZM12.6 13.9a1.3,1.3 0 1,0 2.6,0a1.3,1.3 0 1,0 -2.6,0M7 17L7 12L12 12L12 17ZM8.8 13.9a1.3,1.3 0 1,0 2.6,0a1.3,1.3 0 1,0 -2.6,0"></path>
			<path fill="#5b5b5b" d="M12 7L7 7L7 2ZM12 7L12 2L17 2ZM12 17L17 17L17 22ZM12 17L12 22L7 22ZM7 12L2 12L2 7ZM17 12L17 7L22 7ZM17 12L22 12L22 17ZM7 12L7 17L2 17Z"></path>
		</svg>
	);
	obj["5"] = (
		<svg className="account-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
			<path
				fill="#c2cc66"
				d="M7 2L7 7L2 7ZM22 7L17 7L17 2ZM17 22L17 17L22 17ZM2 17L7 17L7 22ZM7 7L12 7L12 10.5L9 9L10.5 12L7 12ZM17 7L17 12L13.5 12L15 9L12 10.5L12 7ZM17 17L12 17L12 13.5L15 15L13.5 12L17 12ZM7 17L7 12L10.5 12L9 15L12 13.5L12 17Z"></path>
			<path
				fill="#e0e5b2"
				d="M7.8 4.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M12.8 4.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M12.8 19.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M7.8 19.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M2.8 9.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M17.8 9.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M17.8 14.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M2.8 14.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0"></path>
			<path
				fill="#59c7ba"
				d="M2 4.5L4.5 2L7 4.5L4.5 7ZM19.5 2L22 4.5L19.5 7L17 4.5ZM22 19.5L19.5 22L17 19.5L19.5 17ZM4.5 22L2 19.5L4.5 17L7 19.5ZM7 7L12 7L12 7.8L9.9 12L7 12ZM17 7L17 12L16.2 12L12 9.9L12 7ZM17 17L12 17L12 16.2L14.1 12L17 12ZM7 17L7 12L7.8 12L12 14.1L12 17Z"></path>
		</svg>
	);
	obj["6"] = (
		<svg className="account-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
			<path fill="#b7e5b2" d="M7 7L12 7L12 7.8L9.9 12L7 12ZM17 7L17 12L16.2 12L12 9.9L12 7ZM17 17L12 17L12 16.2L14.1 12L17 12ZM7 17L7 12L7.8 12L12 14.1L12 17Z"></path>
			<path
				fill="#eaeaea"
				d="M7.8 4.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M12.8 4.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M12.8 19.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M7.8 19.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M2.8 9.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M17.8 9.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M17.8 14.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M2.8 14.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0"></path>
		</svg>
	);
	obj["7"] = (
		<svg className="account-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
			<path
				fill="#d17586"
				d="M7 7L7 2L12 2ZM12 2L17 2L17 7ZM17 17L17 22L12 22ZM12 22L7 22L7 17ZM2 12L2 7L7 7ZM17 7L22 7L22 12ZM22 12L22 17L17 17ZM7 17L2 17L2 12ZM7 7L12 7L12 7.8L9.9 12L7 12ZM17 7L17 12L16.2 12L12 9.9L12 7ZM17 17L12 17L12 16.2L14.1 12L17 12ZM7 17L7 12L7.8 12L12 14.1L12 17Z"></path>
			<path fill="#e8e8e8" d="M7 7L2 7L2 2ZM17 7L17 2L22 2ZM17 17L22 17L22 22ZM7 17L7 22L2 22Z"></path>
			<path
				fill="#70cc66"
				d="M12 7L7 7L7 2ZM12 7L12 2L17 2ZM12 17L17 17L17 22ZM12 17L12 22L7 22ZM7 12L2 12L2 7ZM17 12L17 7L22 7ZM17 12L22 12L22 17ZM7 12L7 17L2 17ZM7 2L7 7L2 7ZM22 7L17 7L17 2ZM17 22L17 17L22 17ZM2 17L7 17L7 22Z"></path>
		</svg>
	);
	obj["8"] = (
		<svg className="account-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
			<path
				fill="#59c7c4"
				d="M2.8 4.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M17.8 4.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M17.8 19.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M2.8 19.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M8 8L12 8L12 12L8 12ZM16 8L16 12L12 12L12 8ZM16 16L12 16L12 12L16 12ZM8 16L8 12L12 12L12 16Z"></path>
		</svg>
	);
	obj["9"] = (
		<svg className="account-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
			<path fill="#e5ccb2" d="M12 2L12 7L7 7ZM17 7L12 7L12 2ZM12 22L12 17L17 17ZM7 17L12 17L12 22ZM7 7L7 12L2 12ZM22 12L17 12L17 7ZM17 17L17 12L22 12ZM2 12L7 12L7 17Z"></path>
			<path
				fill="#a6cc66"
				d="M7 4.5L4.5 7L2 4.5L4.5 2ZM19.5 7L17 4.5L19.5 2L22 4.5ZM17 19.5L19.5 17L22 19.5L19.5 22ZM4.5 17L7 19.5L4.5 22L2 19.5ZM7 7L12 7L12 10.5L9 9L10.5 12L7 12ZM17 7L17 12L13.5 12L15 9L12 10.5L12 7ZM17 17L12 17L12 13.5L15 15L13.5 12L17 12ZM7 17L7 12L10.5 12L9 15L12 13.5L12 17Z"></path>
			<path fill="#a8389d" d="M7 7L12 7L12 7.8L9.9 12L7 12ZM17 7L17 12L16.2 12L12 9.9L12 7ZM17 17L12 17L12 16.2L14.1 12L17 12ZM7 17L7 12L7.8 12L12 14.1L12 17Z"></path>
		</svg>
	);
	obj.a = (
		<svg className="account-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
			<path fill="#e5ccb2" d="M12 2L12 7L7 7ZM17 7L12 7L12 2ZM12 22L12 17L17 17ZM7 17L12 17L12 22ZM7 7L7 12L2 12ZM22 12L17 12L17 7ZM17 17L17 12L22 12ZM2 12L7 12L7 17Z"></path>
			<path
				fill="#cc9966"
				d="M2 7L2 2L4.5 2ZM17 2L22 2L22 4.5ZM22 17L22 22L19.5 22ZM7 22L2 22L2 19.5ZM8 8L12 8L12 12L8 12ZM16 8L16 12L12 12L12 8ZM16 16L12 16L12 12L16 12ZM8 16L8 12L12 12L12 16Z"></path>
		</svg>
	);
	obj.b = (
		<svg className="account-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
			<path
				fill="#d17586"
				d="M7 7L7 2L12 2ZM12 2L17 2L17 7ZM17 17L17 22L12 22ZM12 22L7 22L7 17ZM2 12L2 7L7 7ZM17 7L22 7L22 12ZM22 12L22 17L17 17ZM7 17L2 17L2 12ZM7 7L12 7L12 7.8L9.9 12L7 12ZM17 7L17 12L16.2 12L12 9.9L12 7ZM17 17L12 17L12 16.2L14.1 12L17 12ZM7 17L7 12L7.8 12L12 14.1L12 17Z"></path>
			<path fill="#e8e8e8" d="M7 7L2 7L2 2ZM17 7L17 2L22 2ZM17 17L22 17L22 22ZM7 17L7 22L2 22Z"></path>
		</svg>
	);
	obj.c = (
		<svg className="account-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
			<path
				fill="#a6cc66"
				d="M7 4.5L4.5 7L2 4.5L4.5 2ZM19.5 7L17 4.5L19.5 2L22 4.5ZM17 19.5L19.5 17L22 19.5L19.5 22ZM4.5 17L7 19.5L4.5 22L2 19.5ZM7 7L12 7L12 10.5L9 9L10.5 12L7 12ZM17 7L17 12L13.5 12L15 9L12 10.5L12 7ZM17 17L12 17L12 13.5L15 15L13.5 12L17 12ZM7 17L7 12L10.5 12L9 15L12 13.5L12 17Z"></path>
			<path fill="#a8389d" d="M7 7L12 7L12 7.8L9.9 12L7 12ZM17 7L17 12L16.2 12L12 9.9L12 7ZM17 17L12 17L12 16.2L14.1 12L17 12ZM7 17L7 12L7.8 12L12 14.1L12 17Z"></path>
		</svg>
	);
	obj.d = (
		<svg className="account-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
			<path
				fill="#d175c8"
				d="M7.8 4.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M12.8 4.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M12.8 19.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M7.8 19.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M2.8 9.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M17.8 9.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M17.8 14.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M2.8 14.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0"></path>
			<path fill="#e8e8e8" d="M7 7L2 7L2 4.5ZM17 7L17 2L19.5 2ZM17 17L22 17L22 19.5ZM7 17L7 22L4.5 22Z"></path>
			<path fill="#a8389d" d="M7 7L12 7L12 7.8L9.9 12L7 12ZM17 7L17 12L16.2 12L12 9.9L12 7ZM17 17L12 17L12 16.2L14.1 12L17 12ZM7 17L7 12L7.8 12L12 14.1L12 17Z"></path>
		</svg>
	);
	obj.e = (
		<svg className="account-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
			<path fill="#e5ccb2" d="M12 2L12 7L7 7ZM17 7L12 7L12 2ZM12 22L12 17L17 17ZM7 17L12 17L12 22ZM7 7L7 12L2 12ZM22 12L17 12L17 7ZM17 17L17 12L22 12ZM2 12L7 12L7 17Z"></path>
			<path
				fill="#cc9966"
				d="M2 7L2 2L4.5 2ZM17 2L22 2L22 4.5ZM22 17L22 22L19.5 22ZM7 22L2 22L2 19.5ZM8 8L12 8L12 12L8 12ZM16 8L16 12L12 12L12 8ZM16 16L12 16L12 12L16 12ZM8 16L8 12L12 12L12 16Z"></path>
		</svg>
	);
	obj.f = (
		<svg className="account-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
			<path
				fill="#d2e5b2"
				d="M12 2L12 7L9.5 7ZM17 7L12 7L12 4.5ZM12 22L12 17L14.5 17ZM7 17L12 17L12 19.5ZM7 7L7 12L4.5 12ZM22 12L17 12L17 9.5ZM17 17L17 12L19.5 12ZM2 12L7 12L7 14.5Z"></path>
			<path
				fill="#a6cc66"
				d="M7 4.5L4.5 7L2 4.5L4.5 2ZM19.5 7L17 4.5L19.5 2L22 4.5ZM17 19.5L19.5 17L22 19.5L19.5 22ZM4.5 17L7 19.5L4.5 22L2 19.5ZM7 7L12 7L12 10.5L9 9L10.5 12L7 12ZM17 7L17 12L13.5 12L15 9L12 10.5L12 7ZM17 17L12 17L12 13.5L15 15L13.5 12L17 12ZM7 17L7 12L10.5 12L9 15L12 13.5L12 17Z"></path>
		</svg>
	);
	obj.g = (
		<svg className="account-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
			<path
				fill="#d175c8"
				d="M7.8 4.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M12.8 4.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M12.8 19.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M7.8 19.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M2.8 9.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M17.8 9.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M17.8 14.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M2.8 14.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0"></path>
			<path fill="#e8e8e8" d="M7 7L2 7L2 4.5ZM17 7L17 2L19.5 2ZM17 17L22 17L22 19.5ZM7 17L7 22L4.5 22Z"></path>
			<path fill="#a8389d" d="M7 7L12 7L12 7.8L9.9 12L7 12ZM17 7L17 12L16.2 12L12 9.9L12 7ZM17 17L12 17L12 16.2L14.1 12L17 12ZM7 17L7 12L7.8 12L12 14.1L12 17Z"></path>
		</svg>
	);
	obj.h = (
		<svg className="account-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
			<path
				fill="#e3e3e3"
				d="M7.8 4.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M12.8 4.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M12.8 19.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M7.8 19.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M2.8 9.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M17.8 9.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M17.8 14.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M2.8 14.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0"></path>
			<path
				fill="#59c7c4"
				d="M2.8 4.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M17.8 4.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M17.8 19.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M2.8 19.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M8 8L12 8L12 12L8 12ZM16 8L16 12L12 12L12 8ZM16 16L12 16L12 12L16 12ZM8 16L8 12L12 12L12 16Z"></path>
		</svg>
	);
	obj.i = (
		<svg className="account-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
			<path fill="#e5ccb2" d="M12 2L12 7L7 7ZM17 7L12 7L12 2ZM12 22L12 17L17 17ZM7 17L12 17L12 22ZM7 7L7 12L2 12ZM22 12L17 12L17 7ZM17 17L17 12L22 12ZM2 12L7 12L7 17Z"></path>
			<path
				fill="#cc9966"
				d="M2 7L2 2L4.5 2ZM17 2L22 2L22 4.5ZM22 17L22 22L19.5 22ZM7 22L2 22L2 19.5ZM8 8L12 8L12 12L8 12ZM16 8L16 12L12 12L12 8ZM16 16L12 16L12 12L16 12ZM8 16L8 12L12 12L12 16Z"></path>
		</svg>
	);
	obj.j = (
		<svg
			className="account-icon"
			height="24"
			id="12ixt2xmCJKuLXjM3gh1SY7C3aj4gBoBUqExTBTGhLCSATFw"
			name="12ixt2xmCJKuLXjM3gh1SY7C3aj4gBoBUqExTBTGhLCSATFw"
			viewBox="0 0 64 64"
			width="24">
			<circle cx="32" cy="32" fill="#eee" r="32"></circle>
			<circle cx="32" cy="8" fill="hsl(28, 56%, 75%)" r="5"></circle>
			<circle cx="32" cy="20" fill="hsl(320, 56%, 35%)" r="5"></circle>
			<circle cx="21.607695154586736" cy="14" fill="hsl(174, 56%, 53%)" r="5"></circle>
			<circle cx="11.215390309173472" cy="20" fill="hsl(123, 56%, 53%)" r="5"></circle>
			<circle cx="21.607695154586736" cy="26" fill="hsl(168, 56%, 35%)" r="5"></circle>
			<circle cx="11.215390309173472" cy="32" fill="hsl(236, 56%, 35%)" r="5"></circle>
			<circle cx="11.215390309173472" cy="44" fill="hsl(22, 56%, 53%)" r="5"></circle>
			<circle cx="21.607695154586736" cy="38" fill="hsl(11, 56%, 15%)" r="5"></circle>
			<circle cx="21.607695154586736" cy="50" fill="hsl(236, 56%, 35%)" r="5"></circle>
			<circle cx="32" cy="56" fill="hsl(123, 56%, 53%)" r="5"></circle>
			<circle cx="32" cy="44" fill="hsl(168, 56%, 35%)" r="5"></circle>
			<circle cx="42.392304845413264" cy="50" fill="hsl(174, 56%, 53%)" r="5"></circle>
			<circle cx="52.78460969082653" cy="44" fill="hsl(28, 56%, 75%)" r="5"></circle>
			<circle cx="42.392304845413264" cy="38" fill="hsl(320, 56%, 35%)" r="5"></circle>
			<circle cx="52.78460969082653" cy="32" fill="hsl(315, 56%, 53%)" r="5"></circle>
			<circle cx="52.78460969082653" cy="20" fill="hsl(275, 56%, 53%)" r="5"></circle>
			<circle cx="42.392304845413264" cy="26" fill="hsl(140, 56%, 15%)" r="5"></circle>
			<circle cx="42.392304845413264" cy="14" fill="hsl(315, 56%, 53%)" r="5"></circle>
			<circle cx="32" cy="32" fill="hsl(247, 56%, 15%)" r="5"></circle>
		</svg>
	);
	obj.k = (
		<svg
			className="account-icon"
			height="24"
			id="12ixt2xmCJKuLXjM3gh1SY7C3aj4gBoBUqExTBTGhLCSATFw"
			name="12ixt2xmCJKuLXjM3gh1SY7C3aj4gBoBUqExTBTGhLCSATFw"
			viewBox="0 0 64 64"
			width="24">
			<circle cx="32" cy="32" fill="#eee" r="32"></circle>
			<circle cx="32" cy="8" fill="hsl(28, 56%, 75%)" r="5"></circle>
			<circle cx="32" cy="20" fill="hsl(320, 56%, 35%)" r="5"></circle>
			<circle cx="21.607695154586736" cy="14" fill="hsl(174, 56%, 53%)" r="5"></circle>
			<circle cx="11.215390309173472" cy="20" fill="hsl(123, 56%, 53%)" r="5"></circle>
			<circle cx="21.607695154586736" cy="26" fill="hsl(168, 56%, 35%)" r="5"></circle>
			<circle cx="11.215390309173472" cy="32" fill="hsl(236, 56%, 35%)" r="5"></circle>
			<circle cx="11.215390309173472" cy="44" fill="hsl(22, 56%, 53%)" r="5"></circle>
			<circle cx="21.607695154586736" cy="38" fill="hsl(11, 56%, 15%)" r="5"></circle>
			<circle cx="21.607695154586736" cy="50" fill="hsl(236, 56%, 35%)" r="5"></circle>
			<circle cx="32" cy="56" fill="hsl(123, 56%, 53%)" r="5"></circle>
			<circle cx="32" cy="44" fill="hsl(168, 56%, 35%)" r="5"></circle>
			<circle cx="42.392304845413264" cy="50" fill="hsl(174, 56%, 53%)" r="5"></circle>
			<circle cx="52.78460969082653" cy="44" fill="hsl(28, 56%, 75%)" r="5"></circle>
			<circle cx="42.392304845413264" cy="38" fill="hsl(320, 56%, 35%)" r="5"></circle>
			<circle cx="52.78460969082653" cy="32" fill="hsl(315, 56%, 53%)" r="5"></circle>
			<circle cx="52.78460969082653" cy="20" fill="hsl(275, 56%, 53%)" r="5"></circle>
			<circle cx="42.392304845413264" cy="26" fill="hsl(140, 56%, 15%)" r="5"></circle>
			<circle cx="42.392304845413264" cy="14" fill="hsl(315, 56%, 53%)" r="5"></circle>
			<circle cx="32" cy="32" fill="hsl(247, 56%, 15%)" r="5"></circle>
		</svg>
	);
	obj.l = (
		<svg
			className="account-icon"
			height="24"
			id="15X2eHehrexKqz6Bs6fQTjptP2ndn39eYdQTeREVeRk32p54"
			name="15X2eHehrexKqz6Bs6fQTjptP2ndn39eYdQTeREVeRk32p54"
			viewBox="0 0 64 64"
			width="24">
			<circle cx="32" cy="32" fill="#eee" r="32"></circle>
			<circle cx="32" cy="8" fill="hsl(163, 81%, 53%)" r="5"></circle>
			<circle cx="32" cy="20" fill="hsl(253, 81%, 75%)" r="5"></circle>
			<circle cx="21.607695154586736" cy="14" fill="hsl(11, 81%, 75%)" r="5"></circle>
			<circle cx="11.215390309173472" cy="20" fill="hsl(185, 81%, 53%)" r="5"></circle>
			<circle cx="21.607695154586736" cy="26" fill="hsl(286, 81%, 53%)" r="5"></circle>
			<circle cx="11.215390309173472" cy="32" fill="hsl(61, 81%, 53%)" r="5"></circle>
			<circle cx="11.215390309173472" cy="44" fill="hsl(185, 81%, 53%)" r="5"></circle>
			<circle cx="21.607695154586736" cy="38" fill="hsl(286, 81%, 53%)" r="5"></circle>
			<circle cx="21.607695154586736" cy="50" fill="hsl(11, 81%, 75%)" r="5"></circle>
			<circle cx="32" cy="56" fill="hsl(163, 81%, 53%)" r="5"></circle>
			<circle cx="32" cy="44" fill="hsl(253, 81%, 75%)" r="5"></circle>
			<circle cx="42.392304845413264" cy="50" fill="hsl(112, 81%, 15%)" r="5"></circle>
			<circle cx="52.78460969082653" cy="44" fill="hsl(191, 81%, 53%)" r="5"></circle>
			<circle cx="42.392304845413264" cy="38" fill="hsl(337, 81%, 15%)" r="5"></circle>
			<circle cx="52.78460969082653" cy="32" fill="hsl(129, 81%, 35%)" r="5"></circle>
			<circle cx="52.78460969082653" cy="20" fill="hsl(191, 81%, 53%)" r="5"></circle>
			<circle cx="42.392304845413264" cy="26" fill="hsl(337, 81%, 15%)" r="5"></circle>
			<circle cx="42.392304845413264" cy="14" fill="hsl(112, 81%, 15%)" r="5"></circle>
			<circle cx="32" cy="32" fill="hsl(61, 81%, 75%)" r="5"></circle>
		</svg>
	);
	obj.m = (
		<svg className="account-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
			<path fill="#a838a4" d="M7 2L12 2L12 7ZM17 2L17 7L12 7ZM17 22L12 22L12 17ZM7 22L7 17L12 17ZM2 7L7 7L7 12ZM22 7L22 12L17 12ZM22 17L17 17L17 12ZM2 17L2 12L7 12Z"></path>
			<path fill="#d175cd" d="M2 2L7 2L7 7ZM22 2L22 7L17 7ZM22 22L17 22L17 17ZM2 22L2 17L7 17ZM9 12a3,3 0 1,1 6,0a3,3 0 1,1 -6,0"></path>
		</svg>
	);
	obj.n = (
		<svg className="account-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
			<path
				fill="#4c4c4c"
				d="M7.8 4.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M12.8 4.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M12.8 19.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M7.8 19.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M2.8 9.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M17.8 9.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M17.8 14.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M2.8 14.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0"></path>
			<path
				fill="#91cc66"
				d="M2 2L7 2L7 7ZM22 2L22 7L17 7ZM22 22L17 22L17 17ZM2 22L2 17L7 17ZM7 7L12 7L12 10.5L9 9L10.5 12L7 12ZM17 7L17 12L13.5 12L15 9L12 10.5L12 7ZM17 17L12 17L12 13.5L15 15L13.5 12L17 12ZM7 17L7 12L10.5 12L9 15L12 13.5L12 17Z"></path>
		</svg>
	);
	obj.o = (
		<svg className="account-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
			<path fill="#2e8c79" d="M12 7L7 7L7 2ZM12 7L12 2L17 2ZM12 17L17 17L17 22ZM12 17L12 22L7 22ZM7 12L2 12L2 7ZM17 12L17 7L22 7ZM17 12L22 12L22 17ZM7 12L7 17L2 17Z"></path>
			<path fill="#59c7b0" d="M2 7L2 2L7 2ZM17 2L22 2L22 7ZM22 17L22 22L17 22ZM7 22L2 22L2 17Z"></path>
			<path fill="#e3e3e3" d="M7 7L12 7L12 7.8L9.9 12L7 12ZM17 7L17 12L16.2 12L12 9.9L12 7ZM17 17L12 17L12 16.2L14.1 12L17 12ZM7 17L7 12L7.8 12L12 14.1L12 17Z"></path>
		</svg>
	);
	obj.p = (
		<svg className="account-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
			<path
				fill="#b9cc66"
				d="M7 7L7 2L9.5 2ZM12 2L17 2L17 4.5ZM17 17L17 22L14.5 22ZM12 22L7 22L7 19.5ZM2 12L2 7L4.5 7ZM17 7L22 7L22 9.5ZM22 12L22 17L19.5 17ZM7 17L2 17L2 14.5ZM7 7L12 7L12 12L7 12ZM8.3 10.1L10.1 12L12 10.1L10.1 8.3ZM17 7L17 12L12 12L12 7ZM13.9 8.3L12 10.1L13.9 12L15.8 10.1ZM17 17L12 17L12 12L17 12ZM15.8 13.9L13.9 12L12 13.9L13.9 15.8ZM7 17L7 12L12 12L12 17ZM10.1 15.8L12 13.9L10.1 12L8.3 13.9Z"></path>
			<path
				fill="#dce5b2"
				d="M2.8 4.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M17.8 4.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M17.8 19.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M2.8 19.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0"></path>
		</svg>
	);
	obj.q = (
		<svg className="account-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
			<path fill="#4c4c4c" d="M7 7L7 2L12 2ZM12 2L17 2L17 7ZM17 17L17 22L12 22ZM12 22L7 22L7 17ZM2 12L2 7L7 7ZM17 7L22 7L22 12ZM22 12L22 17L17 17ZM7 17L2 17L2 12Z"></path>
			<path fill="#66cc7b" d="M7 2L7 7L2 7ZM22 7L17 7L17 2ZM17 22L17 17L22 17ZM2 17L7 17L7 22Z"></path>
			<path
				fill="#b2e5bd"
				d="M7 7L12 7L12 9.5L7 9.5ZM7 9.5L9.5 9.5L9.5 12L7 12ZM12 9.5L9.5 12L9.5 9.5ZM17 7L17 12L14.5 12L14.5 7ZM14.5 7L14.5 9.5L12 9.5L12 7ZM14.5 12L12 9.5L14.5 9.5ZM17 17L12 17L12 14.5L17 14.5ZM17 14.5L14.5 14.5L14.5 12L17 12ZM12 14.5L14.5 12L14.5 14.5ZM7 17L7 12L9.5 12L9.5 17ZM9.5 17L9.5 14.5L12 14.5L12 17ZM9.5 12L12 14.5L9.5 14.5Z"></path>
		</svg>
	);
	obj.r = (
		<svg className="account-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
			<path
				fill="#d175a1"
				d="M9.5 7L7 4.5L9.5 2L12 4.5ZM12 4.5L14.5 2L17 4.5L14.5 7ZM14.5 17L17 19.5L14.5 22L12 19.5ZM12 19.5L9.5 22L7 19.5L9.5 17ZM4.5 12L2 9.5L4.5 7L7 9.5ZM17 9.5L19.5 7L22 9.5L19.5 12ZM19.5 12L22 14.5L19.5 17L17 14.5ZM7 14.5L4.5 17L2 14.5L4.5 12ZM7 7L12 7L12 7.8L9.9 12L7 12ZM17 7L17 12L16.2 12L12 9.9L12 7ZM17 17L12 17L12 16.2L14.1 12L17 12ZM7 17L7 12L7.8 12L12 14.1L12 17Z"></path>
			<path fill="#545454" d="M7 4.5L4.5 7L2 4.5L4.5 2ZM19.5 7L17 4.5L19.5 2L22 4.5ZM17 19.5L19.5 17L22 19.5L19.5 22ZM4.5 17L7 19.5L4.5 22L2 19.5Z"></path>
		</svg>
	);
	obj.s = (
		<svg className="account-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
			<path
				fill="#59c794"
				d="M7.8 4.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M12.8 4.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M12.8 19.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M7.8 19.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M2.8 9.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M17.8 9.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M17.8 14.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M2.8 14.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M7 7L12 7L12 9.5L7 9.5ZM7 9.5L9.5 9.5L9.5 12L7 12ZM12 9.5L9.5 12L9.5 9.5ZM17 7L17 12L14.5 12L14.5 7ZM14.5 7L14.5 9.5L12 9.5L12 7ZM14.5 12L12 9.5L14.5 9.5ZM17 17L12 17L12 14.5L17 14.5ZM17 14.5L14.5 14.5L14.5 12L17 12ZM12 14.5L14.5 12L14.5 14.5ZM7 17L7 12L9.5 12L9.5 17ZM9.5 17L9.5 14.5L12 14.5L12 17ZM9.5 12L12 14.5L9.5 14.5Z"></path>
			<path fill="#e3e3e3" d="M2 7L2 2L4.5 2ZM17 2L22 2L22 4.5ZM22 17L22 22L19.5 22ZM7 22L2 22L2 19.5Z"></path>
		</svg>
	);
	obj.t = (
		<svg className="account-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
			<path fill="#5b5b5b" d="M7 2L12 2L12 7ZM17 2L17 7L12 7ZM17 22L12 22L12 17ZM7 22L7 17L12 17ZM2 7L7 7L7 12ZM22 7L22 12L17 12ZM22 17L17 17L17 12ZM2 17L2 12L7 12Z"></path>
			<path
				fill="#9c84d6"
				d="M2 7L2 2L4.5 2ZM17 2L22 2L22 4.5ZM22 17L22 22L19.5 22ZM7 22L2 22L2 19.5ZM8 8L12 8L12 12L8 12ZM16 8L16 12L12 12L12 8ZM16 16L12 16L12 12L16 12ZM8 16L8 12L12 12L12 16Z"></path>
		</svg>
	);
	obj.u = (
		<svg className="account-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
			<path
				fill="#b2e5c3"
				d="M7 7L7 2L9.5 2ZM12 2L17 2L17 4.5ZM17 17L17 22L14.5 22ZM12 22L7 22L7 19.5ZM2 12L2 7L4.5 7ZM17 7L22 7L22 9.5ZM22 12L22 17L19.5 17ZM7 17L2 17L2 14.5Z"></path>
			<path fill="#329954" d="M7 2L7 7L2 7ZM22 7L17 7L17 2ZM17 22L17 17L22 17ZM2 17L7 17L7 22Z"></path>
			<path
				fill="#66cc87"
				d="M7 7L12 7L12 9.5L7 9.5ZM7 9.5L9.5 9.5L9.5 12L7 12ZM12 9.5L9.5 12L9.5 9.5ZM17 7L17 12L14.5 12L14.5 7ZM14.5 7L14.5 9.5L12 9.5L12 7ZM14.5 12L12 9.5L14.5 9.5ZM17 17L12 17L12 14.5L17 14.5ZM17 14.5L14.5 14.5L14.5 12L17 12ZM12 14.5L14.5 12L14.5 14.5ZM7 17L7 12L9.5 12L9.5 17ZM9.5 17L9.5 14.5L12 14.5L12 17ZM9.5 12L12 14.5L9.5 14.5Z"></path>
		</svg>
	);
	obj.v = (
		<svg className="account-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
			<path
				fill="#e8e8e8"
				d="M12 4.5L9.5 7L7 4.5L9.5 2ZM14.5 7L12 4.5L14.5 2L17 4.5ZM12 19.5L14.5 17L17 19.5L14.5 22ZM9.5 17L12 19.5L9.5 22L7 19.5ZM7 9.5L4.5 12L2 9.5L4.5 7ZM19.5 12L17 9.5L19.5 7L22 9.5ZM17 14.5L19.5 12L22 14.5L19.5 17ZM4.5 12L7 14.5L4.5 17L2 14.5Z"></path>
			<path
				fill="#545454"
				d="M2.8 4.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M17.8 4.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M17.8 19.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M2.8 19.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0"></path>
			<path fill="#cb75d1" d="M8 8L12 8L12 12L8 12ZM16 8L16 12L12 12L12 8ZM16 16L12 16L12 12L16 12ZM8 16L8 12L12 12L12 16Z"></path>
		</svg>
	);
	obj.w = (
		<svg className="account-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
			<path
				fill="#eaeaea"
				d="M12 4.5L9.5 7L7 4.5L9.5 2ZM14.5 7L12 4.5L14.5 2L17 4.5ZM12 19.5L14.5 17L17 19.5L14.5 22ZM9.5 17L12 19.5L9.5 22L7 19.5ZM7 9.5L4.5 12L2 9.5L4.5 7ZM19.5 12L17 9.5L19.5 7L22 9.5ZM17 14.5L19.5 12L22 14.5L19.5 17ZM4.5 12L7 14.5L4.5 17L2 14.5Z"></path>
			<path
				fill="#6a3db7"
				d="M2.8 4.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M17.8 4.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M17.8 19.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M2.8 19.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0"></path>
			<path
				fill="#a384d6"
				d="M7 7L12 7L12 10.5L9 9L10.5 12L7 12ZM17 7L17 12L13.5 12L15 9L12 10.5L12 7ZM17 17L12 17L12 13.5L15 15L13.5 12L17 12ZM7 17L7 12L10.5 12L9 15L12 13.5L12 17Z"></path>
		</svg>
	);
	obj.s = (
		<svg className="account-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
			<path
				fill="#8a84d6"
				d="M7.8 4.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M12.8 4.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M12.8 19.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M7.8 19.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M2.8 9.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M17.8 9.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M17.8 14.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M2.8 14.5a1.7,1.7 0 1,1 3.3,0a1.7,1.7 0 1,1 -3.3,0M7 7L12 7L12 7.8L9.9 12L7 12ZM17 7L17 12L16.2 12L12 9.9L12 7ZM17 17L12 17L12 16.2L14.1 12L17 12ZM7 17L7 12L7.8 12L12 14.1L12 17Z"></path>
			<path fill="#5b5b5b" d="M7 2L7 7L2 7ZM22 7L17 7L17 2ZM17 22L17 17L22 17ZM2 17L7 17L7 22Z"></path>
		</svg>
	);
	obj.y = (
		<svg className="account-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
			<path
				fill="#4c4c4c"
				d="M9.5 2L12 4.5L9.5 7L7 4.5ZM17 4.5L14.5 7L12 4.5L14.5 2ZM14.5 22L12 19.5L14.5 17L17 19.5ZM7 19.5L9.5 17L12 19.5L9.5 22ZM4.5 7L7 9.5L4.5 12L2 9.5ZM22 9.5L19.5 12L17 9.5L19.5 7ZM19.5 17L17 14.5L19.5 12L22 14.5ZM2 14.5L4.5 12L7 14.5L4.5 17Z"></path>
			<path fill="#9ecc66" d="M4.5 2L7 4.5L4.5 7L2 4.5ZM22 4.5L19.5 7L17 4.5L19.5 2ZM19.5 22L17 19.5L19.5 17L22 19.5ZM2 19.5L4.5 17L7 19.5L4.5 22Z"></path>
			<path
				fill="#cee5b2"
				d="M7 7L12 7L12 12L7 12ZM8.8 10.1a1.3,1.3 0 1,0 2.6,0a1.3,1.3 0 1,0 -2.6,0M17 7L17 12L12 12L12 7ZM12.6 10.1a1.3,1.3 0 1,0 2.6,0a1.3,1.3 0 1,0 -2.6,0M17 17L12 17L12 12L17 12ZM12.6 13.9a1.3,1.3 0 1,0 2.6,0a1.3,1.3 0 1,0 -2.6,0M7 17L7 12L12 12L12 17ZM8.8 13.9a1.3,1.3 0 1,0 2.6,0a1.3,1.3 0 1,0 -2.6,0"></path>
		</svg>
	);
	obj.z = (
		<svg className="account-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
			<path
				fill="#4c4c4c"
				d="M9.5 2L12 4.5L9.5 7L7 4.5ZM17 4.5L14.5 7L12 4.5L14.5 2ZM14.5 22L12 19.5L14.5 17L17 19.5ZM7 19.5L9.5 17L12 19.5L9.5 22ZM4.5 7L7 9.5L4.5 12L2 9.5ZM22 9.5L19.5 12L17 9.5L19.5 7ZM19.5 17L17 14.5L19.5 12L22 14.5ZM2 14.5L4.5 12L7 14.5L4.5 17Z"></path>
			<path fill="#9ecc66" d="M4.5 2L7 4.5L4.5 7L2 4.5ZM22 4.5L19.5 7L17 4.5L19.5 2ZM19.5 22L17 19.5L19.5 17L22 19.5ZM2 19.5L4.5 17L7 19.5L4.5 22Z"></path>
			<path
				fill="#cee5b2"
				d="M7 7L12 7L12 12L7 12ZM8.8 10.1a1.3,1.3 0 1,0 2.6,0a1.3,1.3 0 1,0 -2.6,0M17 7L17 12L12 12L12 7ZM12.6 10.1a1.3,1.3 0 1,0 2.6,0a1.3,1.3 0 1,0 -2.6,0M17 17L12 17L12 12L17 12ZM12.6 13.9a1.3,1.3 0 1,0 2.6,0a1.3,1.3 0 1,0 -2.6,0M7 17L7 12L12 12L12 17ZM8.8 13.9a1.3,1.3 0 1,0 2.6,0a1.3,1.3 0 1,0 -2.6,0"></path>
		</svg>
	);
	let svg = obj[n] || obj.a;
	return (
		<span title={title} onClick={onClick}>
			{svg}
		</span>
	);
}
