use core::fmt;

mod traits;

#[derive(Debug, Default)]
pub struct Id(u64);
#[derive(Debug, Default)]
pub struct VarChar(String);
#[derive(Default)]
pub struct Blob(Vec<u8>);
#[derive(Debug, Default)]
pub struct Bool(bool);
#[derive(Debug, Default)]
pub struct Integer(i64);
#[derive(Debug, Default)]
pub struct Real(f64);

impl fmt::Debug for Blob {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "Blob(rawData:?)")
    }
}
