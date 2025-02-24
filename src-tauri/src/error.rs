use serde::{Deserialize, Serialize};
use thiserror::Error;

#[derive(Serialize, Deserialize,Error, Debug)]
pub enum CommandError {
    #[error("Docker api Error: {0}")]
    DockerError(String),

    #[error("Unexpected Error: {0}")]
    UnexpectedError(String),
}
