const API_BASE = import.meta.env.VITE_API_BASE_URL || "/backend/api.php";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(options.headers || {}),
    },
    credentials: "same-origin",
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || data.success === false) {
    const error = new Error(data.error || `Request failed with status ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return data;
}

export async function apiRegisterUser(form) {
  return request("/register", {
    method: "POST",
    body: JSON.stringify({
      name: form.fullName,
      email: form.email,
      password: form.password,
      portal_type: form.portalType,
      department: form.department,
      designation: form.designation,
      roll_number: form.rollNumber,
      employee_id: form.employeeId,
      phone: form.phone,
    }),
  });
}

export async function apiLogin(identifier, password) {
  return request("/login", {
    method: "POST",
    body: JSON.stringify({ identifier, password }),
  });
}

export function isNetworkApiError(error) {
  return !error.status || (import.meta.env.DEV && error.status === 404);
}
