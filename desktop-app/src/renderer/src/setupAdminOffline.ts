import { saveCredential } from "./services/db";

export function setupDefaultLocalAdmin() {
  saveCredential({
    username: "vikasyadav780@yahoo.com",
    password: "Vikas$#9136", // match online for first setup
    role: "admin",
    isActive: true,
  });
}
