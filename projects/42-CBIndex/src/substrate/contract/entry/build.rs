use gear_wasm_builder::WasmBuilder;

fn main() {
    WasmBuilder::with_meta(<entry_io::FMainTokenMetadata as gmeta::Metadata>::repr())
        .exclude_features(vec!["binary-vendor"])
        .build();
}
