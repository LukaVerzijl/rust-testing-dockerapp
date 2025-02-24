use crate::error::CommandError;
use crate::payload::{Container, Image};
use bollard::container::{
    Config, CreateContainerOptions, KillContainerOptions, ListContainersOptions, LogsOptions,
    StopContainerOptions,
};
use bollard::image::{ListImagesOptions, RemoveImageOptions};
use bollard::Docker;
use futures_util::StreamExt;
use tauri::ipc::Channel;
use tauri::State;

mod error;
mod payload;

struct AppState {
    docker: Docker,
}

//function to get the current containers
#[tauri::command]
async fn list_containers(state: State<'_, AppState>) -> Result<Vec<Container>, CommandError> {
    // get running docker
    let docker = &state.docker;

    //get all containers if error return error
    let containers = docker
        .list_containers(Some(ListContainersOptions::<String> {
            all: true,
            ..Default::default()
        }))
        .await
        .map_err(|e| CommandError::DockerError(e.to_string()))?;

    //if ok map all containers into a container item made in Payload.rs
    Ok(containers.into_iter().map(|item| Container {
        name: item.names.and_then(|name| {
            name.first()
                .map(|name2| name2.strip_prefix('/').unwrap_or(name2).to_owned())
        }),
        status: item.status,
        state: item.state,
        ports: item
            .ports
            .map(|ports| ports.into_iter().filter_map(|port| port.ip).collect()),
    }).collect())

}

#[tauri::command]
async fn list_images(state: State<'_, AppState>) -> Result<Vec<Image>, CommandError> {
    //get docker
    let docker = &state.docker;

    //get images
    let images = docker
        .list_images(Some(ListImagesOptions::<String> {
            all: true,
            ..Default::default()
        }))
        .await
        .map_err(|e| CommandError::DockerError(e.to_string()))?;

    //map images to image component
    Ok(images.into_iter().map(|image| Image {
        repo_tag: image.repo_tags.first().unwrap_or(&String::new()).to_owned(),
        size: image.size,
    }).collect())
}

#[tauri::command]
async fn emit_logs(
    state: State<'_, AppState>,
    name: &str,
    on_event: Channel<String>,
) -> Result<(), CommandError> {
    //get docker
    let docker = &state.docker;

    //get options from container
    let options = Some(LogsOptions::<String> {
        stdout: true,
        stderr: true,
        tail: "all".parse().unwrap(),
        ..Default::default()
    });

    //create a stream
    let mut logs_stream = docker.logs(name, options);

    //loop while stream comes in
    while let Some(log_result) = logs_stream.next().await {
        match log_result {
            Ok(log) => {
                on_event.send(log.to_string()).map_err(|e| {
                    CommandError::UnexpectedError(format!("Failed to send log to channel {}", e))
                })?;
            }
            Err(e) => {
                return Err(CommandError::DockerError(format!(
                    "Failed to fetch logs: {}",
                    e
                )))
            }
        }
    }

    Ok(())
}

#[tauri::command]
async fn stop_container(state: State<'_, AppState>, name: &str) -> Result<(), CommandError> {
    //get docker
    let docker = &state.docker;

    //list with options
    let options = StopContainerOptions { t: 10 };

    //stop container
    docker
        .stop_container(name, Some(options))
        .await
        .map_err(|e| CommandError::DockerError(format!("Failed to stop container {}", e)))?;

    Ok(())
}

#[tauri::command]
async fn create_container(state: State<'_, AppState>, image: String) -> Result<(), CommandError> {
    //get docker
    let docker = &state.docker;

    //make config
    let config = Config {
        image: Some(image),
        ..Default::default()
    };

    //create container itself
    let res = docker
        .create_container(None::<CreateContainerOptions<&str>>, config)
        .await
        .map_err(|e| CommandError::DockerError(format!("Failed to create container! {}", e)))?;

    //start container
    docker
        .start_container::<String>(&res.id, None)
        .await
        .map_err(|e| CommandError::DockerError(format!("Failed to start Container! {}", e)))?;

    println!("Container {} started!", res.id);

    Ok(())
}

#[tauri::command]
async fn remove_image(state: State<'_, AppState>, image: &str) -> Result<(), CommandError> {
    //get docker
    let docker = &state.docker;

    let options = RemoveImageOptions {
        force: true,
        ..Default::default()
    };

    docker
        .remove_image(image, Some(options), None)
        .await
        .map_err(|e| CommandError::DockerError(format!("Failed to remove image {}", e)))?;

    Ok(())
}

#[tauri::command]
async fn kill_container(state: State<'_, AppState>, name: &str) -> Result<(), CommandError> {
    let docker = &state.docker;

    let options = KillContainerOptions { signal: "SIGKILL" };

    docker
        .kill_container(name, Some(options))
        .await
        .map_err(|e| CommandError::DockerError(format!("Failed to kill container {}", e)))?;

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .manage(AppState {
            docker: Docker::connect_with_local_defaults().unwrap(),
        })
        .invoke_handler(tauri::generate_handler![
            list_containers,
            list_images,
            emit_logs,
            create_container,
            remove_image,
            stop_container,
            kill_container
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
