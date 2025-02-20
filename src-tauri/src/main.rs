// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use futures_util::StreamExt;
use serde::{Deserialize, Serialize};
use serde_json::json;
use tauri::Emitter;

#[derive(Debug, Deserialize)]
struct StreamChunk {
    content: Option<String>,
    error: Option<String>,
    finish_reason: Option<String>,
    done: Option<bool>,
}

#[derive(Debug, Serialize, Deserialize)]
struct Message {
    role: String,
    content: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct TextFile {
    name: String,
    #[serde(rename = "type")]
    type_: String,
    size: u64,
    content: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
struct ImageFile {
    name: String,
    #[serde(rename = "type")]
    type_: String,
    size: u64,
    #[serde(rename = "base64Content")]
    base64_content: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
struct ContextInfo {
    #[serde(rename = "webSearch")]
    web_search: bool,
    #[serde(rename = "deepSearch")]
    deep_search: bool,
    think: bool,
    #[serde(rename = "textFiles")]
    text_files: Option<Vec<TextFile>>,
    #[serde(rename = "imageFiles")]
    image_files: Option<Vec<ImageFile>>,
}

#[derive(Debug, Serialize, Clone)]
struct StreamResponse {
    content: Option<String>,
    error: Option<String>,
    done: bool,
}

#[tauri::command]
async fn chat(
    messages: Vec<Message>,
    context_info: ContextInfo,
    app_handle: tauri::AppHandle,
) -> Result<(), String> {
    let client = reqwest::Client::new();

    // Spawn the streaming task
    tauri::async_runtime::spawn(async move {
        let res = client
            .post("https://ai-gateaway-production.up.railway.app/api/chat")
            .json(&json!({
                "messages": messages,
                "context": context_info
            }))
            .header("Content-Type", "application/json")
            .header("Accept", "text/event-stream")
            .send()
            .await;

        match res {
            Ok(response) => {
                if !response.status().is_success() {
                    let _ = app_handle.emit(
                        "chat_stream",
                        StreamResponse {
                            content: None,
                            error: Some(format!("HTTP error: {}", response.status())),
                            done: true,
                        },
                    );
                    return;
                }

                let mut stream = response.bytes_stream();
                let mut buffer = String::new();

                while let Some(chunk) = stream.next().await {
                    match chunk {
                        Ok(bytes) => {
                            if let Ok(text) = String::from_utf8(bytes.to_vec()) {
                                buffer.push_str(&text);

                                // Process each line immediately
                                while let Some(pos) = buffer.find('\n') {
                                    let line = buffer[..pos].trim().to_string();
                                    buffer = buffer[pos + 1..].to_string();

                                    if line.starts_with("data: ") {
                                        let data = &line[6..];
                                        if data == "[DONE]" {
                                            // Ensure any remaining content in buffer is processed
                                            if !buffer.trim().is_empty() {
                                                if let Ok(chunk) = serde_json::from_str::<StreamChunk>(
                                                    &buffer.trim(),
                                                ) {
                                                    if let Some(content) = chunk.content {
                                                        let _ = app_handle.emit(
                                                            "chat_stream",
                                                            StreamResponse {
                                                                content: Some(content),
                                                                error: None,
                                                                done: false,
                                                            },
                                                        );
                                                    }
                                                }
                                            }

                                            let _ = app_handle.emit(
                                                "chat_stream",
                                                StreamResponse {
                                                    content: None,
                                                    error: None,
                                                    done: true,
                                                },
                                            );
                                            return;
                                        }

                                        match serde_json::from_str::<StreamChunk>(data) {
                                            Ok(chunk) => {
                                                if let Some(error) = chunk.error {
                                                    let _ = app_handle.emit(
                                                        "chat_stream",
                                                        StreamResponse {
                                                            content: None,
                                                            error: Some(error),
                                                            done: true,
                                                        },
                                                    );
                                                    return;
                                                }

                                                if let Some(content) = chunk.content {
                                                    // Emit immediately without waiting
                                                    let _ = app_handle.emit(
                                                        "chat_stream",
                                                        StreamResponse {
                                                            content: Some(content),
                                                            error: None,
                                                            done: false,
                                                        },
                                                    );
                                                }

                                                if chunk.done.unwrap_or(false)
                                                    || chunk.finish_reason.is_some()
                                                {
                                                    let _ = app_handle.emit(
                                                        "chat_stream",
                                                        StreamResponse {
                                                            content: None,
                                                            error: None,
                                                            done: true,
                                                        },
                                                    );
                                                    return;
                                                }
                                            }
                                            Err(e) => {
                                                let _ = app_handle.emit(
                                                    "chat_stream",
                                                    StreamResponse {
                                                        content: None,
                                                        error: Some(format!(
                                                            "Failed to parse chunk: {}",
                                                            e
                                                        )),
                                                        done: true,
                                                    },
                                                );
                                                return;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        Err(e) => {
                            let _ = app_handle.emit(
                                "chat_stream",
                                StreamResponse {
                                    content: None,
                                    error: Some(format!("Stream error: {}", e)),
                                    done: true,
                                },
                            );
                            return;
                        }
                    }
                }
            }
            Err(e) => {
                let _ = app_handle.emit(
                    "chat_stream",
                    StreamResponse {
                        content: None,
                        error: Some(format!("Request error: {}", e)),
                        done: true,
                    },
                );
            }
        }
    });

    Ok(())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![chat])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
