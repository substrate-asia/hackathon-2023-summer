use std::env;

fn main () {

    let sdk_dir = env::var("SGX_SDK")
                    .unwrap_or_else(|_| "/opt/intel/sgxsdk/sgxsdk".to_string());
    let is_sim = env::var("SGX_MODE")
                    .unwrap_or_else(|_| "HW".to_string());
    let ssl_dir = env::var("SGXSSL_CRYPTO")
                    .unwrap_or_else(|_| "/opt/intel/sgxssl/".to_string());

    println!("cargo:rustc-link-search=native=../lib");
    println!("cargo:rustc-link-lib=static=Enclave_u");
    println!("cargo:rustc-link-search={}/lib64/", sdk_dir);
    println!("cargo:rustc-link-search={}/lib64/", ssl_dir);
    println!("cargo:rustc-link-lib=static=sgx_usgxssl");
    println!("cargo:rustc-link-search=native={}/lib64", sdk_dir);
    println!("cargo:include=native={}/include/", ssl_dir);
    match is_sim.as_ref() {
        "SW" => println!("cargo:rustc-link-lib=dylib=sgx_urts_sim"),
        "HW" => println!("cargo:rustc-link-lib=dylib=sgx_urts"),
        _    => println!("cargo:rustc-link-lib=dylib=sgx_urts"), // Treat undefined as HW
    }
}
