use ink::env::{
    call::{
        build_call,
        utils::{Argument, ArgumentList, EmptyArgumentList},
        CallParams, DelegateCall, ExecutionInput, Selector,
    },
    CallFlags, Environment,
};

#[derive(scale::Encode, scale::Decode, Debug)]
#[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
pub struct Call<E: Environment> {
    pub forward_input: bool,
    pub clone_input: bool,
    pub tail_call: bool,
    pub allow_reentry: bool,
    pub code_hash: E::Hash,
    pub selector: [u8; 4],
    pub opaque_agrs: OpaqueTypes,
}

impl<E: Environment> Call<E> {
    #[inline]
    pub fn from_typed<Args: scale::Encode>(
        code_hash: E::Hash,
        selector: [u8; 4],
        args: &Args,
    ) -> Self {
        Self::new(
            code_hash,
            selector,
            OpaqueTypes(scale::Encode::encode(args)),
        )
    }

    #[inline]
    pub fn new(code_hash: E::Hash, selector: [u8; 4], opaque_agrs: OpaqueTypes) -> Self {
        Self {
            forward_input: false,
            clone_input: false,
            tail_call: false,
            allow_reentry: false,
            code_hash,
            selector,
            opaque_agrs,
        }
    }

    pub fn set_forward_input(mut self, forward_input: bool) -> Self {
        self.forward_input = forward_input;
        self
    }

    pub fn set_clone_input(mut self, clone_input: bool) -> Self {
        self.clone_input = clone_input;
        self
    }

    pub fn set_tail_call(mut self, tail_call: bool) -> Self {
        self.tail_call = tail_call;
        self
    }

    pub fn set_allow_reentry(mut self, allow_reentry: bool) -> Self {
        self.allow_reentry = allow_reentry;
        self
    }

    pub fn into_call_params(self) -> CallParams<E, DelegateCall<E>, Args, OpaqueTypes> {
        self.into()
    }
}

#[derive(Debug)]
#[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
pub struct OpaqueTypes(pub Vec<u8>);

impl scale::Encode for OpaqueTypes {
    #[inline]
    fn size_hint(&self) -> usize {
        self.0.len()
    }

    #[inline]
    fn encode_to<O: scale::Output + ?Sized>(&self, output: &mut O) {
        output.write(&self.0);
    }
}

impl scale::Decode for OpaqueTypes {
    #[inline]
    fn decode<I: scale::Input>(input: &mut I) -> Result<Self, scale::Error> {
        let len = input.remaining_len()?;

        let mut bytes;

        if let Some(len) = len {
            bytes = vec![0; len];
            input.read(&mut bytes[..len])?;
        } else {
            bytes = Vec::new();
            loop {
                match input.read_byte() {
                    Ok(b) => bytes.push(b),
                    Err(_) => break,
                }
            }
        };

        Ok(OpaqueTypes(bytes))
    }
}

type Args = ArgumentList<Argument<OpaqueTypes>, EmptyArgumentList>;

impl<E: Environment> Into<CallParams<E, DelegateCall<E>, Args, OpaqueTypes>> for Call<E> {
    fn into(self) -> CallParams<E, DelegateCall<E>, Args, OpaqueTypes> {
        let Call {
            forward_input,
            clone_input,
            tail_call,
            allow_reentry,
            code_hash,
            selector,
            opaque_agrs,
            ..
        } = self;
        let call = build_call::<E>()
            .call_flags(
                CallFlags::default()
                    .set_allow_reentry(allow_reentry)
                    .set_clone_input(clone_input)
                    .set_forward_input(forward_input)
                    .set_tail_call(tail_call),
            )
            .call_type(DelegateCall::<E>::new(code_hash))
            .exec_input(ExecutionInput::new(Selector::new(selector)).push_arg(opaque_agrs))
            .returns::<OpaqueTypes>();

        call.params()
    }
}

#[cfg(test)]

mod tests {
    use ink::{env::DefaultEnvironment, primitives::Hash};

    use super::*;

    #[test]
    fn test_call() {
        let call: Call<DefaultEnvironment> = Call::new(
            Hash::from([1; 32]),
            [2; 4],
            OpaqueTypes(vec![1, 2, 3, 4, 5]),
        );
        println!("{call:?}");
    }
    #[test]
    fn test_opaque_types() {
        fn test_opaque_types<T>(value: T)
        where
            T: scale::Encode + scale::Decode + PartialEq + std::fmt::Debug,
        {
            let encoded = value.encode();
            let opaque_types = OpaqueTypes(encoded.clone());
            assert_eq!(scale::Encode::encode(&opaque_types), encoded);
            let decoded: OpaqueTypes =
                scale::Decode::decode(&mut &encoded[..]).expect("decode failed");
            assert_eq!(decoded.0, opaque_types.0);
            let value = T::decode(&mut &decoded.0[..]).expect("decode failed");
            println!("{}: {value:?}", core::any::type_name::<T>());
        }
        test_opaque_types(true);
        test_opaque_types(123);
        test_opaque_types(456i64);
        test_opaque_types("hello".to_owned());
        test_opaque_types(vec![1, 2, 3]);
        test_opaque_types((true, "world".to_owned()));
    }
}
