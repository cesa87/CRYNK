use actix_web::{web, App, HttpResponse, HttpServer, Responder};
use serde::{Deserialize, Serialize};
use sqlx::MySqlPool;
use dotenv::dotenv;
use std::env;
use bcrypt::{verify, hash, DEFAULT_COST};
use serde_json::json;

#[derive(Serialize)]
struct User {
    id: i32,
    username: String,
}

#[derive(Deserialize)]
struct LoginRequest {
    username: String,
    password: String,
}

#[derive(Deserialize)]
struct RegisterRequest {
    first_name: String,
    last_name: String,
    email: String,
    mobile: String,
    username: String,
    password: String,
}

async fn login(
    pool: web::Data<MySqlPool>,
    credentials: web::Json<LoginRequest>,
) -> impl Responder {
    // Fetch user from the database
    let result = sqlx::query(
        "SELECT id, username, password_hash FROM crynk_users WHERE username = ?",
        credentials.username
    )
    .fetch_one(&**pool)
    .await;

    match result {
        Ok(row) => {
            // Verify the password
            if verify(&credentials.password, &row.password_hash).unwrap_or(false) {
                HttpResponse::Ok().json(json!({
                    "success": true,
                    "message": "Login successful",
                    "user": {
                        "id": row.id,
                        "username": row.username,
                    }
                }))
            } else {
                HttpResponse::Unauthorized().json(json!({
                    "success": false,
                    "message": "Invalid credentials",
                }))
            }
        }
        Err(_) => HttpResponse::Unauthorized().json(json!({
            "success": false,
            "message": "Invalid credentials",
        })),
    }
}

async fn register_user(
    pool: web::Data<MySqlPool>,
    user: web::Json<RegisterRequest>,
) -> impl Responder {
    // Hash the password
    let hashed_password = match hash(&user.password, DEFAULT_COST) {
        Ok(hash) => hash,
        Err(_) => return HttpResponse::InternalServerError().json(json!({
            "success": false,
            "message": "Failed to hash password",
        })),
    };

    // Insert the user into the database
    let result = sqlx::query!(
        "INSERT INTO crynk_users (first_name, last_name, email, mobile, username, password_hash) VALUES (?, ?, ?, ?, ?, ?)",
        user.first_name,
        user.last_name,
        user.email,
        user.mobile,
        user.username,
        hashed_password
    )
    .execute(&**pool)
    .await;

    match result {
        Ok(_) => HttpResponse::Ok().json(json!({
            "success": true,
            "message": "User created successfully",
        })),
        Err(_) => HttpResponse::InternalServerError().json(json!({
            "success": false,
            "message": "Error creating user",
        })),
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Load environment variables from .env file
    dotenv().ok();

    // Get the database URL from the environment
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");

    // Create a connection pool
    let pool = MySqlPool::connect(&database_url)
        .await
        .expect("Failed to connect to the database");

    // Start the HTTP server
    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(pool.clone())) // Share the connection pool with the app
            .route("/api/login", web::post().to(login)) // Login endpoint
            .route("/api/register", web::post().to(register_user)) // Register endpoint
    })
    .bind("0.0.0.0:8080")? // Bind to all network interfaces:8080
    .run()
    .await
}
