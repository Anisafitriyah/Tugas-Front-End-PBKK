import axios from "axios";

// Ganti dengan URL backend Laravel kamu
const BASE_URL = "http://127.0.0.1:8000/api";

const getToken = () => localStorage.getItem("token"); // atau dari cookies

export const login = async (name: string, password: string) => {
  const response = await axios.post(`${BASE_URL}/login`, {
    name,
    password,
  });
  return response.data;
};

export const logout = async (token: string | null) => {
  if (!token) throw new Error("Token tidak ditemukan");

  const res = await axios.post(
    `${BASE_URL}/logout`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

//api user
export async function fetchUsers() {
  const res = await fetch(`${BASE_URL}/user`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
}
export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  role: string;
}) {
  const res = await fetch(`${BASE_URL}/user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateUser(id: string, data: any) {
  const token = getToken();
  if (!token) throw new Error("Token tidak ditemukan");

  const res = await fetch(`${BASE_URL}/user/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("Gagal update:", errText);
    throw new Error("Update gagal: " + errText);
  }

  return res.json();
}

export async function deleteUser(id: number) {
  const res = await fetch(`${BASE_URL}/user/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
}

//api author
export async function fetchAuthor() {
  const res = await fetch(`${BASE_URL}/author`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
}
export async function createAuthor(data: {
  name: string;
  nationality: string;
  birthdate: string;
}) {
  const res = await fetch(`${BASE_URL}/author`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",

      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    const e = new Error("Gagal update");
    (e as any).response = {
      status: res.status,
      json: async () => error,
    };
    throw e;
  }
  return res.json();
}

export async function updateAuthor(id: string, data: any) {
  const token = getToken();
  if (!token) throw new Error("Token tidak ditemukan");

  const res = await fetch(`${BASE_URL}/author/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    const e = new Error("Gagal update");
    (e as any).response = {
      status: res.status,
      json: async () => error,
    };
    throw e;
  }

  return res.json();
}

export async function deleteAuthor(id: number) {
  const res = await fetch(`${BASE_URL}/author/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
}

//api Books
export async function fetchBook() {
  const res = await fetch(`${BASE_URL}/book`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
}
export async function createBook(data: {
  title: string;
  isbn: string;
  publisher: string;
  year_published: number;
  stock: number;
}) {
  const res = await fetch(`${BASE_URL}/book`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateBook(id: string, data: any) {
  const token = getToken();
  if (!token) throw new Error("Token tidak ditemukan");

  const res = await fetch(`${BASE_URL}/book/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("Gagal update:", errText);
    throw new Error("Update gagal: " + errText);
  }

  return res.json();
}

export async function deleteBook(id: number) {
  const res = await fetch(`${BASE_URL}/book/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
}

//api categories
export async function fetchBookAuthor() {
  const res = await fetch(`${BASE_URL}/bookDetails`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
}

export async function createBookAuthor(data: {
  name: string;
  product_id: string;
  description: string;
}) {
  const res = await fetch(`${BASE_URL}/bookDetails`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateBookAuthor(id: string, data: any) {
  const token = getToken();
  if (!token) throw new Error("Token tidak ditemukan");

  const res = await fetch(`${BASE_URL}/bookDetails/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("Gagal update:", errText);
    throw new Error("Update gagal: " + errText);
  }

  return res.json();
}

export async function deleteBookAuthor(id: number) {
  const res = await fetch(`${BASE_URL}/bookDetails/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
}

//api Order
export async function fetchLoan() {
  const res = await fetch(`${BASE_URL}/loans`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
}
export async function createLoan(data: {
  user_id: string;
  loan_date: string;
  status: string;
}) {
  const res = await fetch(`${BASE_URL}/loans`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  console.log("✅ Response dari createOrders:", json); // Tambahkan log ini

  return json;
}

export async function updateLoan(id: string, data: any) {
  const token = getToken();
  if (!token) throw new Error("Token tidak ditemukan");

  const res = await fetch(`${BASE_URL}/loans/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("Gagal update:", errText);
    throw new Error("Update gagal: " + errText);
  }

  return res.json();
}

export async function deleteLoan(id: number) {
  const res = await fetch(`${BASE_URL}/loans/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
}

export async function fetchLoanItemsAll() {
  const res = await fetch(`${BASE_URL}/loan-items`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
}

export async function fetchLoanItems(loanId: string) {
  const res = await fetch(`${BASE_URL}/loans/${loanId}`, {
    // endpoint loans, bukan loan-items
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) throw new Error("Gagal ambil detail order");

  const data = await res.json();
  return data.loan_items || [];
}

export async function saveLoanItems(loanId: string, items: any[]) {
  const token = getToken();
  const res = await fetch(`${BASE_URL}/loan-items/${loanId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ items }), // ✅ HARUS { items: [...] }
  });

  if (!res.ok) {
    const error = await res.json();
    throw error;
  }

  return res.json();
}

export async function updateLoanItems(loanId: string, total: number) {
  const res = await fetch(`${BASE_URL}/loan-items/${loanId}/updateTotal`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ total }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw err;
  }

  return res.json();
}

//api stock
export async function fetchReturns() {
  const res = await fetch(`${BASE_URL}/returns`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
}

export async function updateReturns(id: number, data: any) {
  const token = getToken();
  if (!token) throw new Error("Token tidak ditemukan");

  const res = await fetch(`${BASE_URL}/returns/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("Gagal update:", errText);
    throw new Error("Update gagal: " + errText);
  }

  return res.json();
}

export async function deleteReturns(id: number) {
  const res = await fetch(`${BASE_URL}/returns/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
}

//api order
export async function fetchReturnItems() {
  const res = await fetch(`${BASE_URL}/order`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
}

// ====================
// API: Detail Peminjaman
// ====================

export async function fetchReturnDetails() {
  const res = await fetch(`${BASE_URL}/return-items`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
}

export async function fetchReturnDetailById(returnId: string) {
  const res = await fetch(`${BASE_URL}/return-items/by-return/${returnId}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gagal ambil detail pengembalian: ${err}`);
  }

  const data = await res.json();

  // Optional: kamu bisa transformasi di sini kalau mau bentuknya mirip sebelumnya
  return data; // ini sekarang array of return_items
}

/////////////////////////////////////////////
export async function createReturns(data: {
  loan_id: string;
  return_date: string;
  items: any[];
}) {
  const res = await fetch(`${BASE_URL}/returns`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function saveReturnItems(
  returnId: string,
  data: { items: any[] }
) {
  const res = await fetch(`${BASE_URL}/return-items/${returnId}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}
////====================
// Hitung
export async function fetchDashboardCounts() {
  const res = await fetch(`${BASE_URL}/dashboard-counts`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  if (!res.ok) throw new Error("Gagal mengambil data dashboard");
  return res.json();
}

// ✅ Register
export async function register(data: {
  name: string;
  email: string;
  password: string;
}) {
  const res = await axios.post(`${BASE_URL}/register`, {
    name: data.name,
    email: data.email,
    password: data.password,
  });
  return res.data;
}
