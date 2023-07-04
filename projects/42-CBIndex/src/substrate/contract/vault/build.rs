use gear_wasm_builder::WasmBuilder;

fn main() {
    WasmBuilder::with_meta(<vault_io::FLogicMetadata as gmeta::Metadata>::repr())
        .exclude_features(vec!["binary-vendor"])
        .build();
}
