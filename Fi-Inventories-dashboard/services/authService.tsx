const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function registerUser(userData: any) {
    const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.msg || "Registration failed");
    }

    return data;
}

export async function loginUser(userData: any) {
   const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.msg || "Login failed");
    }

    return data;
}