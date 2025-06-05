
const malik = [
    "gmail.com",
  "outlook.com",
  "yahoo.com",
  "hotmail.com",
  "icloud.com",
  "protonmail.com",
  "zoho.com"
]

export const emailValidator = (email) =>{
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return false;
      const domain = email.split("@")[1]?.toLowerCase();
      return malik.includes(domain);

}