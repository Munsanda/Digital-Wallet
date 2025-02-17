# Project Setup Guide

## Prerequisites
Ensure you have the following installed:

- **Backend:**
  - .NET SDK (version 7.0 or later)
  - SQL Server (or an alternative database like PostgreSQL, MySQL, etc.)
  - Entity Framework Core CLI (if using migrations)

- **Frontend:**
  - Node.js (version 18 or later)
  - npm or yarn

## Backend Setup (ASP.NET Core API)

1. **Clone the repository:**
   ```sh
   git clone https://github.com/Munsanda/Digital-Wallet
   cd digital-wallet-backend
   ```

2. **Restore dependencies:**s
   ```sh
   dotnet restore
   ```

3. **Update the database connection string:**
   - Open `appsettings.json` or `appsettings.Development.json`
   - Modify the `ConnectionStrings` section to point to your database

4. **Apply Migrations (if using EF Core):**
   ```sh
   dotnet ef database update
   ```

5. **Run the API:**
   ```sh
   dotnet run
   ```
   The API should now be running at `https://localhost:5029` .

## Frontend Setup (React TypeScript with Vite)

1. **Navigate to the frontend directory:**
   ```sh
   cd frontend
   ```

2. **Install dependencies:**
   ```sh
   npm install  # or yarn install
   ```


3. **Run the frontend:**
   ```sh
   npm run dev  # or yarn dev
   ```
   The frontend should now be running at `http://localhost:5173` (or a different port if specified).

## Testing the Integration
- Ensure both backend and frontend are running.
- Open the frontend in your browser and test API interactions.
- Use **Postman** or **cURL** to test API endpoints directly.


## Troubleshooting
- **Database issues?** Ensure SQL Server is running and the connection string is correct.
- **CORS errors?** Modify the backend to allow frontend requests in `Program.cs`:
  ```csharp
  builder.Services.AddCors(options =>
  {
      options.AddPolicy("AllowAll", policy => policy
          .AllowAnyOrigin()
          .AllowAnyMethod()
          .AllowAnyHeader());
  });
  ```
  Then, apply it in the request pipeline:
  ```csharp
  app.UseCors("AllowAll");
  ```

---

Now, you should have a DigiWallet application running locally! Each user will have an initial balance of 5 Kwacha

![image](https://github.com/user-attachments/assets/fd9a8250-ec70-47bf-ae4b-15be34d63241)

![image](https://github.com/user-attachments/assets/e3378ccd-b8e0-4a01-9e0e-8ebf32760ee8)

