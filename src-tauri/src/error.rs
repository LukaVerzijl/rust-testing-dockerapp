use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub enum CommandError {
    #[error("Docker api Error: {0}")]
    DockerError(String),

    #[error("Unexpected Error: {0}")]
    UnexpectedError(String),

}